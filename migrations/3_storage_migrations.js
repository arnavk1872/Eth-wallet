
const storage = artifacts.require("storage")

module.exports = function (deployer) {
  deployer.deploy(storage)
}