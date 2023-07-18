import capitalize from "lodash/capitalize";
import { useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { JSBI, Pair, Percent, Fraction, Currency, sqrt, MINIMUM_LIQUIDITY, CurrencyAmount } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Card,
  CardBody,
  Flex,
  CardProps,
  AddIcon,
  TooltipText,
  useTooltip,
  ArrowBackIcon,
} from '@pancakeswap/uikit'
import { Field } from 'state/burn/actions'
import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'
import { useGasPriceMeta, useUserSlippageTolerance } from 'state/user/hooks'
import useTotalSupply from 'hooks/useTotalSupply'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useWeb3React } from '@web3-react/core'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import CircleLoader from 'components/Loader/CircleLoader'
import { ApprovalState } from 'hooks/useApproveCallback'
import { usePendingTransactions } from 'state/transactions/hooks'


import Page from 'components/Layout/Page'
import { AppBody, AppForm } from 'components/App'

import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken, wrappedCurrency } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'
import Dots from '../Loader/Dots'
import { formatAmount } from '../../utils/formatInfoNumbers'
import { useLPApr } from '../../state/swap/hooks'

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

const TableWrapper = styled.div`
  width: 100%;
  flex-direction: column;
  gap: 16px;
  background-color: #151F22;

  table {
    width: 100%;
    border: 3px solid #1C2A2F;
    color: #A7C1CA;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    th {
      border-bottom: 3px solid #1C2A2F;
      width: 50%;
    }

    th, td {
      text-align: left;
      padding: 8px 16px;
    }

    tr {
      width: 100%;
      display: flex;
    }

    td {
      width: 100%;
      display: flex;
      align-items: center;
      svg, img {
        margin-right: 8px;
      }
    }
  }
`;

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const Divider = styled.div`
  display: block;
  width: 100%;
  height: 1px;
  border: 1px dashed #395660;
  margin-top: 12px;
  margin-bottom: 8x;
`;

const TokenItemDivider = styled.div`
  width: 2px;
  height: 16px;
  background: #395660;
  display: inline-block;
  margin-left: 20px;
  margin-right: 20px;
`;

const StyledButton = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
`

export const StyledCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  gap: 8px;
  cursor: pointer;

  width: 100%;
  height: 64px;

  background: rgba(255, 255, 255, 0.03);
`;

const RemoveLiquidWrapper = styled.div`
  margin-top: 37px;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 21px;

    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #A7C1CA;

    .value {
      color: #E5ECEF;
    }

    .highlight {
      color: #F100F5;
      margin-left: 8px;
    }

    span {
      display: flex;
      align-items: center;
    }
  }
`;

const WaitingConfirm = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 33px;

  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #177DDC;
    margin-left: 16px;
  }
`;

const AddMoreLiquidWrapper = styled.div`
  margin-top: 37px;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 21px;

    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #A7C1CA;

    .value {
      color: #E5ECEF;
    }

    .highlight {
      color: #177DDC;
      margin-left: 8px;
    }

    span {
      display: flex;
      align-items: center;
    }
  }
`;

const StyledReceivedSection = styled.div`
  width: 100%;
  min-height: auto;
  color: #A7C1CA;
  background-color: #1C2A2F;
  padding: 20px 16px;
  margin-top: 15px;
  margin-bottom: 15px;

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

interface PositionCardProps extends CardProps {
  index?: number
  pair: Pair
  showUnwrapped?: boolean
  handleSelectedPairs?: any
}

interface PooledSummaryProps extends CardProps {
  pair: Pair
  token0Removed: any
  token1Removed: any
  poolTokenRemoved: any
}

interface RemoveLiquidityProps extends CardProps {
  pair: Pair
  token0Removed: any
  token1Removed: any
  poolTokenRemoved: any
  onBack: any
  onRemove: any
  userPoolTokenPercentage: number
  attemptingTxn: boolean
  approval: ApprovalState
  signatureData?: any
  hash?: string
}

interface AddMoreLiquidityProps extends CardProps {
  pair: Pair
  onBack: any
  onAdd: any
  liquidityMinted: any
  price: Fraction
  noLiquidity?: boolean
  currencies: { [field in Field]?: Currency }
  tokenAmountA: any
  tokenAmountB: any
  shareOfPool: any
}

