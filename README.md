# CSA Farm Token
Code to create framework to model CSA Farms on Ethereum blockchain


Work in progress, started at ETHWaterloo hackathon.

setup (for testing with testrpc), I assume nodejs, Truffle Framework and testrpc are installed:

```
npm install
```
then start testrpc
```
testrpc
```
Migrate contracts with Truffle (in different terminal)
```
truffle migrate
```
The copy the address for CSATokenFactory to replace the address in line 4 of file src/js/app.js

Then start the nodejs test server
```
node src/js/server.js
```

Browse to localhost:8080 and enjoy this demonstration of modeling a CSA Farm Subscription on the Ethereum blockchain.

