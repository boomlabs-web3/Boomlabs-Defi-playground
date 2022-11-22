/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config();

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: {
    version: "0.5.16",
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
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  }
};
