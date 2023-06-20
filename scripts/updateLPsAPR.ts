import fs from 'fs'
import os from 'os'
import { request, gql } from 'graphql-request'
import BigNumber from 'bignumber.js'
import { sub, getUnixTime } from 'date-fns'
import type { BlockResponse } from '../src/components/SubgraphHealthIndicator'
import { BLOCKS_CLIENT } from '../src/config/constants/endpoints'
import { infoClient } from '../src/utils/graphql'

const BLOCK_SUBGRAPH_ENDPOINT = BLOCKS_CLIENT

interface SingleFarmResponse {
  id: string
  reserveUSD: string
  volumeUSD: string
}

interface FarmsResponse {
  farmsAtLatestBlock: SingleFarmResponse[]
  farmsOneWeekAgo: SingleFarmResponse[]
}

interface AprMap {
  [key: string]: BigNumber
}

const getWeekAgoTimestamp = () => {
  const weekAgo = sub(new Date(), { weeks: 1 })
  return getUnixTime(weekAgo)
}

const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429

const getBlockAtTimestamp = async (timestamp: number) => {
  try {
    const { blocks } = await request<BlockResponse>(
      BLOCK_SUBGRAPH_ENDPOINT,
      `query getBlock($timestampGreater: Int!, $timestampLess: Int!) {
        blocks(first: 1, where: { timestamp_gt: $timestampGreater, timestamp_lt: $timestampLess }) {
          number
        }
      }`,
      { timestampGreater: timestamp, timestampLess: timestamp + 600 },
    )
    return parseInt(blocks[0].number, 10)
  } catch (error) {
    throw new Error(`Failed to fetch block number for ${timestamp}\n${error}`)
  }
}

const getAprsForFarmGroup = async (addresses: string[], blockWeekAgo: number): Promise<AprMap> => {
  try {
    const { farmsAtLatestBlock, farmsOneWeekAgo } = await infoClient.request<FarmsResponse>(
      gql`
        query farmsBulk($addresses: [String]!, $blockWeekAgo: Int!) {
          farmsAtLatestBlock: pairs(first: 30, where: { id_in: $addresses }) {
            id
            volumeUSD
            reserveUSD
          }
          farmsOneWeekAgo: pairs(first: 30, where: { id_in: $addresses }, block: { number: $blockWeekAgo }) {
            id
            volumeUSD
            reserveUSD
          }
        }
      `,
      { addresses, blockWeekAgo },
    )
    const aprs: AprMap = farmsAtLatestBlock.reduce((aprMap, farm) => {
      const farmWeekAgo = farmsOneWeekAgo.find((oldFarm) => oldFarm.id === farm.id)
      // In case farm is too new to estimate LP APR (i.e. not returned in farmsOneWeekAgo query) - return 0
      let lpApr = new BigNumber(0)
      if (farmWeekAgo) {
        const volume7d = new BigNumber(farm.volumeUSD).minus(new BigNumber(farmWeekAgo.volumeUSD))
        const lpFees7d = volume7d.times(LP_HOLDERS_FEE)
        const lpFeesInAYear = lpFees7d.times(WEEKS_IN_A_YEAR)
        // Some untracked pairs like KUN-QSD will report 0 volume
        if (lpFeesInAYear.gt(0)) {
          const liquidity = new BigNumber(farm.reserveUSD)
          lpApr = lpFeesInAYear.times(100).dividedBy(liquidity)
        }
      }
      return {
        ...aprMap,
        [farm.id]: lpApr.decimalPlaces(2).toNumber(),
      }
    }, {})
    return aprs
  } catch (error) {
    throw new Error(`Failed to fetch LP APR data: ${error}`)
  }
}
