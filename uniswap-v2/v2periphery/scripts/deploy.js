const hre = require("hardhat");
const IERC20 = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const constants = require("ethers/constants");
const IUniswapV2Pair = require("../artifacts/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json");
const FactoryContract = require("../../v2core/artifacts/contracts/UniswapV2Factory.sol/TestUniswapV2Factory.json")
const ethers = hre.ethers;

async function main() {

    const overrides = {
        gasLimit: 999999,
        maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
        maxFeePerGas: ethers.BigNumber.from(40000000000),
      }
      const factoryAddress = "0xC72C1FA89ff0F0a6F7f7cf1d228B3D0431F334A5";
      const daiAddress = "0x61f10d000E38A64996677D14C70D33f6D6cA6C4b";
      const usdcAddress = "0x287c0397B93966fbBb18eCE981A98dCD17b5CB7C";
      const pairAddress = "0xE4C8110bbeEBA9C6E4349cb2443eE28aE0b6FE90";

      const [deployer, ...others] = await ethers.getSigners();    
      console.log("deployer address : ", deployer.address);
      
     
      const factory = await ethers.getContractAt(FactoryContract.abi, factoryAddress, deployer);        
      console.log("PAIR INIT CODE:", await factory.INIT_CODE_PAIR_HASH());

      const DAI = await ethers.getContractAt(IERC20.abi, daiAddress, deployer);  
      const USDC = await ethers.getContractAt(IERC20.abi, usdcAddress, deployer);
      const WETH = await ethers.getContractFactory("WETH11", deployer);
      
      const weth = await WETH.deploy();
      console.log("Deploying WETH");
      await weth.deployed();
      const name = await weth.name();
      console.log(`WETH address : ${weth.address}, name: ${name}`);
      
      const Router = await ethers.getContractFactory("UniswapV2Router02", deployer);
      // router2 Contract(팩토리 주소, WETH 주소 필요)
      const router = await Router.deploy(factoryAddress ,weth.address);
      console.log("Deploying Uniswap Router02 contract");
      await router.deployed();
      console.log(`Router deployed to : ${router.address}`);

      // DAI, USDC router에게 Approve
      const Daitx = await DAI.approve(router.address, constants.MaxUint256);
      await Daitx.wait();
      console.log("DAI Approve");
      const Usdctx = await USDC.approve(router.address, constants.MaxUint256);
      await Usdctx.wait();
      console.log("USDC Approve");
 
      const pair = await ethers.getContractAt(IUniswapV2Pair.abi, pairAddress, deployer);
      const pairapprovetx = await pair.approve(router.address, constants.MaxUint256);
      await pairapprovetx.wait();
      console.log("pair contract approve to Router2");

      // DAI가 token0 address, 이미 deployer는 DAI, USDC를 10000개씩 소유
      const addtx = await router.addLiquidity(
          daiAddress,
          usdcAddress,
          ethers.BigNumber.from("9000"), // 9000개 정도는 add 해야 함.
          ethers.BigNumber.from("9000"),
          0,
          0,
          deployer.address,
          constants.MaxUint256,
          overrides
      );
      await addtx.wait();
      console.log("addLiquidity done");

      // pair balance 확인해서 liquidity 있는지 체크
      const pairBalance = await pair.balanceOf(deployer.address);
      console.log("My pair balance : ", pairBalance); 
  }
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});