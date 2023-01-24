import * as dotenv from "dotenv"
import "@nomiclabs/hardhat-waffle";

import "./task";

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.5.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    mumbai: {
      url : process.env.MUMBAI_RPC,
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY || "", process.env.PRIVATE_KEY_SUB],
      // gasPrice: 35000000000,
    },
    hardhat: {
      chainId: 31337,
      // hardfork: "london",
      // mining: {
      //   auto: true,
      //   interval: 2000, // klaytn block interval is 1s
      //   mempool: {
      //     order: "fifo", // "fifo or priority", but mining mode is auto, so it's meaningless
      //   },
      // },
      accounts: [
        {
          privateKey:
            "0x6b21e67cd54778fe26823014e36a666f76401dca4e483acf2767842b36333d5a",
          balance: "1000000000000000000000000",
        },
        {
          privateKey:
            "0xad3c0326086dc1278a2fe01e64e1a80cbdeaf072598b1591590714a5c39b4408",
          balance: "1000000000000000000000000",
        },
        {
          privateKey:
            "0xbccf06223cd2cde0c6e5d293457aa23f31168ee0821467d2554bead946b6bc47",
          balance: "1000000000000000000000000",
        },
        {
          privateKey:
            "0xb71bebfda0904c67c5e5485b90975c0828da980abe735352ce98586e8c7aa470",
          balance: "1000000000000000000000000",
        },
      ],
      // minGasPrice: undefined, // no need at london hardfork
      // throwOnTransactionFailures: true,
      // throwOnCallFailures: true,
      // allowUnlimitedContractSize: false,
      // initialDate: new Date().toISOString(),
      // loggingEnabled: false,
      // // @ts-ignore
      // chains: undefined, // not necessary
    },
  },
};