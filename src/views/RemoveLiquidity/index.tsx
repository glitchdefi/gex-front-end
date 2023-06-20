import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { useRouter } from 'next/router'
import useToast from 'hooks/useToast'
import { ETHER, Percent } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  CardBody,
  Slider,
  Box,
  Flex,
} from '@pancakeswap/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { getZapAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { AutoColumn } from '../../components/Layout/Column'
import { PooledSummaryCard, ConfirmRemoveLiquidCard } from '../../components/PositionCard'
import { AppHeader, AppBody, AppForm } from '../../components/App'
import { RowBetween, AutoRow } from '../../components/Layout/Row'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { DoubleCurrencyLogo } from '../../components/Logo'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { calculateGasMargin } from '../../utils'
import { getRouterContract, calculateSlippageAmount } from '../../utils/exchange'
import useDebouncedChangeHandler from '../../hooks/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import Dots from '../../components/Loader/Dots'
import { useBurnActionHandlers, useDerivedBurnInfo, useBurnState } from '../../state/burn/hooks'

import { Field } from '../../state/burn/actions'
import { useGasPrice, useUserSlippageTolerance, useZapModeManager } from '../../state/user/hooks'
import Page from '../Page'
import { logError } from '../../utils/sentry'

const BorderCard = styled.div`
  // border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  // border-radius: 16px;
  padding: 16px;
  background: #1C2A2F;
  height: 116px;
  margin-bottom: 26px;
`

const Divider = styled.div`
  width: 3px;
  height: 20px;
  background: #152023;
  // background: red;
  display: block;
  z-index: 99;
`;

