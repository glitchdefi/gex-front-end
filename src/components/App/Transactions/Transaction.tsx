import styled from 'styled-components'
import { CheckmarkIcon, CloseIcon, LinkExternal, Text, InfoIcon } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBscScanLink } from 'utils'
import { TransactionDetails } from 'state/transactions/reducer'
import CircleLoader, { CircleLoaderColor } from '../../Loader/CircleLoader'

const TransactionState = styled.div<{ pending: boolean; success?: boolean; index?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  height: 70px;
  color: #C1D4DA;
  background: ${({ index }) => !(index % 2) ? '#151F23' : 'rgba(255, 255, 255, 0.03)'};
  padding: 24px 18px;
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) =>
    pending ? theme.colors.primary : success ? theme.colors.success : theme.colors.failure};
`

const SwapIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.2486 9.25H2.37517C2.30642 9.25 2.25017 9.30625 2.25017 9.375V10.3125C2.25017 10.3812 2.30642 10.4375 2.37517 10.4375H11.8314L9.57673 13.2969C9.51267 13.3781 9.57048 13.5 9.67517 13.5H10.808C10.8845 13.5 10.9564 13.4656 11.0049 13.4047L13.6424 10.0594C13.9002 9.73125 13.6674 9.25 13.2486 9.25ZM13.6252 5.5625H4.16892L6.42361 2.70312C6.48767 2.62188 6.42986 2.5 6.32517 2.5H5.19236C5.1158 2.5 5.04392 2.53438 4.99548 2.59531L2.35798 5.94063C2.10017 6.26875 2.33298 6.75 2.75017 6.75H13.6252C13.6939 6.75 13.7502 6.69375 13.7502 6.625V5.6875C13.7502 5.61875 13.6939 5.5625 13.6252 5.5625Z" fill="#F100F5"/>
    </svg>
  )
}

const LiquidityIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3571 12.1263V3.87366C13.7321 3.74107 14 3.38348 14 2.96429C14 2.43125 13.5688 2 13.0357 2C12.6165 2 12.2589 2.26786 12.1263 2.64286H3.87366C3.74107 2.26786 3.38348 2 2.96429 2C2.43125 2 2 2.43125 2 2.96429C2 3.38348 2.26786 3.74107 2.64286 3.87366V12.1263C2.26786 12.2589 2 12.6165 2 13.0357C2 13.5688 2.43125 14 2.96429 14C3.38348 14 3.74107 13.7321 3.87366 13.3571H12.1263C12.2589 13.7321 12.6165 14 13.0357 14C13.5688 14 14 13.5688 14 13.0357C14 12.6165 13.7321 12.2589 13.3571 12.1263ZM13.0357 2.64286C13.2138 2.64286 13.3571 2.78616 13.3571 2.96429C13.3571 3.14241 13.2138 3.28571 13.0357 3.28571C12.8576 3.28571 12.7143 3.14241 12.7143 2.96429C12.7143 2.78616 12.8576 2.64286 13.0357 2.64286ZM2.96429 13.3571C2.78616 13.3571 2.64286 13.2138 2.64286 13.0357C2.64286 12.8576 2.78616 12.7143 2.96429 12.7143C3.14241 12.7143 3.28571 12.8576 3.28571 13.0357C3.28571 13.2138 3.14241 13.3571 2.96429 13.3571ZM2.96429 3.28571C2.78616 3.28571 2.64286 3.14241 2.64286 2.96429C2.64286 2.78616 2.78616 2.64286 2.96429 2.64286C3.14241 2.64286 3.28571 2.78616 3.28571 2.96429C3.28571 3.14241 3.14241 3.28571 2.96429 3.28571ZM12.3929 12.3929H3.60714V3.60714H12.3929V12.3929ZM13.0357 13.3571C12.8576 13.3571 12.7143 13.2138 12.7143 13.0357C12.7143 12.8576 12.8576 12.7143 13.0357 12.7143C13.2138 12.7143 13.3571 12.8576 13.3571 13.0357C13.3571 13.2138 13.2138 13.3571 13.0357 13.3571Z" fill="#F100F5"/>
    <path d="M4.88921 7.48444H11.1114C11.2337 7.48444 11.3337 7.38688 11.3337 7.26764V4.88282C11.3337 4.76358 11.2337 4.66602 11.1114 4.66602H4.88921C4.76699 4.66602 4.66699 4.76358 4.66699 4.88282V7.26764C4.66699 7.38688 4.76699 7.48444 4.88921 7.48444ZM5.66699 5.64163H10.3337V6.50883H5.66699V5.64163ZM4.88921 11.3327H11.1114C11.2337 11.3327 11.3337 11.2351 11.3337 11.1159V8.73106C11.3337 8.61182 11.2337 8.51425 11.1114 8.51425H4.88921C4.76699 8.51425 4.66699 8.61182 4.66699 8.73106V11.1159C4.66699 11.2351 4.76699 11.3327 4.88921 11.3327ZM5.66699 9.48986H10.3337V10.3571H5.66699V9.48986Z" fill="#F100F5"/>
    </svg>
  )
}

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const getIcon = (type) => {
  switch (type) {
    case 'add-liquidity':
    case 'remove-liquidity':
      return LiquidityIcon;
    // eslint-disable-next-line no-duplicate-case
    case 'swap':
        return SwapIcon;
    default:
      return InfoIcon;
  }
};

export default function Transaction({ tx, index }: { tx: TransactionDetails, index: number }) {
  const { chainId } = useActiveWeb3React()

  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const Icon = getIcon(tx?.type);

  const PendingStatus = () => {
    return (
      <StatusWrapper>
        <CircleLoaderColor stroke="#D87A16" />
        <Text ml="8px" color="#D87A16">Pending</Text>
      </StatusWrapper>
    )
  };

  const SuccessStatus = () => {
    return (
      <StatusWrapper>
        <CheckmarkIcon color="#49AA19" />
        <Text ml="8px" color="#49AA19">Success</Text>
      </StatusWrapper>
    )
  };

  const FailedStatus = () => {
    return (
      <StatusWrapper>
        <InfoIcon color="#D32029" width="14px" />
        <Text ml="8px" color="#D32029">Failed</Text>
      </StatusWrapper>
    )
  };

  if (!chainId) return null

  return (
    <TransactionState pending={pending} success={success} index={index}>
      <TextWrapper>
        <Icon style={{
          width: '14px'
        }} color="#F100F5" />
        <Text fontSize="14px" color="#C1D4DA" ml="10px" mr="10px">{summary ?? tx.hash}</Text>
        <LinkExternal href={getBscScanLink(tx.hash, 'transaction', chainId)} />
      </TextWrapper>
      
      <IconWrapper pending={pending} success={success}>
        {pending ? <PendingStatus /> : success ? <SuccessStatus /> : <FailedStatus />}
      </IconWrapper>
    </TransactionState>
  )
}
