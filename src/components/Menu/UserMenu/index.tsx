import { useEffect, useState } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  Flex,
  LogoutIcon,
  RefreshIcon,
  useModal,
  UserMenu as UIKitUserMenu,
  UserMenuDivider,
  UserMenuItem,
  UserMenuVariant,
  Box,
  Image,
  Text,
} from '@pancakeswap/uikit'
import { bsc, bscTest, glitch } from '@pancakeswap/wagmi'
import styled from 'styled-components'
import Trans from 'components/Trans'
import useAuth from 'hooks/useAuth'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useRouter } from 'next/router'
import { usePendingTransactions } from 'state/transactions/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

import WalletModal, { WalletView } from './WalletModal'

// const chains = [glitch, bsc, bscTest]
const chains = [glitch]

const UserMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .divider {
    width: 1px;
    display: block;
    background: #395660;
    height: 22px;
    margin-left: 16px;
    margin-right: 16px;
  }
`;

const GlitchBridge = styled.div`
  display: contents;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
  cursor: pointer;

  span {
    white-space: nowrap;
    margin-right: 10px;
  }
  
`;

const ThemeSwitcher = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  min-height: 32px;
  border: 1px solid #395660;
  margin-left: 26px;
  cursor: pointer;
`;

const UserMenu = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { account, error, chainId } = useWeb3React()
  const { balance } = useGetBnbBalance()
  const { logout } = useAuth()
  const { toastError, toastSuccess } = useToast()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')
  const isWrongNetwork: boolean = error && error instanceof UnsupportedChainIdError

  // const { chains, switchNetwork } = useSwitchNetwork()

  // const selectedChain = chains.find(item => item.id === chainId) || chains[0];
  const selectedChain = chains[0];


  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(t('%num% Pending', { num: pendingNumber }))
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber, t])

  useEffect(() => {
    if (isWrongNetwork) {
      toastError('', <Text mr="0" mb="">You’re on the wrong network. Please connect to the Glitch network.</Text>)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWrongNetwork]);

  const onClickWalletMenu = (): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }

  const UserMenuItems = () => {
    return (
      <>
        <UserMenuItem as="button" onClick={logout}>
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            {t('Disconnect')}
            <LogoutIcon />
          </Flex>
        </UserMenuItem>
      </>
    )
  }

  // if (account) {
  //   return (
  //     <UIKitUserMenu account={account} text={userMenuText} variant={userMenuVariable}>
  //       {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
  //     </UIKitUserMenu>
  //   )
  // }


  // if (isWrongNetwork) {
  //   return (
  //     <UIKitUserMenu text={t('Wrong Network')} variant="danger">
  //       {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
  //     </UIKitUserMenu>
  //   )
  // }

  return (
    <UserMenuWrapper>
      <GlitchBridge onClick={() => {
        window.open(process.env.NEXT_PUBLIC_GLITCH_BRIDGE_URL || 'https://bridge.glitch.finance/');
      }}>
        <Text mr="10px">Glitch Bridge</Text>
        <img className="open-link-svg" src="/images/open-link-icon.svg" alt={t('Glitch Bridge')} />
      </GlitchBridge>
      <div className="divider" />

      {
        !!isWrongNetwork && (
          <UIKitUserMenu text={t('Wrong Network')} variant="danger">
            {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
          </UIKitUserMenu>
        )
      }

      {
        !!(account && !isWrongNetwork) && (
          <UIKitUserMenu account={account} text={userMenuText} variant={userMenuVariable} bnbBalance={balance} chainName={selectedChain.name}>
            {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
          </UIKitUserMenu>   
        )
      }

      {
        !!(!account && !isWrongNetwork) && (
          <ConnectWalletButton scale="sm">
            <Box display={['none', , , 'block']}>
              <Trans>Connect Metamask</Trans>
            </Box>
            <Box display={['block', , , 'none']}>
              <Trans>Connect</Trans>
            </Box>
          </ConnectWalletButton>
        )
      }
      {/* <ThemeSwitcher>
        <Image src="/images/sun-icon.svg" height={16} width={16} />
      </ThemeSwitcher> */}
    </UserMenuWrapper>
    // <ConnectMetaButton />
  )
}

export default UserMenu
