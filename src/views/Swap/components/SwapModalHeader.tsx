import { useMemo } from 'react'
import { Trade, TradeType } from '@pancakeswap/sdk'
import { Flex, Button, Text, ErrorIcon, ArrowDownIcon } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { computeTradePriceBreakdown, warningSeverity, computeSlippageAdjustedAmounts } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
import { TruncatedText, SwapShowAcceptChanges } from './styleds'

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const { t } = useTranslation()
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const amount =
    trade.tradeType === TradeType.EXACT_INPUT
      ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)
      : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)
  const symbol =
    trade.tradeType === TradeType.EXACT_INPUT ? trade.outputAmount.currency.symbol : trade.inputAmount.currency.symbol

  const tradeInfoText =
    trade.tradeType === TradeType.EXACT_INPUT
      ? t('Output is estimated. You will receive at least %amount% %symbol% or the transaction will revert.', {
        amount,
        symbol,
      })
      : t('Input is estimated. You will sell at most %amount% %symbol% or the transaction will revert.', {
        amount,
        symbol,
      })

  const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  return (
    <AutoColumn gap="md">
      <div style={{ backgroundColor: '#1C2A2F', padding: 16 }}>
        <Text fontSize="16px" pl="0px" color='#A7C1CA'>
          From
        </Text>
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" />
          <TruncatedText
            fontSize="24px"
            style={{ fontWeight: '600' }}
            pl="10px"
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? 'primary' : 'text'}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
          <Text fontSize="24px" pl="10px">
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </div>
      <RowFixed>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM15 18.5V8.49996C15 7.94767 15.4477 7.49996 16 7.49996C16.5523 7.49996 17 7.94767 17 8.49996V18.5H18.6121C19.2628 18.5 19.6413 19.2355 19.2631 19.7649L16.2035 24.0485C16.1037 24.1881 15.8963 24.1881 15.7966 24.0485L12.7369 19.7649C12.3587 19.2355 12.7372 18.5 13.3879 18.5H15Z" fill="#00FFFF" />
        </svg>
        {/* <ArrowDownIcon size="32px" /> */}
      </RowFixed>
      <div style={{ backgroundColor: '#1C2A2F', padding: 16 }}>
        <Text fontSize="16px" pl="0px" color='#A7C1CA'>
          To
        </Text>
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize="24px"
            style={{ fontWeight: '600' }}
            pl="10px"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                  ? 'primary'
                  : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
          <Text fontSize="24px" pl="10px">
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </div>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold> {t('Price Updated')}</Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>{t('Accept')}</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px' }}>
        <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
          {estimatedText}
          <b>
            {amount} {symbol}
          </b>
          {transactionRevertText}
        </Text>
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            {recipientSentToText}
            <b title={recipient}>{truncatedRecipient}</b>
            {postSentToText}
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
