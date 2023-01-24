const hre = require("hardhat");
// const constants = require("ethers/constants");
const IFactory = require("../artifacts/contracts/BFactory.sol/BFactory.json");
const POOLAPI = require("../artifacts/contracts/BPool.sol/BPool.json");
const ethers = hre.ethers;

const factory = "0x57e8530df43b22eef70cf7291a8f1727dbbc7177";
const WETH = "0x24db8ff6671f8831331f8af937ce28c96c9ac9bb";
const DAI = "0xfeb455306038cffb5dbf85b5b6c72e51d61e6a9e";

async function main() {
    const [deployer, guest, ...others] = await ethers.getSigners();
    console.log("deployer address:", deployer.address);
    const factoryInstance = await ethers.getContractAt("BFactory", factory);
    
    /* 배포할때는 아래 코드 사용
        const Factory = await ethers.getContractFactory("BFactory");
        const factoryInstance = await Factory.deploy();
        console.log("Deploying Balancer Factory contract");
        await factoryInstance.deployed();
     */
    console.log(`Factory deployed to : ${factoryInstance.address}`);

    /* 배포할때는 아래 코드 사용
        const TestToken = await ethers.getContractFactory("TToken");
        const weth = await TestToken.deploy('Wrapped Ether', 'WETH', 18);
        const dai = await TestToken.deploy('Dai Stablecoin', 'DAI', 18);
        console.log("Deploying Token 0 weth");
        await weth.deployed();
     */
    const weth = await ethers.getContractAt("TToken", WETH);

    const name = await weth.name();
    console.log(`Token 0 address : ${weth.address}, name: ${name}`);
    
    // console.log("Deploying Token1 dai");
    const dai = await ethers.getContractAt("TToken", DAI);
    // await dai.deployed();
    const name2 = await dai.name();
    console.log(`Token 1 address : ${dai.address}, name: ${name2}`);
    
    const admin = deployer;
    const mintTx1 = await weth.mint(admin.address, ethers.utils.parseUnits('5'));
    await mintTx1.wait();
    const mintTx2 = await dai.mint(admin.address, ethers.utils.parseUnits('200'));
    await mintTx2.wait();

    const mintTx3 = await weth.mint(guest.address, ethers.utils.parseUnits('2'));
    await mintTx3.wait();
    const mintTx4 = await dai.mint(guest.address, ethers.utils.parseUnits('50'));
    await mintTx4.wait();
    let POOL;
    let pool;
    const newBpoolTx = await factoryInstance.newBPool();
    const receipt = await newBpoolTx.wait();
    console.log("pool address : ",receipt.events[0].args.pool);
    POOL = receipt.events[0].args.pool;
    pool = await ethers.getContractAt(POOLAPI.abi, POOL, deployer);   

    const apprTx1 = await weth.approve(POOL, ethers.constants.MaxUint256)
    await apprTx1.wait();

    const apprTx2 = await dai.approve(POOL, ethers.constants.MaxUint256)
    await apprTx2.wait();

    const apprTx3 = await weth.connect(guest).approve(POOL, ethers.constants.MaxUint256)
    await apprTx3.wait();

    const apprTx4 = await dai.connect(guest).approve(POOL, ethers.constants.MaxUint256)
    await apprTx4.wait();

    const isBPool = await factoryInstance.isBPool(POOL)
    console.log("isBPool of BFactory : ", isBPool);

    // bind fees
    const bind1 = await pool.bind(weth.address, ethers.utils.parseUnits('5'), ethers.utils.parseUnits('5'));
    await bind1.wait();
    const bind2 = await pool.bind(dai.address, ethers.utils.parseUnits('200'), ethers.utils.parseUnits('5'));
    await bind2.wait();
    console.log("Bpool bind complete");
    const finalize = await pool.finalize();
    await finalize.wait();
    console.log("Bpool finalize complete");
    
    const join = await pool.connect(guest).joinPool(ethers.utils.parseUnits('2'), [ethers.constants.MaxUint256, ethers.constants.MaxUint256]);    
    await join.wait();
    console.log("Join at Bpool");
}

// 추가로 넣어야 할 작업
// 1.pool.setPublicSwap
// 2.setSwapFee
// 3.swapExactAmountIn
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});