var CSAToken = artifacts.require("./CSAToken.sol");

contract("CSAToken", function(accounts) {
    console.log("accounts:", accounts);
    var myToken;
    it("should have total supply" ,function() {
        return CSAToken.deployed()
        .then(function(instance) {
            myToken = instance;
            return myToken.totalSupply.call();
        })
        .then(function(result) {
            console.log("Total supply:", result);
            assert.equal(result, 25, "Expected 25 in total supply");
        }) 
    });

    it("should have a name" ,function() {
        return myToken.name.call()
        .then(function(result) {
            console.log("Name:", result);
            assert.equal(result, "Farm Name", "Expected Farm Name as name");
        }) 
    });

    it("should have balanceOf" ,function() {
        return myToken.balanceOf.call(accounts[1])
        .then(function(result) {
            console.log("balanceOf:", result);
            assert.equal(result, 0, "Expected balanceOf 0");
        }) 
    });
    
    it("transfer token " ,function() {
        return myToken.transfer(accounts[1], 1)
        .then(function(result) {
            console.log("transfer token:", result);
            return myToken.balanceOf.call(accounts[1]);    
        })
        .then(function(result) {
            console.log("Balance after transfer: ", result);
            assert.equal(result, 1, "Expected balanceOf 1");
        })
    });

});