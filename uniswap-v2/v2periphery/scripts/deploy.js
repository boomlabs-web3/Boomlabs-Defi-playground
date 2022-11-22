const hre = require("hardhat");
const IERC20 = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const constants = require("ethers/constants");
const utils = require('ethers/utils');
const IUniswapV2Pair = require("../artifacts/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json");
const UniswapV2Pair = require("../../v2-core/artifacts/contracts/UniswapV2Pair.sol/TestUniswapV2Pair.json");

const ethers = hre.ethers;

async function main() {

    const overrides = {
        gasLimit: 9999999
      }
    // - weth11 컨트랙트 배포
    // - router2 컨트랙트 배포(팩토리 주소, WETH 주소 필요)
    const factoryAddress = "0xab16A69A5a8c12C732e0DEFF4BE56A70bb64c926";
    const daiAddress = "0xE3011A37A904aB90C8881a99BD1F6E21401f1522";
    const usdcAddress = "0x1f10F3Ba7ACB61b2F50B9d6DdCf91a6f787C0E82";
    const pairAddress = "0xEa94A92C2CB8330F92Ee5d0Ba1DD93E791D47852";

    const [deployer] = await ethers.getSigners();
    const WETH = await ethers.getContractFactory("WETH11", deployer);
    const weth = await WETH.deploy();
    console.log("Deploying WETH");
    await weth.deployed();
    const name = await weth.name();
    console.log(`WETH address : ${weth.address}, name: ${name}`);

    const Router = await ethers.getContractFactory("UniswapV2Router02", deployer);
    const router = await Router.deploy(factoryAddress ,weth.address);
    console.log("Deploying Uniswap Router02 contract");
    await router.deployed();
    console.log(`Router deployed to : ${router.address}`);

    // DAI, USDC router에게 Approve 하고 deployer에게 100,100개씩 transfer
    // 100,100개 씩 add liquidity호출
    const DAI = await ethers.getContractAt(IERC20.abi, daiAddress, deployer);
    // console.log("DAI object: ", DAI);
    await DAI.approve(router.address, constants.MaxUint256);
    console.log("DAI Approve");
    const USDC = await ethers.getContractAt(IERC20.abi, usdcAddress, deployer);
    await USDC.approve(router.address, constants.MaxUint256);
    console.log("USDC Approve");
    await DAI.transfer(deployer.address, utils.bigNumberify(10000));
    const DAIBalance = await DAI.balanceOf(deployer.address);
    console.log("My DAI balance :", DAIBalance / (10**18));

    await USDC.transfer(deployer.address, utils.bigNumberify(10000));
    const USDCBalance = await USDC.balanceOf(deployer.address);
    console.log("My USDC balance :", USDCBalance / (10**18));
    // 솔리디티의 keccak256(abi.encodePacked(type(TestUniswapV2Pair).creationCode)); 와 값이 똑같음.
    const init_code = utils.keccak256(utils.toUtf8Bytes(`${UniswapV2Pair.bytecode}`));
    console.log("init code :", init_code);

    const pair = await ethers.getContractAt(IUniswapV2Pair.abi, pairAddress, deployer);
    await pair.approve(router.address, constants.MaxUint256);

    // DAI가 token0 address
    await router.addLiquidity(
        DAI.address,
        USDC.address,
        utils.bigNumberify(9000), // 100 정도로 잡으면 안되고 몇천 정도는 잡아야 함.
        utils.bigNumberify(9000),
        0,
        0,
        deployer.address,
        constants.MaxUint256,
        overrides
    );

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