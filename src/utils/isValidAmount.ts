import { Currency, ETHER } from '@pancakeswap/sdk'

export function isValidAmount(currency: Currency, amount: number): boolean {
  if (!process.env.NEXT_PUBLIC_MINIMUM_GLCH) return true
  if (currency !== ETHER) return true
  const minimumAmount = +process.env.NEXT_PUBLIC_MINIMUM_GLCH
  if (amount >= minimumAmount) return true
  return false
}

export default isValidAmount
