import { useCallback, useEffect, useState } from 'react'
import { Currency, ETHER, JSBI, TokenAmount } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, AddIcon, useModal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import useToast from 'hooks/useToast'
import { useRouter } from 'next/router'
import { AutoColumn } from '../../components/Layout/Column'
import { CurrencyLogo } from '../../components/Logo'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row from '../../components/Layout/Row'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { PairState, usePair } from '../../hooks/usePairs'
import { usePairAdder } from '../../state/user/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody, AppForm } from '../../components/App'
import Page from '../Page'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const StyledButton = styled(Button)`
  // background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 0px;
  border: 1px solid #395660;
  background: transparent;
`

const StyledButtonManage = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
 margin-top: 20px;
`

const StyledCurrencyInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;

  margin-right: 20px;
  margin-left: 20px;

  button {
    width: 100%;
  }

  .plus-icon {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

const LightCard = styled.div`
  img {
    margin-top: 30px;
    margin-bottom: 30px;
  }

  span {
    margin-bottom: 20px;
  }

  a {
    text-decoration-line: underline;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: #00FFFF;
  }
`;

export default function PoolFinder() {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const router = useRouter()
  const { toastSuccess } = useToast()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState<Currency | null>(ETHER)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, BIG_INT_ZERO) &&
        JSBI.equal(pair.reserve1.raw, BIG_INT_ZERO),
    )

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, BIG_INT_ZERO))

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <LightCard>
      <Text textAlign="center">
        {!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
      </Text>
    </LightCard>
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Page>
      <AppBody>
        <AppForm>
          <AppHeader title={t('Import Liquidity')} subtitle={t('Import your existing liquidity to manage them one place')} backTo="/liquidity" noConfig />
          <StyledCurrencyInput>
            <StyledButton
              endIcon={<ChevronDownIcon />}
              onClick={() => {
                onPresentCurrencyModal()
                setActiveField(Fields.TOKEN0)
              }}
            >
              {currency0 ? (
                <Row>
                  <CurrencyLogo currency={currency0} />
                  <Text ml="8px">{currency0.symbol}</Text>
                </Row>
              ) : (
                <Text ml="8px">{t('Select a Token')}</Text>
              )}
            </StyledButton>

            <AddIcon className='plus-icon' width="32px" />

            <StyledButton
              endIcon={<ChevronDownIcon />}
              onClick={() => {
                onPresentCurrencyModal()
                setActiveField(Fields.TOKEN1)
              }}
            >
              {currency1 ? (
                <Row>
                  <CurrencyLogo currency={currency1} />
                  <Text ml="8px">{currency1.symbol}</Text>
                </Row>
              ) : (
                <Text as={Row}>{t('Select a Token')}</Text>
              )}
            </StyledButton>

            
          </StyledCurrencyInput>

          <AutoColumn style={{ padding: '1rem' }} gap="md">
            {currency0 && currency1 ? (
                pairState === PairState.EXISTS ? (
                  hasPosition && pair ? (
                    <>
                      <MinimalPositionCard pair={pair} />
                      <StyledButtonManage onClick={() => {
                          toastSuccess('Congrats!', <Text>Your liquidity has been imported successfully.</Text>)
                          router.push('liquidity');
                        }}>
                        {t('Import')}
                      </StyledButtonManage>
                    </>
                  ) : (
                    <LightCard>
                      <AutoColumn gap="sm" justify="center">
                        <img src='images/not-found-icon.svg' alt='not found icon' />
                        <span>You don’t have liquidity in this pool yet.</span>
                        <Link
                          href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                          passHref
                        >
                          {t('Add Liquidity')}
                        </Link>
                      </AutoColumn>
                    </LightCard>
                  )
                ) : validPairNoLiquidity ? (
                  <LightCard>
                    <AutoColumn gap="sm" justify="center">
                      <img src='images/not-found-icon.svg' alt='not found icon' />
                      <span>{t('You don’t have liquidity in this pool yet Add liquidity')}</span>
                      <Link
                        href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                        passHref
                      >
                        Add liquidity
                      </Link>
                    </AutoColumn>
                  </LightCard>
                ) : pairState === PairState.INVALID ? (
                  <LightCard>
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center" fontWeight={500}>
                        {t('Invalid pair.')}
                      </Text>
                    </AutoColumn>
                  </LightCard>
                ) : pairState === PairState.LOADING ? (
                  <LightCard>
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center">
                        {t('Loading')}
                        <Dots />
                      </Text>
                    </AutoColumn>
                  </LightCard>
                ) : null
              ) : (
                prerequisiteMessage
              )}
          </AutoColumn>
        </AppForm>
      </AppBody>
    </Page>
  )
}
