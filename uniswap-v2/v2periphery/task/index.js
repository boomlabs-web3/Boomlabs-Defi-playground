const IUniswapV2RouterPair = require("../artifacts/contracts/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json");
const IERC20 = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const ethers = require("ethers");
const IUniswapV2Pair = require("../artifacts/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json");
const FactoryContract = require("../../v2core/artifacts/contracts/UniswapV2Factory.sol/TestUniswapV2Factory.json")
const BigNumber = require('bignumber.js');

const overrides = {
    gasLimit: 999999,
    maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
    maxFeePerGas: ethers.BigNumber.from(40000000000),
  }

task("balance")
    .setAction(async (taskArgs,hre) => {
    const address = "0xca823aB0f93Bb83431d5E83619A93f78C539f3EA";
    const balance = await hre.ethers.provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(balanceInEth);
    })

task("addliquidity")
    .addParam("token1")
    .addParam("amount1")
    .addParam("token2")
    .addParam("amount2")
    .setAction(async ({token1, amount1, token2, amount2},hre) => {
        const [deployer, ...others] = await hre.ethers.getSigners();    

        const Token1 = await hre.ethers.getContractAt(IERC20.abi, token1, deployer);  
        const Token2 = await hre.ethers.getContractAt(IERC20.abi, token2, deployer);  

        
        const routerAddress = "0x664b0296D9d640C8a7CC1A3AbfEa4904962a3904";
        const router = await hre.ethers.getContractAt(IUniswapV2RouterPair.abi, routerAddress, deployer);

        const token1Allowance = await Token1.allowance(deployer.address, routerAddress);
        if(!token1Allowance){
            const tx1 = await Token1.approve(router.address, ethers.constants.MaxUint256);
            await tx1.wait();
        }
        //token들 router에게 Approve

        const token2Allowance = await Token2.allowance(deployer.address, routerAddress);
        if(!token2Allowance){
            const tx2 = await Token2.approve(router.address, ethers.constants.MaxUint256);
            await tx2.wait();
        }
        //router add liquidity
        const addtx = await router.addLiquidity(
            token1,
            token2,
            (new BigNumber(Number(amount1))).multipliedBy(10**18).toString(), // 9000개 정도는 add 해야 함.
            (new BigNumber(Number(amount2))).multipliedBy(10**18).toString(),
            0,
            0,
            deployer.address,
            ethers.constants.MaxUint256,
            overrides
        );
        await addtx.wait();
        console.log("addLiquidity done");

        const factoryAddress = "0xC72C1FA89ff0F0a6F7f7cf1d228B3D0431F334A5";
        const factory = await hre.ethers.getContractAt(FactoryContract.abi, factoryAddress, deployer);        
        const pairAddress = await factory.getPair(token1, token2);
        console.log("Pair address : ", pairAddress);
        const pair = await hre.ethers.getContractAt(IUniswapV2Pair.abi, pairAddress, deployer);
        const pairBalance = await pair.balanceOf(deployer.address);
        console.log("My pair balance : ", pairBalance); 

    })