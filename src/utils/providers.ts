import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const GLITCH_PROD_NODE = process.env.NEXT_PUBLIC_GLITCH_RPC || 'https://rpc-fullnodes-testnet.glitch.finance'

export const glitchRpcProvider = new StaticJsonRpcProvider(GLITCH_PROD_NODE)

export default null
