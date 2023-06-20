import capitalize from "lodash/capitalize";
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, Token, Trade } from '@pancakeswap/sdk'
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange'
import {
  Button,
  Text,
  Box,
  useModal,
  Flex,
  IconButton,
  Skeleton,
  useMatchBreakpointsContext,
} from '@pancakeswap/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import Footer from 'components/Menu/Footer'
import { useRouter } from 'next/router'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useGasPriceMeta } from 'state/user/hooks'

import useRefreshBlockNumberID from './hooks/useRefreshBlockNumber'
import { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapDetails from './components/ConfirmSwapDetails'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectMetaButton from '../../components/ConnectMetaButton'

import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapState,
} from '../../state/swap/hooks'
import {
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  useExchangeChartManager,
} from '../../state/user/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'
// import PriceChartContainer from './components/Chart/PriceChartContainer'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import ImportTokenWarningModal from '../../components/ImportTokenWarningModal'

const SwapButton = styled(Button)`
  border-radius:0;
  color:${({ theme }) => theme.colors.textBlack };
  background-color:${({ theme }) => theme.colors.backgroundWhite };
  box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
  width: 100%;
  // margin-bottom: 26px;
`

const Label = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  color: #A7C1CA;
`

const SwitchIconButton = styled(IconButton)`
  // box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  background-color: transparent;
  // border:2px solid ${({ theme }) => theme.colors.primary};
  .icon-up-down {
    display: none;
  }
  &:hover {
    transform: rotate(180deg);
    // background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

// const CHART_SUPPORT_CHAIN_IDS = [ChainId.BSC, ChainId.GLITCH]
export default function Swap() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const gasPriceMeta = useGasPriceMeta();

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account, chainId } = useActiveWeb3React()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(BIG_INT_ZERO),
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, chainId)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })

        router.push('/tx-error')
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />, false)

  useEffect(() => {
    if (swapWarningCurrency) {
      
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)
      const showSwapWarning = shouldShowSwapWarning(currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)
      const showSwapWarning = shouldShowSwapWarning(currencyOutput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyOutput)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  // * FIXME
  // const isChartSupported = useMemo(() => CHART_SUPPORT_CHAIN_IDS.includes(chainId), [chainId])
  const isChartSupported = false;

  if (isConfirming && trade) {
    return (
      <ConfirmSwapDetails
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        customOnDismiss={handleConfirmDismiss}
        onBack={() => setIsConfirming(false)}
      />
    )
  }
  
  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width="100%" justifyContent="center" position="relative">
        {/* {!isMobile && isChartSupported && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )}
        {isChartSupported && (
          <BottomDrawer
            content={
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
                isMobile
              />
            }
            isOpen={isChartDisplayed}
            setIsOpen={setIsChartDisplayed}
          />
        )} */}
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded} >
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0px'} >
              <AppBody >
                <CurrencyInputHeader
                  title={t('Swap')}
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                  hasAmount={hasAmount}
                  onRefreshPrice={onRefreshPrice}
                />
                <Wrapper id="swap-page" style={{ minHeight: '412px', backgroundColor: '#151F23', paddingBottom: 32 }}>
                  <AutoColumn gap="sm">
                    <CurrencyInputPanel
                      label="From"
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />
                    <AutoColumn >
                      <AutoRow justify='flex-start' style={{ padding: '0 1rem' }} mt="16px" mb="16px">
                        <SwitchIconButton
                          variant="transparent"
                          scale="sm"
                          onClick={() => {
                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                            onSwitchTokens()
                          }} >
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM15 18.5V8.49996C15 7.94767 15.4477 7.49996 16 7.49996C16.5523 7.49996 17 7.94767 17 8.49996V18.5H18.6121C19.2628 18.5 19.6413 19.2355 19.2631 19.7649L16.2035 24.0485C16.1037 24.1881 15.8963 24.1881 15.7966 24.0485L12.7369 19.7649C12.3587 19.2355 12.7372 18.5 13.3879 18.5H15Z" fill="#00FFFF" />
                          </svg>
                        </SwitchIconButton>
                        <Text ml="16px" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', fontSize: 14, fontWeight: 400, color: '#A7C1CA' }}> Rate:  </Text>
                        {Boolean(trade) && (
                          <>
                            {isLoading ? (
                              <Skeleton width="100%" ml="8px" height="24px" />
                            ) : (
                                <TradePrice
                                  price={trade?.executionPrice}
                                  showInverted={showInverted}
                                  setShowInverted={setShowInverted}
                                />
                              )}
                          </>
                        )}
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label="To"
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                    />

                    {showWrap ? null : (
                      <AutoColumn gap="7px" style={{ padding: '0px 0px', marginTop: "32px", marginBottom: "8px" }}>
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
                      </AutoColumn>
                    )}
                  </AutoColumn>
                  <Box mt="16px">
                    {swapIsUnsupported ? (
                      <SwapButton width="100%" disabled>
                        {t('Unsupported Asset')}
                      </SwapButton>
                    ) : !account ? (
                      <ConnectMetaButton width="100%" />
                    ) : showWrap ? (
                      <SwapButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </SwapButton>
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
                        {singleHopOnly && <Text color="textSubtle">{t('Try enabling multi-hop trades.')}</Text>}
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <SwapButton
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                                t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                              )}
                        </SwapButton>
                        <SwapButton
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                          onClick={() => {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              txHash: undefined,
                            })
                            setIsConfirming(true)
                          }}
                          width="48%"
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3)
                          }
                        >
                          {priceImpactSeverity > 3
                            ? t('Price Impact High')
                            : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap')}
                        </SwapButton>
                      </RowBetween>
                    ) : (
                        <SwapButton
                          variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                          onClick={() => {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              txHash: undefined,
                            })
                            // onPresentConfirmModal()
                            setIsConfirming(true)
                          }}
                          id="swap-button"
                          width="100%"
                          disabled={!isValid || (priceImpactSeverity > 3) || !!swapCallbackError}
                        >
                          {swapInputError ||
                            (priceImpactSeverity > 3
                              ? t('Price Impact Too High')
                              : priceImpactSeverity > 2
                                ? t('Swap')
                                : t('Swap'))}
                        </SwapButton>
                      )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                  </Box>
                </Wrapper>
              </AppBody>
              {!swapIsUnsupported ? (
                trade &&
                <div />
                // <AdvancedSwapDetailsDropdown trade={trade} />
              ) : (
                  <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
                )}
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {isChartExpanded && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <Footer variant="side" helpUrl={EXCHANGE_DOCS_URLS} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Page>
  )
}
