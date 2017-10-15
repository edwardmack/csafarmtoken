//var Adoption = artifacts.require("./Adoption.sol");
//var CSAToken = artifacts.require("./CSAToken.sol");
var CSATokenFactory = artifacts.require("./CSATokenFactory.sol");

module.exports = function(deployer) {
  //deployer.deploy(Adoption);
  //deployer.deploy(CSAToken, "CSAToken");
  deployer.deploy(CSATokenFactory);
};