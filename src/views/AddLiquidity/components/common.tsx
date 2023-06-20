import capitalize from "lodash/capitalize";
import { useGasPriceMeta } from 'state/user/hooks'
import React from 'react'
import { Currency, Fraction, Percent, TokenAmount } from '@pancakeswap/sdk'
import { Text, useTooltip, Box, Flex, Svg, SvgProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { Field } from 'state/burn/actions'
import { DoubleCurrencyLogo, CurrencyLogo } from 'components/Logo'

const StyledReceivedSection = styled.div`
  width: 100%;
  min-height: auto;
  color: #A7C1CA;
  background-color: #1C2A2F;
  padding: 20px 16px;
  margin-top: 15px;

  .label {
    font-size: 16px;
    color: #A7C1CA;
  }

  .value-section {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #E5ECEF;
    margin-top: 16px;
    margin-bottom: 16px;

    .value {
      font-size: 24px;
      font-weight: 600;
      color: #E5ECEF;
      margin-left: 12px;
      margin-right: 12px;
    }
  }

  .meta {
    color: #A7C1CA;
    font-weight: 300;
    font-size: 12px;
    line-height: 20px;
  }
`;

const CircleSvg = ({ percent = 1, ...props }: SvgProps & { percent?: number }) => (
  <Svg width="60px" height="60px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_i_1147_113741)">
      <circle r="10" cx="10" cy="10" fill="#7645D9" />
      <circle
        r="5"
        cx="10"
        cy="10"
        fill="transparent"
        stroke="#00FFFF"
        strokeWidth="10"
        strokeDasharray={`calc(${percent * 100} * 31.4 / 100) 31.4`}
        transform="rotate(-90) translate(-20)"
      />
    </g>
    <defs>
      <filter
        id="filter0_i_1147_113741"
        x={0}
        y={0}
        width={60}
        height={60}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={-2} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_1147_113741" />
      </filter>
    </defs>
  </Svg>
)

const Subtitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Text fontSize="14px" color="##A7C1CA" fontWeight={400}>
      {children}
    </Text>
  )
}

export const PairDistribution = ({
  title,
  percent,
  currencyA,
  currencyB,
  currencyAValue,
  currencyBValue,
  tooltipTargetRef,
}: {
  title: React.ReactNode
  percent?: number
  currencyA?: Currency
  currencyB?: Currency
  currencyAValue?: string
  currencyBValue?: string
  tooltipTargetRef?: any
}) => {
  return (
    <AutoColumn gap="8px">
      <Subtitle>{title}</Subtitle>
      <Flex>
        {/* {typeof percent !== 'undefined' && (
          <div ref={tooltipTargetRef}>
            <CircleSvg percent={percent} mr="34px" />
          </div>
        )} */}
        <AutoColumn style={{ width: '100%' }}>
          {currencyA && (
            <RowBetween mb="8px">
              <AutoRow gap="4px">
                <CurrencyLogo currency={currencyA} />
                <Text>{currencyA?.symbol} deposited</Text>
              </AutoRow>
              <Text style={{
                whiteSpace: 'nowrap',
              }}>{currencyAValue} {currencyA?.symbol}</Text>
            </RowBetween>
          )}

          {currencyB && (
            <RowBetween>
              <AutoRow gap="4px">
                <CurrencyLogo currency={currencyB} />
                <Text>{currencyB?.symbol} deposited</Text>
              </AutoRow>
              <Text style={{
                whiteSpace: 'nowrap',
              }}>{currencyBValue} {currencyB?.symbol}</Text>
            </RowBetween>
          )}
        </AutoColumn>
      </Flex>
    </AutoColumn>
  )
}

interface AddLiquidityModalHeaderProps {
  currencies: { [field in Field]?: Currency }
  poolTokenPercentage?: Percent
  liquidityMinted: TokenAmount
  price: Fraction
  allowedSlippage: number
  children: React.ReactNode
  noLiquidity?: boolean
}

export const AddLiquidityModalHeader = ({
  currencies,
  poolTokenPercentage,
  liquidityMinted,
  price,
  allowedSlippage,
  noLiquidity,
  children,
}: AddLiquidityModalHeaderProps) => {
  const { t } = useTranslation()
  const gasPriceMeta = useGasPriceMeta();
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
      slippage: allowedSlippage / 100,
    }),
    { placement: 'auto' },
  )

  return (
    <AutoColumn gap="24px">
      <AutoColumn gap="8px">
        <StyledReceivedSection>
          <span className="label">{t('You will receive')}</span>
          <div className="value-section">
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={24}
            />                
            <span className="value">{liquidityMinted?.toSignificant(6)}</span>
            <span>{currencies[Field.CURRENCY_A]?.symbol}/{currencies[Field.CURRENCY_B]?.symbol} pool tokens</span>
          </div>
          <div className="meta">
            Output is estimated. If the price changes by more than 1% your transaction will revert.
          </div>
        </StyledReceivedSection>
      </AutoColumn>
      <RowBetween>
        <Subtitle>{t('Share of pool')}</Subtitle>
        <Text color='#177DDC'>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
      </RowBetween>
      <RowBetween>
        <Subtitle>Transaction Speed</Subtitle>
        <Text color='#177DDC'>{`${capitalize(gasPriceMeta.label)} - ${gasPriceMeta.gasPrice} GWEI`}</Text>
      </RowBetween>
      <AutoColumn>
        <RowBetween>
          <Subtitle>{t('Rates')}</Subtitle>
          <Text>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} ~ ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <Text>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} ~ ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoColumn gap="8px">{children}</AutoColumn>
    </AutoColumn>
  )
}
