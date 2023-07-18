import { Currency, ETHER, Token } from '@pancakeswap/sdk'
import { TusIcon } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import styled from 'styled-components'
import { WrappedTokenInfo } from 'state/types'
import useHttpLocations from '../../hooks/useHttpLocations'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import Logo from './Logo'


const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  logoURI,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
  logoURI?: string
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency.symbol === 'USDT') {
      return [`${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/tokens/0x55d398326f99059fF775485246999027B3197955.png`];
    }

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }
      return logoURI ? [logoURI] : [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    // return <BinanceIcon width={size} style={style} />
    return <TusIcon width={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
