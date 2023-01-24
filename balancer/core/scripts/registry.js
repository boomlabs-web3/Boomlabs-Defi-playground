async function main() {
    // We get the contract to deploy
    const ExchangeProxy = await ethers.getContractFactory("ExchangeProxy");
    const Registry = await ethers.getContractFactory("BRegistry");
    const WETH = '0x24db8ff6671f8831331f8af937ce28c96c9ac9bb';
    const BFactory = '0x57e8530df43b22eef70cf7291a8f1727dbbc7177';
  
    const registry = await Registry.deploy(BFactory);
    await registry.deployed();
    console.log("Registry deployed to:", registry.address);
  
    const exchangeProxy = await ExchangeProxy.deploy(WETH);
    await exchangeProxy.deployed();
  
    console.log("Proxy deployed to:", exchangeProxy.address);
  
    await exchangeProxy.setRegistry(registry.address);
    console.log('Registry set.')
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
  