import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTheme } from 'styled-components'
import { useTranslation } from '../../../contexts/Localization'
import config, { ConfigMenuItemsType } from '../config/config'

export const useMenuItems = (): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { isDark } = useTheme()

  const menuItems = useMemo(() => {
    return config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId])

  return useMemo(() => {
    return menuItems
  }, [menuItems])
}