export const useLPValues = (account, pair, currency0, currency1) => {
  const token0Price = useBUSDPrice(currency0)
  const token1Price = useBUSDPrice(currency1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
      : null
  const totalUSDValue = token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null

  return { token0Deposited, token1Deposited, totalUSDValue, poolTokenPercentage, userPoolBalance }
}

export function ConfirmAddMoreLiquidity({
  pair,
  onBack,
  onAdd,
  liquidityMinted,
  price,
  noLiquidity,
  currencies,
  tokenAmountA,
  tokenAmountB,
  shareOfPool,
}: AddMoreLiquidityProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { hasPendingTransactions } = usePendingTransactions()
  const gasPriceMeta = useGasPriceMeta();
  const [userSlippageTolerance] = useUserSlippageTolerance()

  const currencyA = noLiquidity ? currencies[Field.CURRENCY_A] : unwrappedToken(pair.token0)
  const currencyB = noLiquidity ? currencies[Field.CURRENCY_B] : unwrappedToken(pair.token1)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { poolTokenPercentage, token0Deposited, token1Deposited } = pair ? useLPValues(
    account,
    pair,
    currencyA,
    currencyB,
  ) : {
    poolTokenPercentage: new Percent(1),
    token0Deposited: 0,
    token1Deposited: 0,
  }

  const liquidityMintedFirstAddRaw = JSBI.subtract(sqrt(JSBI.multiply(tokenAmountA.raw, tokenAmountB.raw)), MINIMUM_LIQUIDITY)
  const liquidityMintedFirstAdd = CurrencyAmount.ether(liquidityMintedFirstAddRaw).toSignificant(6);

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
              <span>Confirm Provide Liquidity</span>
            </div>
          </AppHeader>

          <AddMoreLiquidWrapper>
            <StyledReceivedSection>
              <span className="label">{t('You will receive')}</span>
              <div className="value-section">
                <DoubleCurrencyLogo
                  currency0={currencyA}
                  currency1={currencyB}
                  size={24}
                />                
                <span className="value">{liquidityMinted ? liquidityMinted?.toSignificant(6) : liquidityMintedFirstAdd || '-'}</span>
                <span>{currencyA?.symbol}/{currencyB?.symbol} pool tokens</span>
              </div>
              <div className="meta">
                {`Output is estimated. If the price changes by more than ${(userSlippageTolerance / 100).toFixed(2)}% your transaction will revert.`}
              </div>
          </StyledReceivedSection>

            <div className="row">
              <span>Share of Pool</span>
              {
                !!noLiquidity && <span className="highlight">100%</span>
              }
              {
                !noLiquidity && <span className="highlight">{shareOfPool}%</span>
              }
            </div>
            <div className="row">
              <span>Transaction Speed</span>
              <span className="highlight">{`${capitalize(gasPriceMeta.label)} - ${gasPriceMeta.gasPrice} GWEI`}</span>
            </div>

            <Divider style={{
              marginBottom: '12px',
            }} />

            <div className="row">
              <span>Rate</span>
              <span className="value">{`1 ${currencyA?.symbol} ~ ${price?.toSignificant(4)} ${currencyB?.symbol}`}</span>
            </div>

            <div className="row">
              <span />
              <span className="value">{`1 ${currencyB?.symbol} ~ ${price?.invert().toSignificant(4)} ${currencyA?.symbol}`}</span>
            </div>

            <div className="row">
              <span><CurrencyLogo currency={currencyA} size='18px' style={{
                marginRight: '8px'
              }} />{currencyA?.symbol} to be deposited</span>
              <span className="value">{tokenAmountA ? `${tokenAmountA.toSignificant(6)} ${currencyA?.symbol}` : '-'}</span>
            </div>

            <div className="row">
              <span><CurrencyLogo currency={currencyB} size='18px' style={{
                marginRight: '8px'
              }} />{currencyB?.symbol} to be deposited</span>
              <span className="value">{tokenAmountB ? `${tokenAmountB.toSignificant(6)} ${currencyB?.symbol}` : '-'}</span>
            </div>

            {
              !!(hasPendingTransactions) && (
                <WaitingConfirm>
                  <CircleLoader size="24px" /><span>Waiting for Confirmation...</span>
                </WaitingConfirm>
              )
            }

            <StyledButton style={{
              width: '100%',
            }}
              disabled={hasPendingTransactions}
              onClick={onAdd}
            >
              {
                noLiquidity ? 'Create Pool & Supply' : 'Confirm'
              }
            </StyledButton>
          </AddMoreLiquidWrapper>
        </AppForm>
      </AppBody>
    </Page>
  )
}

