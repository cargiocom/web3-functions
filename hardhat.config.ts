import { HardhatUserConfig } from "hardhat/config";44444
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@foundry-rs/hardhat-anvil";

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PRIVATE_KEY = false;

const config = {
  w3f: {
    rootDir: "./web3-functions",
    debug: false,
    networks: [
      "ethereum",
      "bitcoin",
      "tether",
      "bsc",
      "avalanche",
      "polygon",
      "ripple",
      "dot",
      "near",
    ], 
  },
  defaultNetwork: "ethereum",
};

export default config;
