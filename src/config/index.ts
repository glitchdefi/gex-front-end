import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

// * FIXME:
export const BASE_BSC_SCAN_URLS = {
  [ChainId.BSC]: 'https://bscscan.com',
  [ChainId.BSC_TESTNET]: 'https://testnet.bscscan.com',
  // [ChainId.GLITCH]: 'https://testnet-explorer.glitch.finance',
  [ChainId.GLITCH]: process.env.NEXT_PUBLIC_GLITCH_EXPLORER || 'https://testnet.snowtrace.io',
}

export const CAKE_PER_BLOCK = 40
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.BSC]
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 250000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
