import capitalize from "lodash/capitalize";
import { useGasPriceMeta } from 'state/user/hooks'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType } from '@pancakeswap/sdk'
import { Button, Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Field } from 'state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { TOTAL_FEE, LP_HOLDERS_FEE, TREASURY_FEE, BUYBACK_FEE } from 'config/constants/info'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
// import Column, { AutoColumn } from '../../components/Layout/Column'

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

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const gasPriceMeta = useGasPriceMeta();
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`
  const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`
  const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`
  const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
          <Label>{t('Slippage tolerance')}</Label>
          <Text bold color="#177DDC">
            {allowedSlippage / 100}%
                          </Text>
        </RowBetween>
        <RowBetween align="center">
          <Label>Transaction Speed</Label>
          <Text bold color="#177DDC">
          {`${capitalize(gasPriceMeta.label)} - ${gasPriceMeta.gasPrice} GWEI`}
          </Text>
        </RowBetween>
        <Flex style={{backgroundColor:'#23353B', height:1,width:'100%',margin:'7px 0px'}}/>

        <RowBetween align="center">
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
        </RowBetween>

        <RowBetween>
          <RowFixed>
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
          <RowFixed>
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
          <RowFixed>
          <Label>{t('Price Impact')}</Label>
            <QuestionHelper
              text={t('The difference between the market price and your price due to trade size.')}
              ml="15px"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
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
      </SwapModalFooterContainer>

      <AutoRow>
        <StyledButton
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 ? t('Swap Anyway') : t('Confirm Swap')}
        </StyledButton>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
