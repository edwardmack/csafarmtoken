App = {
  web3Provider: null,
  contracts: {},
  contractFactoryAddress: '0x3e4564bb1e4c65a12d1287b6e5bb872b0743cab8',
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
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
  
    web3 = new Web3(App.web3Provider);

    var myAccount;
    var targetToken  = $(event.target).data('id');
    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }
      myAccount = accounts[0];
    });

    return App.initContract();
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
                  //var sRes = result.split(",");
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
      App.contracts.CSATokenFactory.at(App.contractFactoryAddress).createCSAToken(tokenName, tokenQty, function(error, result) {
        if(!error) {
          console.log("result:" + result);
        } else {
          console.log("error: " + error);
        }
      });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
