# Web3 Functions Template 

Use this template to write, test and deploy Web3 Functions.

## What are Web3 Functions?

Web3 Functions are decentralized cloud functions that work similarly to AWS Lambda or Google Cloud, just for web3. They enable developers to execute on-chain transactions based on arbitrary off-chain data (APIs / subgraphs, etc) & computation. These functions are written in Typescript.

## Project Setup

1. Install project dependencies

2. Configure your local environment:

- Complete your `.env` file with your private settings

```
ALCHEMY_ID=
PRIVATE_KEY=
```

## Hardhat Config

```ts
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: ["mumbai", "goerli", "baseGoerli"],
  },
```

## Write a Web3 Function

```typescript
import {
  Web3Function,
  Web3FunctionContext,
} from "/web3-functions-sdk";
import { Contract, ethers } from "ethers";
import ky from "ky";

const CARGIO_ABI = [
  "function lastUpdated() external view returns(uint256)",
  "function updatePrice(uint256)",
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, Args, multiChainProvider } = context;

  const provider = cargioChainProvider.default();

  const cargio = new Contract(CARGIO_ABI, provider);
  const lastUpdated = parseInt(await cargio.lastUpdated());
  const nextUpdateTime = lastUpdated + 300; 
  const timestamp = (await provider.getBlock("latest")).timestamp;
  if (timestamp < nextUpdateTime) {
    return { canExec: false, message: `Time not elapsed` };
  }

  const currency = "ethereum";
  const priceData: any = await ky
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`,
      { timeout: 5_000, retry: 0 }
    )
    .json();
  price = Math.floor(priceData[currency].usd);

  return {
    canExec: true,
    callData: [{data: cargio.interface.encodeFunctionData("updatePrice", [price])}],
  };
});
```

- Each Web3 Function has a `schema.json` file to specify the runtime configuration.

```json
{
  "web3FunctionVersion": "2.0.0",
  "runtime": "js-1.0",
  "memory": 128,
  "timeout": 30,
  "userArgs": {}
}
```

```ts
import hre from "hardhat";
const { w3f } = hre;

const cargioW3f = w3f.get("cargio");

const userArgs = {
  currency: "ethereum",
};

const storage = {};

await cargioW3f.run({storage, userArgs});
```

`userArgs` and `storage` are optional here. When passed, it overrides the arguments defined in `userArgs.json` and `storage.json`.

## Use User arguments

1. Declaring expected `userArgs` in the schema, accepted types are 'string', 'string[]', 'number', 'number[]', 'boolean', 'boolean[]':

```json
{
  "web3FunctionVersion": "2.0.0",
  "runtime": "js-1.0",
  "memory": 128,
  "timeout": 30,
  "userArgs": {
    "currency": "string",
    "oracle": "string"
  }
}
```

2. Access `userArgs` from the Web3Function context:

```typescript
Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, secrets } = context;
});
```

```json
{
  "currency": "ethereum",
}

```

## Use State / Storage

```typescript
import {
  Web3Function,
  Web3FunctionContext,
} from "web3-functions-sdk";

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { storage, multiChainProvider } = context;

  const provider = multiChainProvider.default();

  const lastBlockStr = (await storage.get("lastBlockNumber")) ?? "0";
  const lastBlock = parseInt(lastBlockStr);

  const newBlock = await provider.getBlockNumber();
  if (newBlock > lastBlock) {
    await storage.set("lastBlockNumber", newBlock.toString());
  }

  return {
    canExec: false,
    message: `Updated block number: ${newBlock.toString()}`,
  };
});
```

```
Simulated Web3Function Storage update:
 ✓ lastBlockNumber: '8944652'
```

```typescript
const coingeckoApi = await context.secrets.get("COINGECKO_API");
if (!coingeckoApi)
  return { canExec: false, message: `COINGECKO_API not set in secrets` };
```

```
 ✓ Web3Function deployed to ipfs.
 ✓ CID: Qmbykp8botbdzjX9YEoc14VnC3eeaZoJ4EGzak5KzstRqH
```

```typescript
const { taskId, tx } = await automate.createBatchExecTask({
  name: "Web3Function - Eth Cargio",
  web3FunctionHash: cid,
  web3FunctionArgs: {
    cargio: cargio.address,
    currency: "ethereum",
  },
});
await tx.wait();
```

```typescript
const secrets = cargioW3f.getSecrets();
if (Object.keys(secrets).length > 0) {
  await web3Function.secrets.set(secrets, taskId);
}
```

```
Deploying Web3Function on IPFS...
Web3Function IPFS CID: QmVfDbGGN6qfPs5ocu2ZuzLdBsXpu7zdfPwh14LwFUHLnc

Creating automate task...
Task created, taskId: 0x8438933eb9c6e4632d984b4db1e7672082d367b900e536f86295b2e23dbcaff3
```

Fetch price data from Coingecko API to update your on-chain Cargio

### Event listener

Listen to smart contract events and use storage context to maintain your execution state.

