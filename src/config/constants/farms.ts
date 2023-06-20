import { serializeTokens } from 'utils/serializeTokens'
import { bscTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens(bscTokens)

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    v1pid: 0,
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      56: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      43113: '',
    },
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    v1pid: 251,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: CAKE_BNB_LP_MAINNET,
      43113: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 3,
    v1pid: 252,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
      43113: '',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
  //    * V3 by order of release (some may be out of PID order due to multiplier boost)
  {
    pid: 73,
    v1pid: 491,
    lpSymbol: 'HIGH-BUSD LP',
    lpAddresses: {
      56: '0xe98ac95A1dB2fCaaa9c7D4ba7ecfCE4877ca2bEa',
      97: '',
      43113: '',
    },
    token: serializedTokens.high,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 38,
    v1pid: 386,
    lpSymbol: 'HOTCROSS-BNB LP',
    lpAddresses: {
      56: '0xf23bad605e94de0e3b60c9718a43a94a5af43915',
      43113: '',
      97: '',
    },
    token: serializedTokens.hotcross,
    quoteToken: serializedTokens.wbnb,
    auctionHostingStartSeconds: 1658476800,
  },
  {
    pid: 109,
    lpSymbol: 'XCAD-BUSD LP',
    lpAddresses: {
      56: '0x07C10ecFb0e1CF81E3e05ddb693Cc114C8EBe498',
      97: '',
      43113: '',
    },
    token: serializedTokens.xcad,
    quoteToken: serializedTokens.busd,
    auctionHostingStartSeconds: 1658476800,
  },
  {
    pid: 110,
    lpSymbol: 'SHELL-BUSD LP',
    lpAddresses: {
      56: '0x02D75D7beebF6D5228A3Fa5f810CedF2BEa5aB1E',
      97: '',
      43113: '',
    },
    token: serializedTokens.shell,
    quoteToken: serializedTokens.busd,
    auctionHostingStartSeconds: 1658476800,
  },
  {
    pid: 108,
    lpSymbol: 'OLE-BUSD LP',
    lpAddresses: {
      56: '0xe9F369298565B60a0DC19A6fA93cEE934Fd1A58c',
      97: '',
      43113: '',
    },
    token: serializedTokens.ole,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 107,
    lpSymbol: 'TRIVIA-BNB LP',
    lpAddresses: {
      56: '0xEF642c40EebBc964881dD7Bd1A0b50e90441E73A',
      97: '',
      43113: '',
    },
    token: serializedTokens.trivia,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 94,
    v1pid: 525,
    lpSymbol: 'WZRD-BUSD LP',
    lpAddresses: {
      56: '0xee456d906a38e10680c9d157FFf143390e9681bA',
      97: '',
      43113: '',
    },
    token: serializedTokens.wzrd,
    quoteToken: serializedTokens.busd,
    isCommunity: true,
  },
  {
    pid: 106,
    lpSymbol: 'MHUNT-BNB LP',
    lpAddresses: {
      56: '0x58aED290F42963A502626774Bd8fa03f33c9B71f',
      97: '',
      43113: '',
    },
    token: serializedTokens.mhunt,
    quoteToken: serializedTokens.wbnb,
    isCommunity: true,
  },
  {
    pid: 105,
    lpSymbol: 'SDAO-BUSD LP',
    lpAddresses: {
      56: '0x3d12E4381901a6b94438758B90881cB03F10b01E',
      97: '',
      43113: '',
    },
    token: serializedTokens.sdao,
    quoteToken: serializedTokens.busd,
  }
]

export default farms
