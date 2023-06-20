import { Currency } from '@pancakeswap/sdk'
import styled from 'styled-components'
import CurrencyLogo from './CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean }>`
  display: flex;
  flex-direction: row;
  // margin-right: ${({ margin }) => margin && '4px'};
  width: 68px;
  height: 32px;
  border: 1px solid #395660;
  border-radius: 100px;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
  style?: any
  onClick?: any
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 24,
  margin = false,
  ...props
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper margin={margin} {...props}>
      {currency0 && <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{ marginRight: '4px' }} />}
      {currency1 && <CurrencyLogo currency={currency1} size={`${size.toString()}px`} />}
    </Wrapper>
  )
}
