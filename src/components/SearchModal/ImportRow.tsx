import { CSSProperties } from 'react'
import { Token } from '@pancakeswap/sdk'
import { Button, Text, CheckmarkCircleIcon, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { AutoRow, RowFixed } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { ListLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import styled from 'styled-components'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { useTranslation } from 'contexts/Localization'

const TokenSection = styled.div<{ dim?: boolean }>`
  min-height: 200px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 16px;

  opacity: ${({ dim }) => (dim ? '0.4' : '1')};

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 16px;
  }
`

const CheckIcon = styled(CheckmarkCircleIcon)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.colors.success};
`

const ButtomImport = styled(Button)`
  border-radius:0;
  background-color:transparent;
  border: 2px solid #00FFFF;
  color:#00FFFF;
  font-size:16px;
  height:44px;
  `

const NameOverflow = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // globals
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useMatchBreakpointsContext()

  const { t } = useTranslation()

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList()
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

  return (
    <TokenSection style={style}>
      <div  style={{ opacity : '1', display: 'flex', marginTop: '12px' }}>
        <CurrencyLogo currency={token} size={isMobile ? '20px' : '32px'} style={{ opacity: '1' , marginRight: '12px' }} />

        <AutoRow>
          <Text mr="8px" style={{color:'#E5ECEF',fontWeight:'600'}}>{token.symbol}</Text>
          <Text color="textDisabled">
            <NameOverflow title={token.name} />
          </Text>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <Text fontSize={isMobile ? '10px' : '14px'} mr="4px" color="#A7C1CA">
              {token.name}
            </Text>
            {/* <ListLogo logoURI={list.logoURI} size="12px" /> */}
          </RowFixed>
        )}
      </div>
      {!isActive && !isAdded ? (
        <ButtomImport
          scale={isMobile ? 'sm' : 'md'}
          width="fit-content"
          onClick={() => {
            if (setImportToken) {
              setImportToken(token)
            }
            showImportView()
          }}
        >
          {t('Import')}
        </ButtomImport>
      ) : (
        <RowFixed style={{ minWidth: 'fit-content' }}>
          <CheckIcon />
          <Text color="success">Active</Text>
        </RowFixed>
      )}
    </TokenSection>
  )
}
