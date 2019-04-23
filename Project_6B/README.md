# Project6B
Architect a Blockchain Supply Chain Solution - Part B

Using:
- Truffle v4.1.15
- node v10.7.0
- Solidity v0.4.25

### Prerequisites

Install Node and NPM using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

- Installation
```
npm install
```
- To test the contract start ```ganache-cli``` and type ```truffle test```.
There are ten tests that should all pass.

```
Admins-MacBook-Pro-2:Project_6B admin$ truffle test
Using network 'development'.

ganache-cli accounts used here...
Contract Owner: accounts[0]  0xe554340f81be79687cb3b971a5740ee8de171e59
Farmer: accounts[1]  0x3cc77f53dbc6a4ed047728a724e8044b6f6cbdf7
distributor: accounts[2]  0x3eeb3bf5819f3fde044797e2bdcb4009ade43ba5
retailer: accounts[3]  0x56e5d862607521db6eef442a1b7e8f7f4f6404fc
Consumer: accounts[4]  0x0a72f8ae50fcfec97333aa814e128d23cfc05d75



  Contract: SupplyChain
Planted 0
    ✓ Testing smart contract function PlantItem() that allows a farmer to harvest coffee (693ms)
Harvested 1
    ✓ Testing smart contract function harvestItem() that allows a farmer to process coffee (263ms)
Packed 2
    ✓ Testing smart contract function packItem() that allows a farmer to pack coffee (216ms)
For Sale 3
    ✓ Testing smart contract function sellItem() that allows a farmer to sell coffee (223ms)
Buy Item 4
    ✓ Testing smart contract function buyItem() that allows a distributor to buy coffee (185ms)
Ship Item 5
    ✓ Testing smart contract function shipItem() that allows a distributor to ship coffee (183ms)
Receive Item 6
    ✓ Testing smart contract function receiveItem() that allows a retailer to mark coffee received (193ms)
Purchase Item 7
    ✓ Testing smart contract function purchaseItem() that allows a consumer to purchase coffee (396ms)
    ✓ Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain (98ms)
    ✓ Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain


  10 passing (3s)

```
- Install Metamask plugin for chrome

- Ensure that your wallet contains enough Ether for transactions

- To start the application issue the command  ```npm run dev```.
