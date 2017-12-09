// node --harmony-async-await  contract-listener.js
//

let fs = require("fs");
var Web3 = require('web3'); // https://www.npmjs.com/package/web3

// Create a web3 connection to a running geth node over JSON-RPC running at
// http://localhost:8545
// For geth VPS server + SSH tunneling see
// https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

// Read the compiled contract code
// Compile with
// solc SampleContract.sol --combined-json abi,asm,ast,bin,bin-runtime,clone-bin,devdoc,interface,opcodes,srcmap,srcmap-runtime,userdoc > contracts.json
let source = fs.readFileSync("../build/contracts/CSATokenFactory.json");
let contract = JSON.parse(source);
console.log("contarcts", contract);
// ABI description as JSON structure
//let abi = JSON.parse(contract.abi);

// Smart contract EVM bytecode as hex
//let code = '0x' + contracts.SampleContract.bin;

// Create Contract proxy class
//console.log("web3", web3.eth);
var CSATokenFactory = new web3.eth.Contract(contract.abi, '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf');
//CSATokenFactory.options.address = ;
var contractsCount;
CSATokenFactory.methods.getChildrenCount().call()
.then(function(result) {
    contractsCount = result;
    console.log("factory children", result);
});
/*
// Unlock the coinbase account to make transactions out of it
console.log("Unlocking coinbase account");
var password = "";
try {
  web3.eth.personal.unlockAccount(web3.eth.getCcoinbase, password);
} catch(e) {
  console.log(e);
  return;
}
*/

//console.log("Deploying the contract");
//let contract = SampleContract.new({from: web3.eth.coinbase, gas: 1000000, data: code});

// Transaction has entered to geth memory pool
//console.log("Your contract is being deployed in transaction at http://testnet.etherscan.io/tx/" + contract.transactionHash);

// http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitBlock() {
  while (true) {
      /*
    let receipt = web3.eth.getTransactionReceipt(contract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
      console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
      break;
    }
    */
    //console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.getBlock());
    web3.eth.getBlockNumber().then(console.log);
    console.log("children Count: ", contractsCount);
    await sleep(4000);
  }
}

waitBlock();