/* eslint-disable no-restricted-syntax */
import { KeyboardEvent, RefObject, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { Currency, ETHER, Token } from '@pancakeswap/sdk'
import { Flex,Text, Input, Box, Button, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { FixedSizeList } from 'react-window'
import { useAudioModeManager } from 'state/user/hooks'
import useDebounce from 'hooks/useDebounce'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAllLists, useInactiveListUrls } from 'state/lists/hooks'
import { TagInfo, WrappedTokenInfo } from 'state/types'
import { useAllTokens, useToken, useIsUserAddedToken } from '../../hooks/Tokens'
import { isAddress } from '../../utils'
import Column, { AutoColumn } from '../Layout/Column'
import Row from '../Layout/Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { useSortedTokensByQuery, createFilterToken } from './filtering'
import useTokenComparator from './sorting'

import ImportRow from './ImportRow'

interface CurrencySearchProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}

function useSearchInactiveTokenLists(search: string | undefined, minResults = 10): WrappedTokenInfo[] {
  const lists = useAllLists()
  const inactiveUrls = useInactiveListUrls()
  const { chainId } = useActiveWeb3React()
  const activeTokens = useAllTokens()
  return useMemo(() => {
    if (!search || search.trim().length === 0) return []
    const filterToken = createFilterToken(search)
    const exactMatches: WrappedTokenInfo[] = []
    const rest: WrappedTokenInfo[] = []
    const addressSet: { [address: string]: true } = {}
    const trimmedSearchQuery = search.toLowerCase().trim()
    for (const url of inactiveUrls) {
      const list = lists[url].current
      // eslint-disable-next-line no-continue
      if (!list) continue
      for (const tokenInfo of list.tokens) {
        if (
          tokenInfo.chainId === chainId &&
          !(tokenInfo.address in activeTokens) &&
          !addressSet[tokenInfo.address] &&
          filterToken(tokenInfo)
        ) {
          const tags: TagInfo[] =
            tokenInfo.tags
              ?.map((tagId) => {
                if (!list.tags?.[tagId]) return undefined
                return { ...list.tags[tagId], id: tagId }
              })
              ?.filter((x): x is TagInfo => Boolean(x)) ?? []
          const wrapped: WrappedTokenInfo = new WrappedTokenInfo(tokenInfo, tags)
          addressSet[wrapped.address] = true
          if (
            tokenInfo.name?.toLowerCase() === trimmedSearchQuery ||
            tokenInfo.symbol?.toLowerCase() === trimmedSearchQuery
          ) {
            exactMatches.push(wrapped)
          } else {
            rest.push(wrapped)
          }
        }
      }
    }
    return [...exactMatches, ...rest].slice(0, minResults)
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search])
}

