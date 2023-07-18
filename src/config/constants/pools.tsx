import { BigNumber } from '@ethersproject/bignumber'
import { SerializedPoolConfig } from './types'

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('20000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')


export const livePools: SerializedPoolConfig[] = []

export default [...livePools]
