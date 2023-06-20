import styled from 'styled-components'
import {
  ChartIcon,
  Flex,
  Heading,
  HistoryIcon,
  IconButton,
  NotificationDot,
  Text,
  useModal,
  ChartDisableIcon,
  GexSwapIcon
} from '@pancakeswap/uikit'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useExpertModeManager } from 'state/user/hooks'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { useCallback } from 'react'
import GexMenu from 'components/GexMenu'

interface Props {
  title: string
  subtitle?: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const CurrencyInputContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  // padding: 20px 0px 0px;
  width: 100%;
  background-color: #1c2a2f;
`
const SwitchTitle = styled(Flex)`
  width: 100%;
  align-items:center;
  justify-content:space-between;
  padding-bottom:10px;
  // background-color: ${({ theme }) => theme.colors.backgroundModal};
`
const SubHeader = styled(Flex)`
  padding: 10px 20px 0px;
  background-color: ${({ theme }) => theme.colors.backgroundModal};
`

const CurrencyInputHeader: React.FC<Props> = ({
  title,
  subtitle,
  setIsChartDisplayed,
  isChartDisplayed,
  hasAmount,
  onRefreshPrice,
}) => {
  const [expertMode] = useExpertModeManager()
  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const handleOnClick = useCallback(() => onRefreshPrice?.(), [onRefreshPrice])

  return (
    <CurrencyInputContainer >
      <GexMenu />
      <SubHeader width="100%" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" mt="18px" mb="16px">
          <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm" mr="16px">
            <GexSwapIcon width={25} height={25} color="#F100F5" />
          </IconButton>
          <Text fontSize="20px" bold>Swap</Text>
        </Flex>
        <Flex>
          <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm">
            <HistoryIcon color="primary" width="24px" />
          </IconButton>
          <NotificationDot show={expertMode}>
            <GlobalSettings color="primary" mr="0" />
          </NotificationDot>
        </Flex>

      </SubHeader>
      <Flex style={{backgroundColor:'#23353B', height:1,width:'100%',padding:'0px 15px'}}/>

      {/* <Flex alignItems="center">
        <Text color="textSubtle" fontSize="14px">
          {subtitle}
        </Text>
      </Flex> */}
    </CurrencyInputContainer>
  )
}

export default CurrencyInputHeader
