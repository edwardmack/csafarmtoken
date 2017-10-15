pragma solidity ^0.4.11;

import "./CSAToken.sol";

contract CSATokenFactory {
    //maintains all the child contracts
    struct CSATokenStruct {
        address tAddress;
        string name;
        uint initial_supply;
    }

    address[] public childrenAddresses;

    mapping(address => CSATokenStruct) public csaChildren;

    uint public testVal = 200;

    event CSATokenCreated(string name, uint initialSupply);

    // default constructor
    function CSATokenFactory() {
    }

    function createCSAToken(string _name, uint _initial_supply) payable {
        address tAddress = new CSAToken(_name, _initial_supply);
        childrenAddresses.push(tAddress);
        csaChildren[tAddress].tAddress = tAddress;
        csaChildren[tAddress].name = _name;
        csaChildren[tAddress].initial_supply = _initial_supply;
        CSATokenCreated(_name, _initial_supply);
    }

    // returns the count of the children
    function getChildrenCount() constant returns (uint) {
        return childrenAddresses.length;
    }

    // returns info regarding contract
    function getAddress(uint childIndex) constant returns (address) {
        return childrenAddresses[childIndex];
     }
}
