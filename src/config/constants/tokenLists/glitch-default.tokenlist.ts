export const GLITCH_USDT = {
  "name": "USDT",
  "symbol": "USDT",
  "address": process.env.NEXT_PUBLIC_GLITCH_DEFAULT_OUTPUT_TOKEN,
  "chainId": +process.env.NEXT_PUBLIC_GLITCH_CHAIN_ID,
  "decimals": 18,
  "logoURI": `${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/tokens/0x55d398326f99059fF775485246999027B3197955.png`
};

export const GLITCH_ETH = {
  "name": "ETH Token",
  "symbol": "ETH",
  "address": "0x58273C6F655F2B99630ff72c6Ded68F644f5312E",
  "chainId": +process.env.NEXT_PUBLIC_GLITCH_CHAIN_ID,
  "decimals": 18,
  "logoURI": `${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png`
};

export const GLITCH_BTC = {
  "name": "BTC Token",
  "symbol": "BTC",
  "address": "0xc11802eb364277aFb23f25Acec5267f8F9e2e948",
  "chainId": +process.env.NEXT_PUBLIC_GLITCH_CHAIN_ID,
  "decimals": 18,
  "logoURI": `${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/tokens/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png`
};

export const GLITCH_BNB = {
  "name": "BNB Token",
  "symbol": "BNB",
  "address": "0xa2192482C075E79Ec1997b0CF8C1526D5A8453f2",
  "chainId": +process.env.NEXT_PUBLIC_GLITCH_CHAIN_ID,
  "decimals": 18,
  "logoURI": `${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png`
};

export const SUGGESTED_COMMON_TOKENS = [
  GLITCH_USDT,
  GLITCH_ETH,
  GLITCH_BTC,
];

export default {
  "name": "Glitch Default List",
  "timestamp": "2024-05-24T11:45:09Z",
  "version": {
    "major": 4,
    "minor": 0,
    "patch": 0
  },
  "tags": {},
  "logoURI": `${process.env.NEXT_PUBLIC_GLITCH_DOMAIN_URL}/images/gex-icon.svg`,
  "keywords": ["glitch", "default"],
  "tokens": [
    GLITCH_USDT,
    GLITCH_ETH,
    GLITCH_BTC,
    GLITCH_BNB,
  ]
}
