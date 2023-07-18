import { ChainId, Currency, currencyEquals, ETHER, Token } from '@pancakeswap/sdk'
import { Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

import { AutoColumn } from '../Layout/Column'
import { AutoRow } from '../Layout/Row'
import { CurrencyLogo } from '../Logo'
import { SUGGESTED_COMMON_TOKENS } from '../../config/constants/tokenLists/glitch-default.tokenlist'

const ButtonWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
  border: 1px solid var(--gray-gray-3, #23353B);
`

const BaseWrapper = styled.div<{ disable?: boolean }>`
  display: flex;
  padding: 8px 12px;
  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background: rgba(255, 255, 255, 0.03);
  }
  opacity: ${({ disable }) => disable && '0.4'};
`

const RowWrapper = styled.div`
  white-space: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`

export default function CommonBases({
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId
  selectedCurrency?: any | null
  onSelect: (currency: Currency) => void
}) {
  const { t } = useTranslation()

  if (!SUGGESTED_COMMON_TOKENS.length) {
    return <></>
  }

  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px">These tokens are commonly paired with other tokens</Text>
      </AutoRow>
      <RowWrapper>
        <ButtonWrapper>
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
                onSelect(ETHER)
              }
            }}
            disable={selectedCurrency === ETHER}
          >
            <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
            <Text>GLCH</Text>
          </BaseWrapper>
        </ButtonWrapper>
        {SUGGESTED_COMMON_TOKENS.map((item) => {
          const token = new Token(
            item.chainId,
            item.address,
            item.decimals,
            item.symbol,
            item.name,
            'https://glitch.finance',
          )
          
          const selected = selectedCurrency && selectedCurrency.address === token.address
          return (
            <ButtonWrapper>
              <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
                <CurrencyLogo currency={token} logoURI={item.logoURI} style={{ marginRight: 8, borderRadius: '50%' }} />
                <Text>{token.symbol}</Text>
              </BaseWrapper>
            </ButtonWrapper>
          )
        })}
      </RowWrapper>
    </AutoColumn>
  )
}
