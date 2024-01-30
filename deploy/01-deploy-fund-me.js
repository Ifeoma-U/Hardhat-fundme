// function deployFunc(hre) {
//     console.log("Hi!")
    //hre.getNamedAccounts
// }

const { network } = require("hardhat")
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const { verify } =  require("../utils/verify")

// module.exports.default = deployFunc
//or 

// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments} = hre
// }
// or

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId  

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId] ["ethUsdPriceFeed"]
    }

    //const args = ethUsdPriceFeedAddress; to replace args
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, ethUsdPriceFeedAddress)
    }

    log("________________________________________________________________")
}

module.exports.tags = ["all", "fundme"]