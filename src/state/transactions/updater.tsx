import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/router";
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrentBlock } from 'state/block/hooks'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import { AppState, useAppDispatch } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'

export function shouldCheck(
  currentBlock: number,
  tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number },
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = currentBlock - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  }
  // otherwise every block
  return true
}

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const router = useRouter()

  const currentBlock = useCurrentBlock()

  const dispatch = useAppDispatch()
  const state = useSelector<AppState, AppState['transactions']>((s) => s.transactions)

  const transactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])
  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (!chainId || !library || !currentBlock) return

    Object.keys(transactions)
      .filter((hash) => shouldCheck(currentBlock, transactions[hash]))
      .forEach((hash) => {
        library
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )

              const toast = receipt.status === 1 ? toastSuccess : toastError
              const transaction = transactions[receipt.transactionHash];
              if (receipt.status === 1 && transaction && ['remove-liquidity', 'add-liquidity', 'swap'].includes(transaction.type)) {
                if (['add-liquidity', 'swap'].includes(transaction.type)) {
                  toast('Successful!', <ToastDescriptionWithTx txHash={receipt.transactionHash} description="Your transaction has been submitted. It might take some time for the change to reflect in your account" />)
                }

                if (transaction.type === 'remove-liquidity') {
                  toast('Congrats!', <ToastDescriptionWithTx txHash={receipt.transactionHash} description="Your liquidity has been removed successfully." />)
                }

                if (transaction.type === 'swap') {
                  router.push('/swap');
                } else {
                  router.push('/liquidity');
                }
              } else {
                toast(t('Transaction receipt'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
              }
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: currentBlock }))
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, transactions, currentBlock, dispatch, toastSuccess, toastError, t])

  return null
}
