import styled from 'styled-components'
import { Button, useWalletModal, ButtonProps, MetamaskIcon } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { useTranslation } from 'contexts/Localization'
import Trans from './Trans'

const MetaButton = styled(Button)<{ selected: boolean }>`
  border-radius:0px;
  background-color: transparent;

  box-sizing: border-box;
  padding: 0px;
  margin: 0;

  width: 194px;
  height: 32px;

  border: 2px solid #00FFFF;

  font-size: 14px;
  color: #00FFFF;
`

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const handleActive = useActiveHandle()
  const { onPresentConnectModal } = useWalletModal(login, t)

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      onPresentConnectModal()
    }
  }

  return (
    <MetaButton onClick={handleClick} {...props}>
      <MetamaskIcon
        style={{ cursor: 'pointer',marginRight:10 }}
        width="18px"
      />
      {children || <Trans>Connect Metamask</Trans>}
    </MetaButton>
  )
}

export default ConnectWalletButton
