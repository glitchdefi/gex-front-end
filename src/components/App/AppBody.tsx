import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const BodyWrapper = styled(Card)`
  border-radius: 0px;
  max-width: 636px;
  width: 100%;
  z-index: 1;
  margin-top: 10vh;
  margin-left: auto;
  margin-right: auto;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
