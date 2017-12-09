var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var serviceAccount = require('../keys/csa-farm-token-firebase-adminsdk-p3iva-5d58191a1e.json');
var testData;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://csa-farm-token.firebaseio.com'
});

var db = admin.database();
var ref = db.ref('/contract');
ref.on('value', function(snapshot) {
  console.log(snapshot.val());
  testData = snapshot.val();
}, function(errorObject) {
  console.log('The read failed: ' + errorObject.code);
});

var Web3 = require('web3');

App = {
  web3Provider: null,
  contracts: {},
  contractFactoryAddress: '0xf204a4ef082f5c04bb89f7d5e6568b796096735a',
  myAccount: '',

  init: function() {

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
  
    web3 = new Web3(App.web3Provider);

    var myAccount;
    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }
      myAccount = accounts[0];
    });
    return;
    //return App.initContract();
  },

  initContract: function() {
    $.getJSON('CSATokenFactory.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var CSATokenFactoryArtifact = data;
      //truffle style
      //App.contracts.CSATokenFactory = TruffleContract(CSATokenFactoryArtifact);
      // Set the provider for our contract
      //App.contracts.CSATokenFactory.setProvider(App.web3Provider);

      // web3 style
      App.contracts.CSATokenFactory = web3.eth.contract(CSATokenFactoryArtifact.abi);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.printContract();
    });

    $.getJSON('CSAToken.json', function(data) {
      var CSATokenArtifact = data;
      // truffle style
      //App.contracts.CSAToken = TruffleContract(CSATokenArtifact);
      //App.contracts.CSAToken.setProvider(App.web3Provider);

      // web3 style
      App.contracts.CSAToken = web3.eth.contract(CSATokenArtifact.abi);

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-create-token', App.handleCreateToken);
    $(document).on('click', '.btn-refresh', App.printContract);
    $(document).on('click', '.btn-purchase', App.purchaseToken);
    
  },

  printContract: function() {
    var tokenTemplate = $('#tokenTemplate');
    var tokensRow = $('#tokensRow');
    App.contracts.CSATokenFactory.at(App.contractFactoryAddress).getChildrenCount(function(error, result) {
      if(!error) {
        for(i = 0; i < result; i++ ) {
          
          App.contracts.CSATokenFactory.at(App.contractFactoryAddress).childrenAddresses(i, function(error, result) {
            if(!error) {
              // child contract address
              console.log("result: " + result);
              App.contracts.CSATokenFactory.at(App.contractFactoryAddress).csaChildren(result, function(error, result) {
                if(!error) {
                  tokenTemplate.find('.panel-title').text(result[1]);
                  tokenTemplate.find('.token-address').text(result[0]);
                  tokenTemplate.find('.initial-qty').text(result[2]);
                  tokenTemplate.find('.btn-purchase').attr('data-id', result[0]);
                  tokenTemplate.find('.token-price').text(result[3]);

                  console.log("resFrom csaChildren split ");
                  console.log("resFrom csaChildren" + JSON.stringify(result));
                  console.log("resFrom csaChildren initial_supply: " + result[1]);
                  console.log("resFrom csaChildren name: " + result[0]);
                  tokensRow.append(tokenTemplate.html());
                } else {
                  console.log("error: " + error);
                }
              });
             
            } else {
              console.log("error" + error);
            }
          });
    
        }
      } else {
        console.log("error: " + error);
      }
    });
    
  },
  purchaseToken: function() {   
    
    var targetToken = $(event.target).data('id');
    console.log("myAccount: " + App.myAccount);
    console.log("target token " + targetToken);
    var amount = web3.toWei(0.7, "ether");
    App.contracts.CSAToken.at(targetToken).transfer(App.myAccount, 2,  function(error, result) {
      if(!error) {
        console.log("transfer: " + result);
      } else {
        console.log("error: " + error);
      }
  
  });
    //alert('u  ' + $(event.target).data('id'));
  },

  handleCreateToken: function() {
    event.preventDefault();  
    
      var tokenName = $('#tokenName').val();
      var tokenQty = $('#tokenQty').val();
      var tokenPrice = $('#tokenPrice').val();
      App.contracts.CSATokenFactory.at(App.contractFactoryAddress).createCSAToken(tokenName, 
        tokenQty, tokenPrice, function(error, result) {
        if(!error) {
          console.log("result:" + result);
        } else {
          console.log("error: " + error);
        }
      });
  }

};

/* GET users listing. */
router.get('/', function(req, res, next) {
  //App.init();
  console.log("testData", testData);
  res.render('users',{test: testData});
});

module.exports = router;
