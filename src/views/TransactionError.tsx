import styled from 'styled-components'
import { Button, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import Link from 'next/link'

const StyledTransactionError = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: flex-start;
  margin-top: 120px;
`

const StyledButton = styled(Button)`
 border-radius:0px;
 background: transparent;
 color: #00FFFF;
 border: 1px solid #00FFFF;
 font-size: 14px;
 padding: 6px 12px;
`

const ErrorIcon = () => {
  return (
    <svg width="74" height="64" viewBox="0 0 74 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_dd_1807_1726)">
      <circle cx="37" cy="32" r="32" fill="#001529"/>
      </g>
      <path d="M38.618 32L46.8211 22.2219C46.9586 22.0594 46.843 21.8125 46.6305 21.8125H44.1368C43.9899 21.8125 43.8493 21.8781 43.7524 21.9906L36.9868 30.0563L30.2211 21.9906C30.1274 21.8781 29.9868 21.8125 29.8368 21.8125H27.343C27.1305 21.8125 27.0149 22.0594 27.1524 22.2219L35.3555 32L27.1524 41.7781C27.1216 41.8143 27.1018 41.8586 27.0955 41.9058C27.0891 41.9529 27.0964 42.0008 27.1164 42.0439C27.1365 42.087 27.1685 42.1235 27.2087 42.1489C27.2489 42.1744 27.2955 42.1878 27.343 42.1875H29.8368C29.9836 42.1875 30.1243 42.1219 30.2211 42.0094L36.9868 33.9438L43.7524 42.0094C43.8461 42.1219 43.9868 42.1875 44.1368 42.1875H46.6305C46.843 42.1875 46.9586 41.9406 46.8211 41.7781L38.618 32Z" fill="#D32029"/>
      <defs>
      <filter id="filter0_dd_1807_1726" x="0" y="0" width="74" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.945098 0 0 0 0 0 0 0 0 0 0.960784 0 0 0 1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1807_1726"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="-5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow_1807_1726" result="effect2_dropShadow_1807_1726"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1807_1726" result="shape"/>
      </filter>
      </defs>
    </svg>
  )
}

const TransactionError = () => {
  return (
    <Page>
      <StyledTransactionError>
        <ErrorIcon />
        <Text fontSize="24px" color="#D32029" mt="24px" mb="24px">
          Transaction error
        </Text>
        <Text fontSize="14px" color="#A7C1CA" mb="30px">Submitting the transaction into network failed. Please try again.</Text>
        <Link href="/" passHref>
          <StyledButton>
            Try again
          </StyledButton>
        </Link>
      </StyledTransactionError>
    </Page>
  )
}

export default TransactionError
