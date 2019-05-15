# Project6B
Architect a Blockchain Supply Chain Solution - Part B

Using:
- Truffle v4.1.15
- node v10.7.0
- Solidity v0.4.25
- Web3:1.0.0-beta

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
Farmer        : accounts[1]  0x3cc77f53dbc6a4ed047728a724e8044b6f6cbdf7
Distributor   : accounts[2]  0x3eeb3bf5819f3fde044797e2bdcb4009ade43ba5
Retailer      : accounts[3]  0x56e5d862607521db6eef442a1b7e8f7f4f6404fc
Consumer      : accounts[4]  0x0a72f8ae50fcfec97333aa814e128d23cfc05d75


  Contract: SupplyChain
    test all contract methods
      ✓ Testing smart contract function plantItem()) that allows a farmer to harvest coffee (1842ms)
      ✓ Testing smart contract function processItem() that allows a farmer to process coffee (1739ms)
      ✓ Testing smart contract function packItem() that allows a farmer to pack coffee (618ms)
      ✓ Testing smart contract function sellItem() that allows a farmer to sell coffee (617ms)
      ✓ Testing smart contract function buyItem() that allows a distributor to buy coffee (11383ms)
      ✓ Testing smart contract function shipItem() that allows a distributor to ship coffee (4765ms)
      ✓ Testing smart contract function receiveItem() that allows a retailer to mark coffee received (3588ms)
      ✓ Testing smart contract function purchaseItem() that allows a consumer to purchase coffee (4512ms)
      ✓ Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain (903ms)
      ✓ Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain (2081ms)


  10 passing (57s)

```
- Install Metamask plugin for chrome

- Ensure that your wallet contains enough Ether for transactions

- To start the application issue the command  ```npm run dev```.

## Contract deployment
```
truffle migrate --network rinkeby --reset --compile-all

Compiling ./contracts/Migrations.sol...
Compiling ./contracts/coffeeaccesscontrol/ConsumerRole.sol...
Compiling ./contracts/coffeeaccesscontrol/DistributorRole.sol...
Compiling ./contracts/coffeeaccesscontrol/FarmerRole.sol...
Compiling ./contracts/coffeeaccesscontrol/RetailerRole.sol...
Compiling ./contracts/coffeeaccesscontrol/Roles.sol...
Compiling ./contracts/coffeebase/SupplyChain.sol...
Compiling ./contracts/coffeecore/Ownable.sol...
Writing artifacts to ./build/contracts

Using network 'rinkeby'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0xa63ad85361ae69e7fd49babb7f6d70e3ed79dab2cc0bba5759eb1a91d495c58e
  Migrations: 0x9b607fafefcb1aac71c726af377398afaef53750
Saving successful migration to network...
  ... 0xb2c8db0eb611f3b06e766acc5a1e111a80b9bb47d9b8ad039a6b9f010adcb957
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Replacing FarmerRole...
  ... 0x22d1b9edf43c98c7aa31ade0c379ba6e8dab019fe3f4b7ffafdb3b39c5e41dcd
  FarmerRole: 0x01e69e257677bb992b3a0af86d1c220f8b536d8f
  Replacing DistributorRole...
  ... 0x9becf8759ad12569ab91669cce2efc300a325df12ff07e50a093eaa77a6255da
  DistributorRole: 0x4663b4f478b02843cb18f5ab8fd3cc43723db269
  Replacing RetailerRole...
  ... 0xdf8ba67df854d049de89bdbfae142963abf6d9703c25303afbbcfa569cfe604e
  RetailerRole: 0xb110681ddfee6386fc325cdec802589d8a811eae
  Replacing ConsumerRole...
  ... 0x8ff4bbd2ee0efc2aa7a4136c73e7849e1b8585292193beba218abf11a15781d0
  ConsumerRole: 0x25176b1ff49dc822f87b96dae4ea4c30dd6ed14e
  Replacing SupplyChain...
  ... 0x075c49bded1c438d202956018a6ad06bd9d6b65c2e3b433a15e7aa97072791dc
  SupplyChain: 0x530db2532d7c674b2695b6e0c9b06b44ac37744b
Saving successful migration to network...
  ... 0xb79ecd7d6ae6bfea03d97e7921e265f249d5faaca593b11cd9c2091658547ffb
Saving artifacts...
```
## View details on Etherscan
### Contract address
https://rinkeby.etherscan.io/address/0x60d497b2e310d3385cb69f1f982db6da0410f849

### Transaction information
```
TxHash:0x075c49bded1c438d202956018a6ad06bd9d6b65c2e3b433a15e7aa97072791dc
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0x075c49bded1c438d202956018a6ad06bd9d6b65c2e3b433a15e7aa97072791dc

#### Plant transaction
```
TxHash:0x3acda4e75abe6f191cead25ddf578a3f4f55cb0d85b4270e941622ee7fbeb7bb
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0x3acda4e75abe6f191cead25ddf578a3f4f55cb0d85b4270e941622ee7fbeb7bb

#### Harvest transaction
```
TxHash:0x99205fd67cf08a381b7d557fdfab024142cfb86c153f032ea33b2567958e1cec
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0x99205fd67cf08a381b7d557fdfab024142cfb86c153f032ea33b2567958e1cec

#### Pack transaction
```
TxHash:0x6c9670f6b4c11ea1beadf45a9e550902dfe9da3cb262f53f0fa29eee64b1df5b
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0x6c9670f6b4c11ea1beadf45a9e550902dfe9da3cb262f53f0fa29eee64b1df5b

#### ForSale transaction
```
TxHash:0xccc4a9c8512128815194fad1d0c9d4b3e723ddc3184d321055070a94f38d837c
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0xccc4a9c8512128815194fad1d0c9d4b3e723ddc3184d321055070a94f38d837c

#### Buy transaction
```
TxHash:0x67d005915b3a9e37acb8627e99ca862aba76e5b0627335e462035dfbabaa7a4b
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0x67d005915b3a9e37acb8627e99ca862aba76e5b0627335e462035dfbabaa7a4b

#### Ship transaction
```
TxHash:0x9ab411171ae6f0711444f7e062483fc9e345fe21c15434369c87dee8d5f5aaed
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0x9ab411171ae6f0711444f7e062483fc9e345fe21c15434369c87dee8d5f5aaed

#### Received transaction
```
TxHash:0x7efe88cd4e55e8cc614c24550982b8520274131961088d1cd534501218c56410
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0x7efe88cd4e55e8cc614c24550982b8520274131961088d1cd534501218c56410

#### Purchased transaction
```
TxHash:0xdabe31583de5e53920a307c1b008a3c4a53f42bc2ee979b1acf7c3ec56a127be
TxReceipt Status:Success
```
https://rinkeby.etherscan.io/tx/0xdabe31583de5e53920a307c1b008a3c4a53f42bc2ee979b1acf7c3ec56a127be


## UML Diagrams

### Activity Diagram
![image1](./images/Activity.png)

### Sequence Diagram
![image1](./images/Sequence.png)

### State Diagram
![image1](./images/State.png)

### Data Diagram (Data model)
![image1](./images/Data.png)