const StyledButton = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
`

export default function RemoveLiquidity() {
  const router = useRouter()
  const [zapMode] = useZapModeManager()
  const [temporarilyZapMode, setTemporarilyZapMode] = useState(true)
  const [currencyIdA, currencyIdB] = router.query.currency || []
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const { toastError } = useToast()
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId],
  )

  const [isRemoving, setIsRemoving] = useState(false);

  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  const zapModeStatus = useMemo(() => !!zapMode && temporarilyZapMode, [zapMode, temporarilyZapMode])

  // burn state
  const { independentField, typedValue } = useBurnState()
  const [removalCheckedA, setRemovalCheckedA] = useState(true)
  const [removalCheckedB, setRemovalCheckedB] = useState(true)
  const { pair, parsedAmounts, error} = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    removalCheckedA,
    removalCheckedB,
    zapModeStatus,
  )
  const isZap = (!removalCheckedA || !removalCheckedB) && zapModeStatus

  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
  const [{ attemptingTxn, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    isZap ? getZapAddress() : ROUTER_ADDRESS[chainId],
  )

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)
    const nameLP = await pairContract.name()

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]

    const domain = {
      name: nameLP,
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS[chainId],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        })
      })
      .catch((err) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (err?.code !== 4001) {
          approveCallback()
        }
      })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      toastError(t('Error'), t('Missing currency amounts'))
      throw new Error('missing currency amounts')
    }
    const routerContract = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) {
      toastError(t('Error'), t('Missing tokens'))
      throw new Error('missing tokens')
    }
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    const currencyBIsBNB = currencyB === ETHER
    const oneCurrencyIsBNB = currencyA === ETHER || currencyBIsBNB

    if (!tokenA || !tokenB) {
      toastError(t('Error'), t('Could not wrap'))
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsBNB) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsBNB ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsBNB) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsBNB ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      toastError(t('Error'), t('Attempting to confirm without approval or a signature'))
      throw new Error('Attempting to confirm without approval or a signature')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((err) => {
            console.error(`estimateGas failed`, methodName, args, err)
            return undefined
          }),
      ),
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate),
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      toastError(t('Error'), t('This transaction would fail'))
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
        gasPrice,
      })
        .then((response: TransactionResponse) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })
          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
            type: 'remove-liquidity',
          })
        })
        .catch((err) => {
          if (err && err.code !== 4001) {
            logError(err)
            console.error(`Remove Liquidity failed`, err, args)
          } else {
            // toastError(t('Error'), err.message)
          }


          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage:
              err && err?.code !== 4001
                ? t('Remove liquidity failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
                : undefined,
            txHash: undefined,
          })
        })
    }
  }

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  const handleChangePercent = useCallback(
    (value) => setInnerLiquidityPercentage(Math.ceil(value)),
    [setInnerLiquidityPercentage],
  )

  if (isRemoving && pair) {
    return <ConfirmRemoveLiquidCard
      onBack={() => setIsRemoving(false)}
      onRemove={onRemove}
      pair={pair}
      token0Removed={formattedAmounts[Field.CURRENCY_A]}
      token1Removed={formattedAmounts[Field.CURRENCY_B]}
      poolTokenRemoved={parsedAmounts[Field.LIQUIDITY]?.toSignificant(4)}
      userPoolTokenPercentage={innerLiquidityPercentage}
      attemptingTxn={attemptingTxn}
      approval={approval}
      signatureData={signatureData}
      hash={txHash || ''}
    />
  }

  return (
    <Page>
      <AppBody>
        <AppForm>
          <AppHeader
            backTo="/liquidity"
            title={t('Remove liquidity')}
            subtitle="Remove liquidity to receive trading fees and LP tokens"
            noConfig
          />

          <CardBody>
            <AutoColumn gap="20px">
              <AutoRow>
                <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin size={32} style={{
                  width: '84px',
                  height: '48px',
                }} />
                <Text fontWeight={400} fontSize="20px" color="#E5ECEF">{currencyA?.symbol}/{currencyB?.symbol}</Text>
              </AutoRow>

              <AutoRow>
              {pair ? (
                  <PooledSummaryCard
                    pair={pair}
                    token0Removed={formattedAmounts[Field.CURRENCY_A]}
                    token1Removed={formattedAmounts[Field.CURRENCY_B]}
                    poolTokenRemoved={parsedAmounts[Field.LIQUIDITY]?.toSignificant(4)}
                  />
              ) : null}
                
              </AutoRow>
              {!showDetailed && (
                <BorderCard>
                  <Text fontSize="14px" textAlign="center" mb="6px" color="#E5ECEF">Remove amount</Text>

                  <Slider
                    name="lp-amount"
                    min={0}
                    max={100}
                    value={innerLiquidityPercentage}
                    onValueChanged={handleChangePercent}
                    mb="16px"
                  />
                  <Flex flexWrap="wrap" justifyContent="space-between" style={{
                    marginTop: '-50px'
                  }}>
                    <Divider style={{ visibility: "hidden", }} />
                    <Divider />
                    <Divider />
                    <Divider />
                    <Divider />
                  </Flex>
                  <Flex flexWrap="wrap" justifyContent="space-between" style={{
                    marginTop: '0px'
                  }}>
                    <Text style={{ visibility: "hidden", }}>
                      0%
                    </Text>
                    <Text color="#A7C1CA" fontSize="14px">
                      25%
                    </Text>
                    <Text color="#A7C1CA" fontSize="14px">
                      50%
                    </Text>
                    <Text color="#A7C1CA" fontSize="14px">
                      75%
                    </Text>
                    <Text color="#A7C1CA" fontSize="14px">
                      100%
                    </Text>
                  </Flex>
                </BorderCard>
              )}
            </AutoColumn>
            
            <Box position="relative" mt="16px">
              {!account ? (
                <ConnectWalletButton />
              ) : (
                <RowBetween>
                  <StyledButton
                    variant={
                      approval === ApprovalState.APPROVED || (!isZap && signatureData !== null) ? 'success' : 'primary'
                    }
                    onClick={isZap ? approveCallback : onAttemptToApprove}
                    disabled={approval !== ApprovalState.NOT_APPROVED || (!isZap && signatureData !== null)}
                    width="100%"
                    mr="0.5rem"
                  >
                    {approval === ApprovalState.PENDING ? (
                      <Dots>{t('Enabling')}</Dots>
                    ) : approval === ApprovalState.APPROVED || (!isZap && signatureData !== null) ? (
                      t('Enabled')
                    ) : (
                      t('Enable')
                    )}
                  </StyledButton>
                  <StyledButton
                    variant={
                      !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                        ? 'danger'
                        : 'primary'
                    }
                    onClick={() => {
                      setLiquidityState({
                        attemptingTxn: false,
                        liquidityErrorMessage: undefined,
                        txHash: undefined,
                      })
                      // onPresentRemoveLiquidity()

                      setIsRemoving(true)
                    }}
                    width="100%"
                    disabled={
                      !isValid ||
                      (!isZap && signatureData === null && approval !== ApprovalState.APPROVED) ||
                      (isZap && approval !== ApprovalState.APPROVED)
                    }
                  >
                    {error || t('Remove')}
                  </StyledButton>
                </RowBetween>
              )}
            </Box>
          </CardBody>
        </AppForm>
      </AppBody>
    </Page>
  )
}
