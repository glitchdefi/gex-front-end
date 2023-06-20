import { Button, useWalletModal, ButtonProps,MetamaskIcon } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

import Trans from './Trans'

const MetaButton = styled(Button)<{ selected: boolean }>`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
`
const ConnectMetaButton = ({ children, ...props }: ButtonProps) => {
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

export default ConnectMetaButton
