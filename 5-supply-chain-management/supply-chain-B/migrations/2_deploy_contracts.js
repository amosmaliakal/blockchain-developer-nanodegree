var Supplychain = artifacts.require("./Supplychain.sol");

module.exports = function(deployer) {
  deployer.deploy(Supplychain);
};
