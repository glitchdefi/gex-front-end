import { Token, ChainId } from '@pancakeswap/sdk'
import { CAKE_BNB_LP_MAINNET } from './farms'
import { Ifo } from './types'

export const cakeBnbLpToken = new Token(ChainId.BSC, CAKE_BNB_LP_MAINNET, 18, 'CAKE-BNB LP')

const ifos: Ifo[] = []

export default ifos
