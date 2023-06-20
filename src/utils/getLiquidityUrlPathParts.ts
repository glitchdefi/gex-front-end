// Constructing the two forward-slash-separated parts of the 'Add Liquidity' URL
// Each part of the url represents a different side of the LP pair.
import { bscTokens, glitchTokens } from 'config/constants/tokens'

const getLiquidityUrlPathParts = ({
  quoteTokenAddress,
  tokenAddress,
}: {
  quoteTokenAddress: string
  tokenAddress: string
}): string => {
  // const wBnbAddress = bscTokens.wbnb.address
  const wTusAddress = glitchTokens.wglch.address
  const firstPart = !quoteTokenAddress || quoteTokenAddress === wTusAddress ? 'GLCH' : quoteTokenAddress
  const secondPart = !tokenAddress || tokenAddress === wTusAddress ? 'GLCH' : tokenAddress
  return `${firstPart}/${secondPart}`
}

export default getLiquidityUrlPathParts
