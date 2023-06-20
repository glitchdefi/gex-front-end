import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const GLITCH_PROD_NODE = process.env.NEXT_PUBLIC_GLITCH_RPC || 'https://api.avax-test.network/ext/bc/C/rpc'

export const glitchRpcProvider = new StaticJsonRpcProvider(GLITCH_PROD_NODE)

export default null
