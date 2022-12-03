const hre = require("hardhat");
const IUniswapV2Pair = require("../artifacts/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json");
const ethers = hre.ethers;

/* UniswapFactory, Pair 배포 */
async function main() {
    const [deployer, ...others] = await ethers.getSigners();
    console.log("deployer address:", deployer.address);
    const Factory = await ethers.getContractFactory("TestUniswapV2Factory");
    const factoryInstance = await Factory.deploy(deployer.address);
    console.log("Deploying Uniswap Factory contract");
    await factoryInstance.deployed();
    console.log(`Factory deployed to : ${factoryInstance.address}`);

    const TokenA = await ethers.getContractFactory("ERC20Test");
    const tokenA = await TokenA.deploy('10000000000000000000000');
    console.log("Deploying Token 0");
    await tokenA.deployed();
    const name = await tokenA.name();
    console.log(`Token 0 address : ${tokenA.address}, name: ${name}`);
    
    const TokenB = await ethers.getContractFactory("ERC20Test2");
    const tokenB = await TokenB.deploy('10000000000000000000000');
    console.log("Deploying Token1");
    await tokenB.deployed();
    const name2 = await tokenB.name();
    console.log(`Token 1 address : ${tokenB.address}, name: ${name2}`);
    
    const tx = await factoryInstance.createPair(tokenA.address, tokenB.address)
    await tx.wait();
    const pairAddress = await factoryInstance.getPair(tokenA.address, tokenB.address)
    console.log("Factory creates pair : ", pairAddress);
    const pairInstance = await ethers.getContractAt(IUniswapV2Pair.abi, pairAddress, deployer);
    console.log("pair deploy: ", pairInstance.address);

    const token0Address = await pairInstance.token0()
    const token0 = tokenA.address === token0Address ? tokenA : tokenB
    const token1 = tokenA.address === token0Address ? tokenB : tokenA

    console.log("token0 Address:", token0.address);
    console.log("token1 Address:", token1.address);

    console.log("PAIR INIT CODE:", await factoryInstance.INIT_CODE_PAIR_HASH());
  }
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});