import { Trade, TradeType } from '@pancakeswap/sdk'
import {Flex, Text } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { TOTAL_FEE, LP_HOLDERS_FEE, TREASURY_FEE, BUYBACK_FEE } from 'config/constants/info'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'

function TradeSummary({ trade, allowedSlippage,priceTooHight }: { trade: Trade; allowedSlippage: number ;priceTooHight: boolean}) {
  const { t } = useTranslation()
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`
  const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`
  const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`
  const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`

  return (
    <AutoColumn style={{ padding: '0 0px' }}>
      <Flex style={{backgroundColor:'#23353B', height:1,width:'100%',margin:'7px 0px'}}/>
      <RowBetween mt="8px">
        <RowFixed>
          <Text fontSize="14px" color="textGrey" height={22}>
            {isExactIn ? t('Minimum received') : t('Maximum sold')}
          </Text>
          <QuestionHelper
            text={t(
              'Your transaction will revert if this minimum is no longer available',
            )}
             ml="4px"
            placement="right-start"
          />
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px" color="backgroundWhite" bold>
            {isExactIn
              ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                '-'
              : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween mt="8px">
        <RowFixed>
          <Text fontSize="14px" color="textGrey" height={22}>
            {t('Liquidity Provider Fee')}
          </Text>
          <QuestionHelper
           text={t(
            'An amount of %amount% of each transaction will go to liquidity providers as a protocol incentive',{ amount: totalFeePercent }
          )}
            // text={
            //   <>
            //     <Text mb="12px">{t('For each trade a %amount% fee is paid', { amount: totalFeePercent })}</Text>
            //     <Text>- {t('%amount% to LP token holders', { amount: lpHoldersFeePercent })}</Text>
            //     <Text>- {t('%amount% to the Treasury', { amount: treasuryFeePercent })}</Text>
            //     <Text>- {t('%amount% towards CAKE buyback and burn', { amount: buyBackFeePercent })}</Text>
            //   </>
            // }
            ml="4px"
            placement="right-start"
          />
        </RowFixed>
        <Text fontSize="14px" bold color='backgroundWhite' height={22}>
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
        </Text>
      </RowBetween>
      <RowBetween mt="8px">
        <RowFixed>
          <Text fontSize="14px" color="textGrey" height={22}>
            {t('Price Impact')}
          </Text>
          <QuestionHelper
            text={t('The difference between the market price and estimated price due to trade size.')}
             ml="4px"
            placement="right-start"
          />
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} color={priceTooHight?'#D87A16' :''}/>
      </RowBetween>
{/* {console.log(priceImpactWithoutFee)} */}
      {priceTooHight &&  <RowBetween mt="8px">
        <Text/>
        <RowFixed>
          <Text fontSize="14px" color="#D87A16" height={22}>
            {t('The price impact too high')}
          </Text>
        </RowFixed>
      </RowBetween>}
     

    </AutoColumn>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade,
  priceTooHight?:boolean
}

export function AdvancedSwapDetails({ trade,priceTooHight }: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} priceTooHight={priceTooHight} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 0px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="14px" color="textSubtle">
                    {t('Route')}
                  </Text>
                  <QuestionHelper
                    text={t('Routing through these tokens resulted in the best price for your trade.')}
                     ml="4px"
                    placement="right-start"
                  />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
