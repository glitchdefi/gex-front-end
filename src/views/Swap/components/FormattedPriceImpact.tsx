import { Percent } from '@pancakeswap/sdk'
import { warningSeverity } from 'utils/exchange'
import { ONE_BIPS } from 'config/constants/exchange'
import { ErrorText } from './styleds'

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({ priceImpact, color }: { priceImpact?: Percent, color?: any }) {
  return (
    <ErrorText fontSize="14px" color={color || '#49AA19'} severity={warningSeverity(priceImpact)}>
      {priceImpact ? (priceImpact.lessThan(ONE_BIPS) ? '<0.01%' : `${priceImpact.toFixed(2)}%`) : '-'}
    </ErrorText>
  )
}
