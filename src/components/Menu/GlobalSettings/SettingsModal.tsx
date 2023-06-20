import { useState } from 'react'
import styled from 'styled-components'
import { Text, PancakeToggle, Toggle, Flex, Modal, InjectedModalProps, ThemeSwitcher, Box } from '@pancakeswap/uikit'
import {
  useAudioModeManager,
  useExpertModeManager,
  useSubgraphHealthIndicatorManager,
  useUserExpertModeAcknowledgementShow,
  useUserSingleHopOnly,
  useZapModeManager,
} from 'state/user/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
import GasSettings from './GasSettings'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: none;
    height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
    height: auto;
  }
`

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  const [zapMode, toggleZapMode] = useZapModeManager()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()
  const { theme, isDark, setTheme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else if (!showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
    <Modal
      title={t('Settings')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ width: '540px' }}
    >
      <ScrollableContainer>
        <Flex pb="24px" flexDirection="column">
          <GasSettings />
        </Flex>
        <Flex pt="24px" flexDirection="column" borderTop={`1px ${theme.colors.cardBorder} solid`}>
          <TransactionSettings />
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