function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showImportView,
  setImportToken,
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()


  // if they input an address, use it
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const [audioPlay] = useAudioModeManager()

  const showBNB: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'g' || s === 'gl' || s === 'glc' || s === 'glch'
  }, [debouncedQuery])

  const filteredTokens: Token[] = useMemo(() => {
    const filterToken = createFilterToken(debouncedQuery)
    return Object.values(allTokens).filter(filterToken)
  }, [allTokens, debouncedQuery])

  const filteredQueryTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredSortedTokens: Token[] = useMemo(() => {
    return [...filteredQueryTokens].sort(tokenComparator)
  }, [filteredQueryTokens, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
    },
    [onCurrencySelect],
  )

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'glch') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery],
  )

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(debouncedQuery)

  const hasFilteredInactiveTokens = Boolean(filteredInactiveTokens?.length)
  const { isMobile } = useMatchBreakpointsContext()
  const getCurrencyListRows = useCallback(() => {
    if (searchToken && !searchTokenIsAdded && !hasFilteredInactiveTokens) {
      return (
        <Column style={{ padding: '20px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      )
    }

    return Boolean(filteredSortedTokens?.length) || hasFilteredInactiveTokens ? (
      <Box margin="24px -24px">
        <Row ml={20} mb={16} style={{ color: '#A7C1CA' }}>Token list</Row>
        <CurrencyList
          height={isMobile ? (showCommonBases ? 250 : 350) : 390}
          showBNB={showBNB}
          currencies={filteredSortedTokens}
          inactiveCurrencies={filteredInactiveTokens}
          breakIndex={
            Boolean(filteredInactiveTokens?.length) && filteredSortedTokens ? filteredSortedTokens.length : undefined
          }
          onCurrencySelect={handleCurrencySelect}
          otherCurrency={otherSelectedCurrency}
          selectedCurrency={selectedCurrency}
          fixedListRef={fixedList}
          showImportView={showImportView}
          setImportToken={setImportToken}
        />
      </Box>
    ) : (
        <Column style={{
          padding: '20px',
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}> 
          <img src="images/not-found-icon.svg" alt="" width="84px" style={{
            marginTop: '-40px',
          }} />
          <Text color="#4F7785" textAlign="center" mt="32px">
            {t('No tokens found')}
          </Text>
        </Column>
      )
  }, [
    filteredInactiveTokens,
    filteredSortedTokens,
    handleCurrencySelect,
    hasFilteredInactiveTokens,
    otherSelectedCurrency,
    searchToken,
    searchTokenIsAdded,
    selectedCurrency,
    setImportToken,
    showBNB,
    showImportView,
    t,
    showCommonBases,
    isMobile,
  ])

  return (
    <>
      <AutoColumn gap="16px">
        <Row>
          <Input
            id="token-search-input"
            placeholder={t('Search name or paste address here')}
            scale="lg"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
          <Button style={{ height: 48, borderRadius: 0 }}>
            <Flex style={{position :'absolute',width:20,height:20}}>
            <svg  viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.2125 12.3516L9.15469 8.29375C9.78438 7.47969 10.125 6.48438 10.125 5.4375C10.125 4.18438 9.63594 3.00937 8.75156 2.12344C7.86719 1.2375 6.68906 0.75 5.4375 0.75C4.18594 0.75 3.00781 1.23906 2.12344 2.12344C1.2375 3.00781 0.75 4.18438 0.75 5.4375C0.75 6.68906 1.23906 7.86719 2.12344 8.75156C3.00781 9.6375 4.18438 10.125 5.4375 10.125C6.48438 10.125 7.47813 9.78438 8.29219 9.15625L12.35 13.2125C12.3619 13.2244 12.376 13.2338 12.3916 13.2403C12.4071 13.2467 12.4238 13.2501 12.4406 13.2501C12.4575 13.2501 12.4741 13.2467 12.4897 13.2403C12.5052 13.2338 12.5194 13.2244 12.5312 13.2125L13.2125 12.5328C13.2244 12.5209 13.2338 12.5068 13.2403 12.4912C13.2467 12.4757 13.2501 12.459 13.2501 12.4422C13.2501 12.4254 13.2467 12.4087 13.2403 12.3931C13.2338 12.3776 13.2244 12.3635 13.2125 12.3516ZM7.9125 7.9125C7.25 8.57344 6.37187 8.9375 5.4375 8.9375C4.50312 8.9375 3.625 8.57344 2.9625 7.9125C2.30156 7.25 1.9375 6.37187 1.9375 5.4375C1.9375 4.50312 2.30156 3.62344 2.9625 2.9625C3.625 2.30156 4.50312 1.9375 5.4375 1.9375C6.37187 1.9375 7.25156 2.3 7.9125 2.9625C8.57344 3.625 8.9375 4.50312 8.9375 5.4375C8.9375 6.37187 8.57344 7.25156 7.9125 7.9125Z" fill="#151F23" />
            </svg>
            </Flex>
          </Button>
        </Row>
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
      </AutoColumn>
      {getCurrencyListRows()}
    </>
  )
}

export default CurrencySearch
