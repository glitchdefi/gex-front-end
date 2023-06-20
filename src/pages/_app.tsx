import { Fragment, useState, useEffect } from 'react'
import { ResetCSS } from '@pancakeswap/uikit'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus'
import FixedSubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { ToastListener } from 'contexts/ToastsContext'
import useEagerConnect from 'hooks/useEagerConnect'
import useEagerConnectMP from 'hooks/useEagerConnect.bmp'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import useUserAgent from 'hooks/useUserAgent'
import useThemeCookie from 'hooks/useThemeCookie'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { PersistGate } from 'redux-persist/integration/react'
import { useStore, persistor } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { NextPage } from 'next'
import { Blocklist, Updaters } from '..'
// import ErrorBoundary from '../components/ErrorBoundary'
import Menu from '../components/Menu'
import Providers from '../Providers'
import GlobalStyle from '../style/Global'

const EasterEgg = dynamic(() => import('components/EasterEgg'), { ssr: false })

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: #000;
  position: absolute;
  top: 0;
  z-index: 99;

  animation: hideAnimation 0s ease-in 1.2s;
  animation-fill-mode: forwards;

  img {
    width: 100%;
    height: auto;
  }

  @keyframes hideAnimation {
    to {
      visibility: hidden;
      width: 0;
      height: 0;
    }
  }
`;


// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function GlobalHooks() {
  usePollBlockNumber()
  useEagerConnect()
  // usePollCoreFarmData()
  useUserAgent()
  useAccountEventListener()
  useThemeCookie()
  return null
}

function MPGlobalHooks() {
  usePollBlockNumber()
  useEagerConnectMP()
  // usePollCoreFarmData()
  useUserAgent()
  useAccountEventListener()
  return null
}

function MyApp(props: AppProps) {
  const { pageProps, Component } = props
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content="Discover Glitch, the leading DEX on Glitch Network"
        />
        <meta name="theme-color" content="#00FFFF" />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/preview.jpg`} />
        <meta
          name="twitter:description"
          content="Discover Glitch, the leading DEX on Glitch Network"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GEX - Glitch Exchange" />
        <title>Glitch Exchange</title>
        {(Component as NextPageWithLayout).mp && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
        )}
      </Head>
      <Providers store={store}>
        <Blocklist>
          {(Component as NextPageWithLayout).mp ? <MPGlobalHooks /> : <GlobalHooks />}
          <ResetCSS />
          <GlobalStyle />
          <GlobalCheckClaimStatus excludeLocations={[]} />
          <PersistGate loading={null} persistor={persistor}>
            <Updaters />
            <App {...props} />
          </PersistGate>
        </Blocklist>
      </Providers>
    </>
  )
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC
  mp?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// const ProductionErrorBoundary = process.env.NODE_ENV === 'production' ? ErrorBoundary : Fragment
const ProductionErrorBoundary = Fragment

const App = ({ Component, pageProps, ...appProps }: AppPropsWithLayout) => {
  const noNeedLayout = ['/451', '/404'].includes(appProps.router.pathname)

  if (noNeedLayout) {
    return <Component {...pageProps} />
  }

  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment
  const ShowMenu = Component.mp ? Fragment : Menu

  return (
    <ProductionErrorBoundary>
      <LoadingWrapper>
        <img src="/images/preview-loading.gif" alt="Loading" />
      </LoadingWrapper>

      <ShowMenu>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ShowMenu>
      {/* <EasterEgg iterations={2} /> */}
      <ToastListener />
      <FixedSubgraphHealthIndicator />
    </ProductionErrorBoundary>
  )
}

export default MyApp
