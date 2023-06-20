import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'

export const InfoPageLayout = ({ children }) => {
  return (
    <>
      <ProtocolUpdater />
      <PoolUpdater />
      <TokenUpdater />
      {children}
    </>
  )
}