export function ConfirmRemoveLiquidCard({
  pair,
  token0Removed,
  token1Removed,
  poolTokenRemoved,
  onBack,
  onRemove,
  userPoolTokenPercentage,
}: RemoveLiquidityProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { hasPendingTransactions } = usePendingTransactions()
  const gasPriceMeta = useGasPriceMeta();

  const currencyA = unwrappedToken(pair.token0)
  const currencyB = unwrappedToken(pair.token1)

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
              <span>Confirmation Remove liquidity</span>
            </div>
          </AppHeader>

          <RemoveLiquidWrapper>
            <div className="row">
              <span>Trading pair</span>
              <span className="value"><DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin size={24} /> {currencyA?.symbol}/{currencyB?.symbol}</span>
            </div>
            <div className="row">
              <span>{`You're removing`}</span>
              <span className="value">{userPoolTokenPercentage}% ~ <span className="highlight">{poolTokenRemoved} {currencyA?.symbol}/{currencyB?.symbol}</span></span>
            </div>
            <div className="row">
              <span />
              <span className="value"><CurrencyLogo currency={currencyA} size='18px' style={{
                marginRight: '8px'
              }} /> {token0Removed} {currencyA?.symbol}</span>
            </div>
            <div className="row">
              <span />
              <span className="value"><CurrencyLogo currency={currencyB} size='18px' style={{
                marginRight: '8px'
              }} /> {token1Removed} {currencyB?.symbol}</span>
            </div>
            <div className="row">
            <span>Transaction Speed</span>
              <span className="value">{`${capitalize(gasPriceMeta.label)} - ${gasPriceMeta.gasPrice} GWEI`}</span>
            </div>

            {
              !!(hasPendingTransactions) && (
                <WaitingConfirm>
                  <CircleLoader size="24px" /><span>Waiting for Confirmation...</span>
                </WaitingConfirm>
              )
            }

            <StyledButton style={{
              width: '100%',
            }}
              disabled={hasPendingTransactions}
              onClick={onRemove}
            >
              Confirm
            </StyledButton>
          </RemoveLiquidWrapper>
        </AppForm>
      </AppBody>
    </Page>
  )
}

