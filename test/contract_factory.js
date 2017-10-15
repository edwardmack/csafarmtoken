var CSATokenFactory = artifacts.require("./CSATokenFactory.sol");
var CSAToken = artifacts.require("./CSAToken.sol");

contract("CSATokenFactory", function(accounts) {
    var factory;
    it("should create factory" ,function() {
        return CSATokenFactory.deployed()
        .then(function(instance) {
            factory = instance;
            return;
        })
        .then(function(result) {
            return factory.childrenAddresses.length;
        })
        .then(function(result) {
            console.log("children length:", result);
            assert.equal(result, 0, "Expected 0 children to start")
        })
    });

    it("should create token", function() {
        var amount = web3.toWei(0.01, "ether");
        return factory.createCSAToken("Farm Name", 25, 200, {from:accounts[0]})
        .then(function(result) {
            console.log("create token", result);

            return factory.childrenAddresses.call(0);
        })
        .then(function(result) {
            console.log("after create token", result);
            return factory.getAddress.call(0);
        })
        .then(function(result) {
            var myTokenInst = CSAToken.at(result);
            console.log("after get info", myTokenInst.name);
            return myTokenInst.name.call();
        })
        .then(function(result) {
            console.log("name:", result);
            assert.equal(result, "Farm Name", "Expected value Farm Name");
        });
    });

});