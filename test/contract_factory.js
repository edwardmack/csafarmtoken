var CSATokenFactory = artifacts.require("./CSATokenFactory.sol");
var CSAToken = artifacts.require("./CSAToken.sol");

contract("CSATokenFactory", function(accounts) {
    var factory;
    var tokenInstance;
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
            tokenInst = CSAToken.at(result);
            console.log("after get info", tokenInst.name);
            return tokenInst.name.call();
        })
        .then(function(result) {
            console.log("name:", result);
            assert.equal(result, "Farm Name", "Expected value Farm Name");
        });
    });

    it("should transfer token", function() {
        var ownerAddress;
        return factory.getAddress.call(0)
        .then(function(result) {
            console.log("token 0 address: ", result);
            var tokenInst = CSAToken.at(result);
            return tokenInst.owner.call();
        })
        .then (function(result) {
            ownerAddress = result;
            console.log("Owner address: ", result);
            return tokenInst.balanceOf.call(ownerAddress);
        })
        .then(function(result) {
            console.log("owners balance (before transfer): " + result);
            assert.equal(result, 25, "Expected owner balance error");
            return tokenInst.transfer(accounts[0], 1, {from: accounts[0]});
        })
        .then(function(result) {
            console.log("result: ", result);
        })

    });

});