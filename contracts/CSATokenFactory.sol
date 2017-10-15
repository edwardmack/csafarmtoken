pragma solidity ^0.4.11;

import "./CSAToken.sol";

contract CSATokenFactory {
    //maintains all the child contracts
    struct CSATokenStruct {
        address tAddress;
        string name;
        uint initial_supply;
        uint token_price;
    }

    address[] public childrenAddresses;

    mapping(address => CSATokenStruct) public csaChildren;

    event CSATokenCreated(string name, uint initialSupply);

    // default constructor
    function CSATokenFactory() {
    }

    function createCSAToken(string _name, uint _initial_supply, uint _token_price) payable {
        address tAddress = new CSAToken(_name, _initial_supply, _token_price);
        childrenAddresses.push(tAddress);
        csaChildren[tAddress].tAddress = tAddress;
        csaChildren[tAddress].name = _name;
        csaChildren[tAddress].initial_supply = _initial_supply;
        csaChildren[tAddress].token_price = _token_price;
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
