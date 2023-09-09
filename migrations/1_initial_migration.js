//Code required to declare a contract ( used to declare the contract and migrate it.)
const Migrations = artifacts.require("migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};