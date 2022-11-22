/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("dotenv").config();

 require('@nomiclabs/hardhat-waffle');
 // import "@nomiclabs/hardhat-waffle";
 // import "@nomiclabs/hardhat-ethers";
 
 module.exports = {
   solidity: {
     version: "0.6.6",
     settings: {
       optimizer: {
         enabled: true,
         runs: 1000,
       },
     },
   },
   networks: {
    hardhat: {
      chainId: 1337
    },
   }
 };