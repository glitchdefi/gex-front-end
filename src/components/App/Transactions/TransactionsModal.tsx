import styled from 'styled-components'
import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Modal, ModalBody, Text, Button, Flex, InjectedModalProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import orderBy from 'lodash/orderBy'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import { useAppDispatch } from 'state'
import { clearAllTransactions } from 'state/transactions/actions'
import { AutoRow } from '../../Layout/Row'
import Transaction from './Transaction'
import ConnectWalletButton from '../../ConnectWalletButton'

const NotFound = styled.div`
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function renderTransactions(transactions: TransactionDetails[]) {
  return (
    <Flex flexDirection="column">
      {transactions.map((tx, index) => {
        return <Transaction key={tx.hash + tx.addedTime} tx={tx} index={index} />
      })}
    </Flex>
  )
}

const TransactionsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const allTransactions = useAllTransactions()

  const { t } = useTranslation()

  const sortedRecentTransactions = orderBy(
    Object.values(allTransactions).filter(isTransactionRecent),
    'addedTime',
    'desc',
  )

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <Modal title={t('Transaction history')} headerBackground="gradients.cardHeader" onDismiss={onDismiss} bodyPadding="0px">
      {account ? (
        <ModalBody width="640px">
          {!!pending.length || !!confirmed.length ? (
            <>
              {/* <AutoRow mb="1rem" style={{ justifyContent: 'space-between' }}>
                <Text>{t('Recent Transactions')}</Text>
                <Button variant="tertiary" scale="xs" onClick={clearAllTransactionsCallback}>
                  {t('clear all')}
                </Button>
              </AutoRow> */}
              {renderTransactions(pending)}
              {renderTransactions(confirmed)}
            </>
          ) : (
            <NotFound>
              <Text>{t('No recent transactions')}</Text>
            </NotFound>
          )}
        </ModalBody>
      ) : (
        <ConnectWalletButton />
      )}
    </Modal>
  )
}

export default TransactionsModal
