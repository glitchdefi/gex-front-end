import { PancakeTheme, ResetCSS, dark, light, ModalProvider } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import Script from 'next/script'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import Head from 'next/head'
import { WagmiConfig } from 'wagmi'
import { client } from '../wagmi'
import { Menu } from '../components/Menu'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const StyledThemeProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <ThemeProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {props.children}
    </ThemeProvider>
  )
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'IBM Plex Mono', sans-serif;
  }
  html, body, #__next {
    height: 100%;
  }
  #__next {
    display: flex;
    flex-direction: column;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

function MyApp({ Component, pageProps }: AppProps) {
  // FIXME: server render styled component className conflict
  const isMounted = useIsMounted()
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
      </Head>
      <WagmiConfig client={client}>
        <NextThemeProvider>
          <StyledThemeProvider>
            <ModalProvider>
              <ResetCSS />
              <GlobalStyle />
              {isMounted && (
                <>
                  {/* <Menu /> */}
                  <Component {...pageProps} />
                </>
              )}
            </ModalProvider>
          </StyledThemeProvider>
        </NextThemeProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
