
const faucetContract = artifacts.require('faucet');

module.exports=function(deployer){
    deployer.deploy(faucetContract)
}