
const ZonuDexFactory = artifacts.require("IZonuDexFactory");
const ZonuDexRouter = artifacts.require("ZonuDexRouter");
const WONE = artifacts.require("WONE");
const argValue = (arg, defaultValue) => (process.argv.includes(arg) ? process.argv[process.argv.indexOf(arg) + 1] : defaultValue);
const network = () => argValue("--network", "local");


// HARMONY MAINNET
const FACTORY_HARMONY = "0xE77A7C836720897cd3fBd6c0C0067C5Ca278603F";
const WONE_HARMONY = "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a";// mainnet harmony WETH || WONE



module.exports = async (deployer) => {
    const BN = web3.utils.toBN;
    const bnWithDecimals = (number, decimals) => BN(number).mul(BN(10).pow(BN(decimals)));
    const senderAccount = (await web3.eth.getAccounts())[0];

    
    if (network() === "harmony_testnet") {


        console.log();
        console.log(":: REUSE FACTORY");
        let ZonuDexFactoryInstance = await ZonuDexFactory.at(FACTORY_HARMONY);
        console.log(`ZONUDEX FACTORY:`, ZonuDexFactoryInstance.address);

        console.log();
        console.log(":: REUSE WONE"); 
        let WETHInstance = await WONE.at(WONE_HARMONY);
        await WETHInstance.deposit({ from: senderAccount, value: 100 });

        console.log();
        console.log(":: DEPLOY ROUTER");
        await deployer.deploy(ZonuDexRouter, ZonuDexFactoryInstance.address, WETHInstance.address);
        const ZonuDexRouterInstance = await ZonuDexRouter.deployed();
        console.log(`ZONUDEX ROUTER:`, ZonuDexRouterInstance.address);


    } else if (network() === "harmony") {

        console.log();
        console.log(":: REUSE FACTORY");
        let ZonuDexFactoryInstance = await ZonuDexFactory.at(FACTORY_HARMONY);
        console.log(`ZONUDEX FACTORY:`, ZonuDexFactoryInstance.address);

        console.log();
        console.log(":: REUSE WONE"); 
        let WETHInstance = await WONE.at(WONE_HARMONY);
        await WETHInstance.deposit({ from: senderAccount, value: 100 });

        console.log();
        console.log(":: DEPLOY ROUTER");
        await deployer.deploy(ZonuDexRouter, ZonuDexFactoryInstance.address, WETHInstance.address);
        const ZonuDexRouterInstance = await ZonuDexRouter.deployed();
        console.log(`ZONUDEX ROUTER:`, ZonuDexRouterInstance.address);
    }

};
