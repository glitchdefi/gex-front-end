import { Skeleton, UserMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface ProfileUserMenuItemProps {
  isLoading: boolean
  hasProfile: boolean
  disabled: boolean
}

const ProfileUserMenuItem: React.FC<ProfileUserMenuItemProps> = ({ isLoading, disabled }) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <UserMenuItem>
        <Skeleton height="24px" width="35%" />
      </UserMenuItem>
    )
  }

  return (
    <UserMenuItem as="button" disabled={disabled}>
      {t('Your Profile')}
    </UserMenuItem>
  )
}

export default ProfileUserMenuItem