export function PooledSummaryCard({ pair, token0Removed, token1Removed, poolTokenRemoved }: PooledSummaryProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const currencyA = unwrappedToken(pair.token0)
  const currencyB = unwrappedToken(pair.token1)

  const { token0Deposited, token1Deposited, userPoolBalance } = useLPValues(
    account,
    pair,
    currencyA,
    currencyB,
  )

  const isRemoving = !!token0Removed;

  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>You deposited</th>
            <th>{`You're removing`}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{userPoolBalance ? `${userPoolBalance.toSignificant(4)} pool tokens` : '-'}</td>
            <td style={{
              color: isRemoving ? '#F100F5' : '#E5ECEF',
            }}>{poolTokenRemoved ? `${poolTokenRemoved} pool tokens` : '-'}</td>
          </tr>
          <tr>
            <td><CurrencyLogo currency={currencyA} size='18px' /> {token0Deposited ? `${token0Deposited?.toSignificant(6)} ${currencyA?.symbol}` : '-'}</td>
            <td style={{
              color: isRemoving ? '#F100F5' : '#E5ECEF',
            }}><CurrencyLogo currency={currencyA} size='18px' /> {token0Removed ? `${token0Removed} ${currencyA?.symbol}` : '-'}</td>
          </tr>
          <tr>
            <td><CurrencyLogo currency={currencyB} size='18px' /> {token1Deposited ? `${token1Deposited?.toSignificant(6)} ${currencyB?.symbol}` : '-'}</td>
            <td style={{
              color: isRemoving ? '#F100F5' : '#E5ECEF',
            }}><CurrencyLogo currency={currencyB} size='18px' /> {token1Removed ? `${token1Removed} ${currencyB?.symbol}` : '-'}</td>
          </tr>
        </tbody>
      </table>
    </TableWrapper>
  )
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const { totalUSDValue, poolTokenPercentage, token0Deposited, token1Deposited, userPoolBalance } = useLPValues(
    account,
    pair,
    currency0,
    currency1,
  )

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) ? (
        <Card>
          <CardBody style={{
            background: '#1C2A2F',
          }}>
            <AutoColumn gap="16px">
              <FixedHeightRow>
                <RowFixed>
                  <Text color="#A7C1CA" fontSize="14px" fontWeight="400">
                    {t('Pool found')}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={24} />
                  <Text small color="#E5ECEF" bold>
                    {currency0.symbol}-{currency1.symbol}
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Flex flexDirection="column" alignItems="flex-end">
                    <Text style={{
                      display: 'flex',
                    }}>
                      {userPoolBalance ? `${userPoolBalance.toSignificant(4)}` : '-'}
                      {
                        !!userPoolBalance && <Text color="#4E7785" ml="8px">Pool tokens </Text>
                      }
                    </Text>
                    
                    {Number.isFinite(totalUSDValue) && (
                      <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD)`}</Text>
                    )}
                  </Flex>
                </RowFixed>
              </FixedHeightRow>
              <Divider />
              <AutoColumn gap="4px">
                {/* {poolData && (
                  <FixedHeightRow>
                    <TooltipText ref={targetRef} color="textSubtle" small>
                      {t('LP reward APR')}:
                    </TooltipText>
                    {tooltipVisible && tooltip}
                    <Text>{formatAmount(poolData.lpApr7d)}%</Text>
                  </FixedHeightRow>
                )}
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Share of Pool')}:
                  </Text>
                  <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow> */}
                <FixedHeightRow style={{
                  marginBottom: '12px',
                }}>
                  <Text color="#A7C1CA" small display="flex" textAlign="center">
                    <CurrencyLogo currency={currency0} size="24px" style={{
                      marginRight: '8px',
                    }} />
                    {t('%asset% deposited', { asset: currency0.symbol })}
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text color="#E5ECEF" ml="6px">{token0Deposited?.toSignificant(6)} {currency0.symbol}</Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="#A7C1CA" small display="flex" textAlign="center">
                    <CurrencyLogo currency={currency1} size="24px" style={{
                        marginRight: '8px',
                      }} />
                    {t('%asset% deposited', { asset: currency1.symbol })}
                  </Text>
                  {token1Deposited ? (
                    <RowFixed>
                      <Text color="#E5ECEF" ml="6px">{token1Deposited?.toSignificant(6)} {currency1.symbol}</Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </CardBody>
        </Card>
      ) : (
        <LightCard>
          <Text fontSize="14px" style={{ textAlign: 'center' }}>
            <span role="img" aria-label="pancake-icon">
              🥞
            </span>{' '}
            {t(
              "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
            )}
          </Text>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ handleSelectedPairs, index = 0, pair, ...props }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )
  const [showMore, setShowMore] = useState(false)

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const { totalUSDValue, poolTokenPercentage, token0Deposited, token1Deposited, userPoolBalance } = useLPValues(
    account,
    pair,
    currency0,
    currency1,
  )

  return (
    <StyledCard style={{
      backgroundColor: !(index % 2) ? 'rgba(255, 255, 255, 0.03)' : '#151F22',
    // }} onClick={() => setShowMore(!showMore)}>
    }} onClick={() => {
      handleSelectedPairs({
        currency0,
        currency1,
        token0Deposited,
        token1Deposited,
        poolTokenPercentage,
        userPoolBalance,
      } as any)
    }}>
      {/* <Flex justifyContent="space-between" role="button" onClick={() => setShowMore(!showMore)} p="16px"> */}
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
          <Flex alignItems="center" mb="4px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} style={{
              width: '68px',
              height: '32px',
            }} />
            <Text bold ml="8px">
              {!currency0 || !currency1 ? <Dots>{t('Loading')}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>
          <Text fontSize="14px" color="#E5ECEF" style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            {userPoolBalance?.toSignificant(4)} <Text ml="12px" color="#4F7785">Pool tokens</Text>

            <TokenItemDivider />
          </Text>
          {/* {Number.isFinite(totalUSDValue) && (
            <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} USD)`}</Text>
          )} */}
        </Flex>
        {/* {showMore ? <ChevronUpIcon /> : <ChevronDownIcon />} */}
        <ChevronRightIcon />
      {/* </Flex> */}

      {/* {showMore && (
        <AutoColumn gap="8px" style={{ padding: '16px' }}>
          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency0} />
              <Text color="textSubtle" ml="4px">
                {t('Pooled %asset%', { asset: currency0.symbol })}:
              </Text>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed>
                <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency1} />
              <Text color="textSubtle" ml="4px">
                {t('Pooled %asset%', { asset: currency1.symbol })}:
              </Text>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed>
                <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          {poolData && (
            <FixedHeightRow>
              <RowFixed>
                <TooltipText ref={targetRef} color="textSubtle">
                  {t('LP reward APR')}:
                </TooltipText>
                {tooltipVisible && tooltip}
              </RowFixed>
              <Text>{formatAmount(poolData.lpApr7d)}%</Text>
            </FixedHeightRow>
          )}

          <FixedHeightRow>
            <Text color="textSubtle">{t('Share of Pool')}</Text>
            <Text>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
            <Flex flexDirection="column">
              <Button
                as={NextLinkFromReactRouter}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="primary"
                width="100%"
                mb="8px"
              >
                {t('Remove')}
              </Button>
              <Button
                as={NextLinkFromReactRouter}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}?step=1`}
                variant="text"
                startIcon={<AddIcon color="primary" />}
                width="100%"
              >
                {t('Add liquidity instead')}
              </Button>
            </Flex>
          )}
        </AutoColumn>
      )} */}
    </StyledCard>
  )
}
