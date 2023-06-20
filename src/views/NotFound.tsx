import styled from 'styled-components'
import { Button, Heading, GexLogoWithTextIcon } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: flex-start;
  padding-top: 50px;
`

const Text404 = styled.div`
  margin-top: 96px;
  margin-bottom: 64px;
`;

const Text = styled.div`
  margin-bottom: 64px;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: #C1D4DA;
`;

const StyledButton = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
`

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <img src="/images/glitch-logo.png" height={67} width={140} alt="Glitch logo" />
        <Text404>
          <img src="images/404-text.png" alt="404-text" />
        </Text404>
        <Text>{t('The page you are looking for can not be found')}</Text>
        <Link href="/" passHref>
          <StyledButton>
            {t('Back to Main page')}
          </StyledButton>
        </Link>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
