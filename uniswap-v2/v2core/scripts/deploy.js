const hre = require("hardhat");
const IUniswapV2Pair = require("../artifacts/contracts/interfaces/IUniswapV2Pair.sol/IUniswapV2Pair.json");
const ethers = hre.ethers;

async function main() {
  // - 팩토리 컨트랙트 배포
  // - erc20-erc20 페어 만들기
  // - 토큰 컨트랙트 2개 배포해보기
  // - 페어 컨트랙트 인스턴스 만들기
    const [deployer] = await ethers.getSigners();
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
    
    await factoryInstance.createPair(tokenA.address, tokenB.address)
    const pairAddress = await factoryInstance.getPair(tokenA.address, tokenB.address)
    console.log("Factory creates pair : ", pairAddress);
    //const pairInstance = new ethers.Contract(pairAddress, JSON.stringify(IUniswapV2Pair.abi), deployer).connect(deployer);
    // Contract 객체를 직접 만드는게 아니라 getContractsAt을 써도 될 것 같다.
    const pairInstance = await ethers.getContractAt(IUniswapV2Pair.abi, pairAddress, deployer);

    const token0Address = await pairInstance.token0()
    const token0 = tokenA.address === token0Address ? tokenA : tokenB
    const token1 = tokenA.address === token0Address ? tokenB : tokenA

    console.log("pair deploy: ", pairInstance.address);
    console.log("token0 Address:", token0Address);

    console.log("PAIR INIT CODE:", await factoryInstance.INIT_CODE_PAIR_HASH());
    console.log("bytecode :", await factoryInstance.BYTECODE());
  }
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});