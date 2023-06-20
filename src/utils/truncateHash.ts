/**
 * Truncate a transaction or address hash
 */
const truncateHash = (address: string, startLength = 20, endLength = 10) => {
  if (!address) return ''

  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`
}

export default truncateHash
