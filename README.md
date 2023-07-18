# Glitch Dex

### Prerequisites
- nodejs: v16.15.0
- yarn: 1.22.19

For starters, we use `.env` files to configure lots of environment variables.
Check the `.env.sample` for a starter file. It's best you read the comments
in that file if you have questions or want to learn more what each does.


## Usage
### Installing packages
```sh
$ yarn
```
### Development
We start of in one terminal with the typescript watcher with:

```sh
$ yarn dev
```

- `yarn dev` will start the frontend app and read the `.env.development` config file.

- `yarn dev` will compile and correctly watch files. Use this when writing
code in `.ts` files.

### Production
Compile the frontend app folder typescript files. Same as the old build command
```sh
$ yarn build && yarn start
```

- `yarn start` will start the frontend app and read the `.env.production` config file (Please make sure update this file for mainnet settings).

## Settings
### Environment variables
- Blockchain

```
NEXT_PUBLIC_GLITCH_RPC=https://api.avax-test.network/ext/bc/C/rpc
NEXT_PUBLIC_GLITCH_CHAIN_ID=43113
NEXT_PUBLIC_GLITCH_CHAIN_NAME=Glitch Testnet
NEXT_PUBLIC_GLITCH_EXPLORER=https://testnet.snowtrace.io
```
- Application domain
```
NEXT_PUBLIC_GLITCH_DOMAIN_URL=https://gex-test.blockdevs.info
NEXT_PUBLIC_MINIMUM_GLCH=0.1
NEXT_PUBLIC_GLITCH_BRIDGE_URL=https://bridge.glitch.finance
```
- Smart contracts
```
NEXT_PUBLIC_GLITCH_MULTICALL_ADDRESS=0x75972fc78C283557759f93824705eb7Eee6C5bE9
NEXT_PUBLIC_GLITCH_NATIVE_TOKEN=0x17AD31C40fADE58ee8b5Ac404EeA4fE52d4B1d68

NEXT_PUBLIC_GLITCH_DEFAULT_OUTPUT_TOKEN=0xDf8479ABf17b60DCe07D88B43Fd9f246BEC927F2

NEXT_PUBLIC_GLITCH_FACTORY_ADDRESS=0x28f00D3DE32f0fC7c11E0373fb715748017c63Eb
NEXT_PUBLIC_GLITCH_INIT_CODE=0x8c29d3b312ea33a3a5a6ebe712a9519f6eb417189dc82d4aab66fb2e2ec9983d
NEXT_PUBLIC_GLITCH_ROUTER_ADDRESS=0x917Af3b907a3589B1FD24998774f43f517f00873
```

### Gas price
Change the default gas price in file `src/state/types.ts`. The config is in `gwei` unit.
```
export enum GAS_PRICE {
  average = '100',
  fast = '120'
}
```

### Tokens
Change the suggested and default token list in the file `/config/constant/tokenLists/glitch-default.tokenlist`.


Change feee
packages/swap-sdk/src/constants.ts
src/config/constants/exchange.ts
src/config/constants/info.ts



```
panicked at 'the global thread pool has not been initialized.: threadpool builderror { kind: ioerror(error { kind: unsupported, message: "operation not supported on this platform" }) }
```
It seems like an issue with the swcMinify option in the nextConfig, try setting it to false.
`next.config.js`
```const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
};```