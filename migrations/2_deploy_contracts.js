var CSAToken = artifacts.require("./CSAToken.sol");
var CSATokenFactory = artifacts.require("./CSATokenFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(CSAToken, "Farm Name", 25, 200);
  deployer.deploy(CSATokenFactory);
};