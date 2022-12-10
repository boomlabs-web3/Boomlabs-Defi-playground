const FactoryContract = require("../../v2core/artifacts/contracts/UniswapV2Factory.sol/TestUniswapV2Factory.json")

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

task("balance")
    .setAction(async (taskArgs,hre) => {
    const address = "0xca823aB0f93Bb83431d5E83619A93f78C539f3EA";
    const balance = await hre.ethers.provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(balanceInEth);
    })

task("getpair")
    .addParam("addr1")
    .addParam("addr2")
    .setAction(async ({addr1, addr2}, hre) => {
        const [deployer, ...others] = await hre.ethers.getSigners();
        const factoryAddress = "0xC72C1FA89ff0F0a6F7f7cf1d228B3D0431F334A5";
        let pairAddress;
        const tokenA = addr1;
        const tokenB = addr2;
        console.log(`tokenA : ${addr1}| token B : ${addr2}`);
        const factory = await hre.ethers.getContractAt(FactoryContract.abi, factoryAddress, deployer);        
        console.log("getpair start ");
        pairAddress = await factory.getPair(tokenA, tokenB);
        if(pairAddress === ZERO_ADDR){
            const tx = await factory.createPair(tokenA, tokenB);
            await tx.wait();
            pairAddress = await factory.getPair(tokenA, tokenB);
            console.log("Factory creates pair : ", pairAddress);
        } else{
            console.log("Factory get pair : ", pairAddress);
        }
    })