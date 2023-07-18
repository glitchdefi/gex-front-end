import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, ArrowBackIcon } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from 'components/App/Transactions'

import { DoubleCurrencyLogo, CurrencyLogo } from 'components/Logo'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { currencyId } from '../../utils/currencyId'

import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePair, usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs, usePairAdder } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppBody, AppForm } from '../../components/App'
import Page from '../Page'
import ConnectMetaButton from '../../components/ConnectMetaButton'
import { useCurrency } from '../../hooks/Tokens'

const StyledBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    margin-bottom: 44px;
    margin-top: 88px;
  }

  span {
    color: #E5ECEF;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    margin-bottom: 32px;
  }

`;


const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #1C2A2F;
  display: block;
  margin-top: 32px;
  margin-bottom: 32px;
`;

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

const StyledButton = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
 width: 100%;
 margin-bottom: 26px;
`

const DontSeePool = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #C1D4DA;

  a {
    color: #00FFFF;
    font-weight: 600;
    text-decoration-line: underline;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

const MyLiquilidityTitle = styled.div`
width: 100%;
text-alight: left;
margin-top: 26px;
margin-bottom: 26px;

font-weight: 400;
font-size: 14px;
line-height: 22px;
color: #E5ECEF;
`;

const LiquidityDetail = styled.div`
  width: 100%;
  min-height: 295px;
  background-color: #1C2A2F;
  padding: 16px;
  margin-top: 32px;

  .general-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 34px;
    border-bottom: 1px dashed #395660;
    margin-bottom: 24px;

    .token-pairs {
      font-weight: 400;
      font-size: 20px;
      line-height: 28px;
      color: #E5ECEF;
      display: flex;
      align-items: center;
    }

    .token-value {
      font-weight: 600;
      font-size: 20px;
      line-height: 28px;
      color: #177DDC;

      .label {
        font-weight: 400;
        font-size: 12px;
      }
    }
  }

  .share-pool {
    margin-bottom: 33px;

    .item-row {
      display: flex;
      justify-content: space-between;
      color: #A7C1CA;
      margin-bottom: 12px;

      font-weight: 400;
      font-size: 14px;
      line-height: 22px;

      .currency-wrapper {
        display: flex;
        align-items: center;
      }

      .token-value {
        color: #E5ECEF;
      }
    }
  }

  .button-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;


    .add-more {
      border-radius: 0px;
      color: #151F23;
      background: #00FFFF;
      width: 100%;
      font-weight: 600;
      gap: 8px;
    }

    .remove {
      border-radius: 0px;
      border: 1px solid #00FFFF;
      color: #00FFFF;
      background: transparent;
      width: 100%;
      font-weight: 600;
      gap: 8px;
    }
  }
`;

export default function Pool() {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const [selectedPairs, setSelectedPairs]: any = useState({});

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  const gPairs = window?.localStorage?.getItem('g-pairs') ? JSON.parse(window?.localStorage?.getItem('g-pairs')) : '';
  const currencyA = useCurrency(gPairs ? gPairs[0] : '')
  const currencyB = useCurrency(gPairs ? gPairs[1] : '')
  const [pairState, pair] = usePair(currencyA ?? undefined, currencyB ?? undefined)
  const addPair = usePairAdder()

  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  // * CHECK
  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))

  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))

  
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <StyledBody>
          <img src='images/inbox-icon.svg' alt='inbox icon' />
          <span>Connect to a wallet to view your liquidity.</span>
          <ConnectMetaButton style={{
            width: '460px',
            height: '40px',
            marginBottom: '100px',
          }} />
        </StyledBody>
      )
    }

    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
          index={index}
          handleSelectedPairs={(payload) => {
            if (!Object.keys(payload).length) {
              return;
            }

            // eslint-disable-next-line no-console
            setSelectedPairs(payload)
          }}
        />
      ))
    }
    return (
      <StyledBody>
        <img src='images/not-found-icon.svg' alt='not found icon' style={{
          marginTop: '30px',
        }} />
        <span>No liquidity found.</span>
      </StyledBody>
    )
  }

  if (Object.keys(selectedPairs).length) {
    const { currency0, currency1, token0Deposited, token1Deposited, poolTokenPercentage, userPoolBalance } = selectedPairs;

    return (
      <Page>
        <AppBody>
          <AppForm>
            <AppHeader>
              <div className="app-title" style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <ArrowBackIcon width="18px" style={{
                  marginRight: '20px',
                  cursor: 'pointer',
                }}
                  onClick={() => {
                    setSelectedPairs({})
                  }}
                />
                <span>Liquidity details</span>
              </div>
            </AppHeader>
  
            {/* <Divider /> */}
            <LiquidityDetail>
              <div className="general-info">
                <span className="token-pairs">
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={32} style={{
                    width: '84px',
                    height: '48px',
                  }} />
                  {currency0.symbol}/{currency1.symbol}</span>
                <span className="token-value">{userPoolBalance ? userPoolBalance?.toSignificant(4) : '-'} <span className="label">Pool tokens</span></span>
              </div>
  
              <div className="share-pool">
                <div className="item-row">
                  <span>Share of pool</span>
                  <span className="token-value">
                      {poolTokenPercentage
                    ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                    : '-'}
                  </span>
                </div>
                <div className="item-row">
                  <span className="currency-wrapper"><CurrencyLogo currency={currency0} size="24px" style={{ marginRight: '8px' }} /> {currency0.symbol} deposited</span>
                  <span className="token-value">{token0Deposited ? token0Deposited.toSignificant(6) : '-'} {currency0.symbol}</span>
                </div>
                <div className="item-row">
                  <span className="currency-wrapper"><CurrencyLogo currency={currency1} size="24px" style={{ marginRight: '8px' }} /> {currency1.symbol} deposited</span>
                  <span className="token-value">{token1Deposited ? token1Deposited.toSignificant(6) : '-'} {currency1.symbol}</span>
                </div>
              </div>
  
              <div className="button-wrapper">
                <Button
                  className="add-more"
                  as={NextLinkFromReactRouter}
                  to={`/add/${currencyId(currency0)}/${currencyId(currency1)}?step=1`}
                >
                  Add more
                </Button>
                <Button
                  className="remove"
                  as={NextLinkFromReactRouter}
                  to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                >
                  Remove
                </Button>
              </div>
            </LiquidityDetail>
          </AppForm>
        </AppBody>
      </Page>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppForm>
          <AppHeader>
            <div className="app-title">
              <img src="images/liquidity-icon.svg" alt="outline icon" />
              <span>Liquidity</span>
            </div>

            <div className="app-functions">
              <Transactions />
              <GlobalSettings color="#00FFFF" width="24px" />
            </div>
          </AppHeader>
        
          <MyLiquilidityTitle>
            My Liquidity
          </MyLiquilidityTitle>

          {renderBody()}

          <Divider />

          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Link href="/add" passHref>
                <StyledButton id="import-pool-link" variant="secondary">
                  Add liquidity
                </StyledButton>
              </Link>
              <DontSeePool>
                {`Or don't see a pool you joined?`} <Link href="/find" passHref>Imported it</Link>
              </DontSeePool>
            </Flex>
          )}
        </AppForm>
      </AppBody>
    </Page>
  )
}
