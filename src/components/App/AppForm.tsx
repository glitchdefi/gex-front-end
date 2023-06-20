import styled from 'styled-components'
import { Card, CardBody } from '@pancakeswap/uikit'
import GexMenu from 'components/GexMenu'

export const FormWrapper = styled(Card)`
  
`

const Body = styled(CardBody)`
  background-color: #151F23;
  min-height: 300px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppForm({ children }: { children: React.ReactNode }) {
  return <FormWrapper>
    <GexMenu />
    <Body>
      {children}
    </Body>
  </FormWrapper>
}
