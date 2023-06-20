import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@pancakeswap/uikit'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Link from 'next/link'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string | (() => void)
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  // border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom: 1px solid #23353B;
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" width="100%" style={{ gap: '16px' }}>
        {backTo &&
          (typeof backTo === 'string' ? (
            <Link passHref href={backTo}>
              <IconButton as="a" scale="sm">
                <ArrowBackIcon width="18px" />
              </IconButton>
            </Link>
          ) : (
            <IconButton scale="sm" variant="text" onClick={backTo}>
              <ArrowBackIcon width="18" />
            </IconButton>
          ))}
        <Flex flexDirection="column" width="100%">
          <Flex mb="8px" alignItems="center" justifyContent="space-between">
            <Heading as="h2" color="#fff" style={{
              fontSize: '20px',
              fontWeight: 600,
            }}>{title}</Heading>
            {!noConfig && (
              <Flex alignItems="center">
                <NotificationDot show={expertMode}>
                  <GlobalSettings />
                </NotificationDot>
                <Transactions />
              </Flex>
            )}
          </Flex>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />}
            <Text color="#A7C1CA" fontSize="12px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
