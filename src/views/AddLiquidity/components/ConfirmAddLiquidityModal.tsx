import styled from "styled-components";
import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Fraction, Percent, Token, TokenAmount } from '@pancakeswap/sdk'
import { InjectedModalProps, Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from 'components/TransactionConfirmationModal'
import { Field } from 'state/burn/actions'
import { AddLiquidityModalHeader, PairDistribution } from './common'

const StyledButton = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
`

interface ConfirmAddLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  hash: string
  pendingText: string
  currencies: { [field in Field]?: Currency }
  noLiquidity: boolean
  allowedSlippage: number
  liquidityErrorMessage: string
  price: Fraction
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  onAdd: () => void
  poolTokenPercentage: Percent
  liquidityMinted: TokenAmount
  currencyToAdd: Token
}

const ConfirmAddLiquidityModal: React.FC<InjectedModalProps & ConfirmAddLiquidityModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  price,
  currencies,
  noLiquidity,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  currencyToAdd,
}) => {
  const { t } = useTranslation()

  const modalHeader = useCallback(() => {
    return (
      <AddLiquidityModalHeader
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        liquidityMinted={liquidityMinted}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        noLiquidity={noLiquidity}
      >
        <PairDistribution
          title={t('Input')}
          percent={0.5}
          currencyA={currencies[Field.CURRENCY_A]}
          currencyAValue={parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          currencyB={currencies[Field.CURRENCY_B]}
          currencyBValue={parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
        />
      </AddLiquidityModalHeader>
    )
  }, [allowedSlippage, currencies, liquidityMinted, noLiquidity, parsedAmounts, poolTokenPercentage, price, t])

  const modalBottom = useCallback(() => {
    return (
      <StyledButton width="100%" onClick={onAdd} mt="40px">
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm')}
      </StyledButton>
    )
  }, [noLiquidity, onAdd, t])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <TransactionErrorContent onDismiss={onDismiss} message={liquidityErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [onDismiss, modalBottom, modalHeader, liquidityErrorMessage],
  )

  return (
    <TransactionConfirmationModal
      minWidth={['100%', , '640px']}
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={currencyToAdd}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmAddLiquidityModal