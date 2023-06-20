import { useState } from 'react'
import { Token, Currency } from '@pancakeswap/sdk'
import styled from 'styled-components'
import { Button, Text, ErrorIcon, Flex, Message, Checkbox, Link, Tag, Grid } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Layout/Column'
import { useAddUserToken } from 'state/user/hooks'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'

const StyledButton = styled(Button)`
 border-radius:0px;
 color:${({ theme }) => theme.colors.textBlack };
 background-color:${({ theme }) => theme.colors.backgroundWhite };
 box-shadow:-4px 5px 0px 0px ${({ theme }) => theme.colors.primary },4px -2px 0px 0px #F100F5;
 width: 100%;
 margin-bottom: 26px;
 `
interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(true)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  return (
    <AutoColumn gap="lg">
       {tokens.map((token) => {
        const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
        const address = token.address ||null;
        
        return (
          <Flex key={token.address} style={{
            gridTemplateRows: "1fr 1fr 1fr",
            gridGap: "12px",
          }}>
            <ListLogo style={{borderRadius:50,alignSelf:'baseline', marginRight: '8px'}} logoURI={token?.tokenInfo?.logoURI} size="50px" />
            <div style={{paddingLeft:5,width:'100%'}}>
              <Text mr="8px" style={{color:'#E5ECEF',fontSize:16,fontWeight:'600'}}>{token.symbol}</Text>
              <Text mr="4px" fontSize="12px" color="#A7C1CA">{token.name}</Text>
              <Flex style={{ backgroundColor: '#23353B', height: 2, width: '100%', margin: '10px 0px' }} />
              {/* <Text mr="4px">{truncateHash(address)}</Text> */}
              <Text fontSize="14px" mr="4px">{address}</Text>
              {/* {list !== undefined ? (
              null
            ) : (
              <Tag style={{marginTop:5}} variant="failure" outline scale="sm" >
                {t('Unknown Source')}
              </Tag>
            )} */}
              {/* <Text mr="8px">{token.name}</Text> */}
              {/* <Text>({token.symbol})</Text> */}
            </div>
            {/* {chainId && (
              <Flex justifyContent="space-between" width="100%">
                <Text mr="4px">{address}</Text>
              </Flex>
            )} */}
          </Flex>
        )
      })}
      <Message variant="warning">
        <div>
        <Text style={{fontSize:16,color:'#D87A16',fontWeight:'600'}} mb="12px">
          {t(
            'Trade at your own risk!',
          )}
        </Text>
        <Text style={{fontSize:12,fontWeight:'400'}}>
          {t(
            'Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects.',
          )}
          <br />
          <br />
          {t('Make sure this is the token that you want to trade.')}
        </Text>
        </div>
      </Message>

     

      <Flex justifyContent="space-between" alignItems="center" mt="20px">
        {/* <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </Flex> */}
        <StyledButton
          variant="danger"
          disabled={!confirmed}
          onClick={() => {
            tokens.forEach((token) => addToken(token))
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className=".token-dismiss-button"
        >
          {t('Import')}
        </StyledButton>
      </Flex>
    </AutoColumn>
  )
}

export default ImportToken
