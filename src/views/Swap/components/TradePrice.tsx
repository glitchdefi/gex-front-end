import { Price } from '@pancakeswap/sdk'
import { Text, Flex, AutoRenewIcon } from '@pancakeswap/uikit'
import { StyledBalanceMaxMini } from './styleds'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `1 ${price?.baseCurrency?.symbol} ~ ${formattedPrice} ${price?.quoteCurrency?.symbol}`
    : `1 ${price?.quoteCurrency?.symbol} ~ ${formattedPrice} ${price?.baseCurrency?.symbol}`

  return (
    <Text style={{
      justifyContent: 'space-between', alignItems: 'center', display: 'flex',width:'40%',
      fontSize: 14, fontWeight: 400, color: '#A7C1CA',whiteSpace:'nowrap'
    }}>
      {show ? (
        <>
         <Flex >{label} </Flex> 
          <Flex onClick={() => setShowInverted(!showInverted)}>
            <img src="images/auto-renew.svg" width={15} height={15} alt="icon-auto-renew" />
          </Flex>
        </>
      ) : (
          '-'
        )}
    </Text>
  )
}
