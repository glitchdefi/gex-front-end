import { createClient, configureChains } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CHAINS_STARGATE_TESTNET } from '@pancakeswap/wagmi'

// * FIXME:
export const { provider, chains } = configureChains(
  [...CHAINS_STARGATE_TESTNET],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        // return { http: chain.rpcUrls.default }
        return { http: process.env.NEXT_PUBLIC_GLITCH_RPC }
      },
    }),
  ],
)

export const injectedConnector = new InjectedConnector({
  chains,
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'Glitch',
    appLogoUrl: 'https://pancakeswap.com/logo.png',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
})

export const client = createClient({
  autoConnect: true,
  provider,
  // connectors: [injectedConnector, coinbaseConnector, walletConnectConnector],
  connectors: [injectedConnector],
})
