import { HelpIcon, useTooltip, Box, BoxProps, Placement } from '@pancakeswap/uikit'
import styled from 'styled-components'

interface Props extends BoxProps {
  text: string | React.ReactNode
  placement?: Placement
  size?: string
}

const QuestionWrapper = styled.div`
  :hover,
  :focus {
    opacity: 0.7;
  }
`

const QuestionHelper: React.FC<Props> = ({ text, placement = 'right-end', size = '16px', ...props }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(text, { placement })

  return (
    <Box {...props}>
      {tooltipVisible && tooltip}
      <QuestionWrapper ref={targetRef}>
        {/* <HelpIcon color="textSubtle" width={size} /> */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8 13.8125C4.79063 13.8125 2.1875 11.2094 2.1875 8C2.1875 4.79063 4.79063 2.1875 8 2.1875C11.2094 2.1875 13.8125 4.79063 13.8125 8C13.8125 11.2094 11.2094 13.8125 8 13.8125Z" fill="#A7C1CA" />
          <path d="M7.25 10.75C7.25 10.9489 7.32902 11.1397 7.46967 11.2803C7.61032 11.421 7.80109 11.5 8 11.5C8.19891 11.5 8.38968 11.421 8.53033 11.2803C8.67098 11.1397 8.75 10.9489 8.75 10.75C8.75 10.5511 8.67098 10.3603 8.53033 10.2197C8.38968 10.079 8.19891 10 8 10C7.80109 10 7.61032 10.079 7.46967 10.2197C7.32902 10.3603 7.25 10.5511 7.25 10.75ZM7.625 9H8.375C8.44375 9 8.5 8.94375 8.5 8.875V4.625C8.5 4.55625 8.44375 4.5 8.375 4.5H7.625C7.55625 4.5 7.5 4.55625 7.5 4.625V8.875C7.5 8.94375 7.55625 9 7.625 9Z" fill="#A7C1CA" />
        </svg>

      </QuestionWrapper>
    </Box>
  )
}

export default QuestionHelper
