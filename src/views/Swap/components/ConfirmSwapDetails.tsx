import capitalize from "lodash/capitalize";
import { useGasPriceMeta } from 'state/user/hooks'
import styled from 'styled-components'
import { useCallback, useMemo, useState } from 'react'
import { currencyEquals, Trade, TradeType } from '@pancakeswap/sdk'
import { InjectedModalProps, Button, ArrowBackIcon, Text, ErrorIcon, Flex, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { computeTradePriceBreakdown, warningSeverity, computeSlippageAdjustedAmounts, formatExecutionPrice } from 'utils/exchange'
import Page from 'components/Layout/Page'
import { AppBody, AppForm } from 'components/App'
import truncateHash from 'utils/truncateHash'
import { Field } from 'state/swap/actions'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { TOTAL_FEE, LP_HOLDERS_FEE } from 'config/constants/info'
import { usePendingTransactions } from 'state/transactions/hooks'
import CircleLoader from 'components/Loader/CircleLoader'

import FormattedPriceImpact from './FormattedPriceImpact'
import TradePrice from './TradePrice'

import { SwapCallbackError, SwapShowAcceptChanges, TruncatedText } from './styleds'

const AppHeader = styled.div`
  // height: 76px;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid #1C2A2F;

  display: flex;
  align-item: center;
  justify-content: space-between;

  .app-title {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 24px;
      margin-right: 19px;
    }

    span {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px
    }
  }

  .app-functions {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-left: 20px;
    }
  }
`;

const SwapDetailWrapper = styled.div`
  margin-top: 26px;
`;

const SwapFooterWrapper = styled.div`
  margin-top: 26px;
`;

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px 0px;
  // border-radius: ${({ theme }) => theme.radii.default};
  // border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  // background-color: ${({ theme }) => theme.colors.background};
`
const StyledButton = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack};
 background-color:${({ theme }) => theme.colors.backgroundWhite};
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary},4px -2px 0px 0px #F100F5;
 width: 100%;
 margin-bottom: 26px;
`
const Label = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  color: #A7C1CA;
`

const WaitingConfirm = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;

  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #177DDC;
    margin-left: 16px;
  }
`;

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}


interface ConfirmSwapDetailsProps {
  trade?: Trade
  originalTrade?: Trade
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: number
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
  onBack?: () => void
}

const ConfirmSwapDetails: React.FC<InjectedModalProps & ConfirmSwapDetailsProps> = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  customOnDismiss,
  recipient,
  swapErrorMessage,
  attemptingTxn,
  txHash,
  onBack,
}) => {
  const { t } = useTranslation()
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  )
  const gasPriceMeta = useGasPriceMeta();

  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  const { hasPendingTransactions } = usePendingTransactions()

  const amount = trade?.tradeType === TradeType.EXACT_INPUT
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

  // * Footer
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const severity = warningSeverity(priceImpactWithoutFee)

  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`

  return (
    <Page>
      <AppBody>
        <AppForm>
          <AppHeader>
            <div className="app-title" style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '12px',
            }}>
              <ArrowBackIcon width="18px" style={{
                marginRight: '20px',
                cursor: 'pointer',
              }}
                onClick={onBack}
              />
              
              <span>Confirm Swap</span>
            </div>
          </AppHeader>

          <SwapDetailWrapper>
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
                  color="text"
                >
                  {trade.inputAmount.toSignificant(6)}
                </TruncatedText>
                <Text fontSize="24px" pl="10px">
                  {trade.inputAmount.currency.symbol}
                </Text>
              </RowFixed>
            </div>
            <RowFixed mt="16px" mb="16px">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM15 18.5V8.49996C15 7.94767 15.4477 7.49996 16 7.49996C16.5523 7.49996 17 7.94767 17 8.49996V18.5H18.6121C19.2628 18.5 19.6413 19.2355 19.2631 19.7649L16.2035 24.0485C16.1037 24.1881 15.8963 24.1881 15.7966 24.0485L12.7369 19.7649C12.3587 19.2355 12.7372 18.5 13.3879 18.5H15Z" fill="#00FFFF" />
              </svg>
              <Text ml="16px" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', fontSize: 14, fontWeight: 400, color: '#A7C1CA' }}> Rate:  </Text>
                {Boolean(trade) && (
                  <TradePrice
                    price={trade?.executionPrice}
                    showInverted
                    setShowInverted={setShowInverted}
                  />
                )}

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
                  color="text"
                >
                  {trade.outputAmount.toSignificant(6)}
                </TruncatedText>
                <Text fontSize="24px" pl="10px">
                  {trade.outputAmount.currency.symbol}
                </Text>
              </RowFixed>
            </div>
            
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

          {/* * Footer */}
          <SwapFooterWrapper>
          <SwapModalFooterContainer>
        <RowBetween align="center">
          <Label>{t('Slippage tolerance')}</Label>
          <Text bold color="#177DDC">
            {allowedSlippage / 100}%
                          </Text>
        </RowBetween>
        <RowBetween align="center" mt="8px" mb="8px">
          <Label>Transaction Speed</Label>
            <Text bold color="#177DDC">
            {`${capitalize(gasPriceMeta.label)} - ${gasPriceMeta.gasPrice} GWEI`}
            </Text>
          </RowBetween>
          <Flex style={{backgroundColor:'#23353B', height:1,width:'100%',margin:'8px 0px'}}/>

          {/* <RowBetween align="center" mt="8px">
          <Label>{t('Price')}</Label>
            <Text
              fontSize="14px"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                textAlign: 'right',
                paddingLeft: '10px',
              }}
            >
              {formatExecutionPrice(trade, showInverted)}
            
            </Text>
          </RowBetween> */}

          <RowBetween>
            <RowFixed mt="8px">
            <Label>
            {trade.tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}
              </Label>
              <QuestionHelper
                text={t(
                  'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
                )}
                ml="15px"
              />
            </RowFixed>
            <RowFixed mt="8px">
              <Text fontSize="14px">
                {trade.tradeType === TradeType.EXACT_INPUT
                  ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                  : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
              </Text>
              <Text fontSize="14px" marginLeft="4px">
                {trade.tradeType === TradeType.EXACT_INPUT
                  ? trade.outputAmount.currency.symbol
                  : trade.inputAmount.currency.symbol}
              </Text>
            </RowFixed>
          </RowBetween>
          <RowBetween>
          <RowFixed mt="8px">
            <Label>{t('Price Impact')}</Label>
              <QuestionHelper
                text={t('The difference between the market price and your price due to trade size.')}
                ml="15px"
              />
            </RowFixed>
            <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
          </RowBetween>
          <RowBetween>
            <RowFixed mt="8px">
            <Label>{t('Liquidity Provider Fees')}</Label>
              <QuestionHelper
                text={t('For each trade a %amount% fee is paid', { amount: totalFeePercent })}
                ml="15px"
              />
            </RowFixed>
            <Text fontSize="14px">
              {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
            </Text>
          </RowBetween>

          {
            !!(hasPendingTransactions) && (
              <WaitingConfirm>
                <CircleLoader size="24px" /><span>Waiting for Confirmation...</span>
              </WaitingConfirm>
            )
          }

          </SwapModalFooterContainer>
            <StyledButton
              variant={severity > 2 ? 'danger' : 'primary'}
              onClick={onConfirm}
              disabled={hasPendingTransactions}
              mt="12px"
              id="confirm-swap-or-send"
              width="100%"
            >
              Confirm
            </StyledButton>
        
          </SwapFooterWrapper>
          </SwapDetailWrapper>
        </AppForm>
      </AppBody>
    </Page>
  )
}

export default ConfirmSwapDetails
