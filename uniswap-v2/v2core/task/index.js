
task("balance")
    .setAction(async (taskArgs,hre) => {
    const address = "0xca823aB0f93Bb83431d5E83619A93f78C539f3EA";
    const balance = await hre.ethers.provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(balanceInEth);
    })
