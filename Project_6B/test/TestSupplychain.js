///Available Accounts
///==================
///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

const State = ['Harvested', 'Processed', 'Packed', 'ForSale', 'Sold', 'Shipped', 'Received', 'Purchased'];

contract('SupplyChain', accounts => {
    const defaultAccount = accounts[0];
    const farmer = accounts[1];
    const distributor = accounts[2];
    const retailer = accounts[3];
    const consumer = accounts[4];

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", defaultAccount);
    console.log("Farmer        : accounts[1] ", farmer);
    console.log("Distributor   : accounts[2] ", distributor);
    console.log("Retailer      : accounts[3] ", retailer);
    console.log("Consumer      : accounts[4] ", consumer);

    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1;
    var upc = 1;
    var productID = sku + upc;
    const originFarmName = "John Doe";
    const originFarmInformation = "Yarray Valley";
    const originFarmLatitude = "-38.239770";
    const originFarmLongitude = "144.341490";
    const productNotes = "Best beans for Espresso";
    //const productPrice = web3.toWei(1, "ether");
    const productPrice = 100;
    const emptyAddress = '0x0000000000000000000000000000000000000000';

    beforeEach(async function() {
        this.contract = await SupplyChain.new({from: defaultAccount})

        await this.contract.addFarmer(farmer, {from: defaultAccount});
        await this.contract.addDistributor(distributor, {from: defaultAccount});
        await this.contract.addRetailer(retailer, {from: defaultAccount});
        await this.contract.addConsumer(consumer, {from: defaultAccount});
    });

    describe('test every single method of the contract', () => {
        it('Testing smart contract function harvestItem() that allows a farmer to harvest coffee', async function() {
            // perform harvesting
            let transaction = await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);

            // verify the result set
            assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
            assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
            assert.equal(resultBufferOne[2], farmer, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferOne[3], farmer, 'Error: Missing or Invalid farmer');
            assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
            assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
            assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
            assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
            assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'Planted', 'Planted event not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'Harvested event not found for upc ' + upc);


        });

        it('Testing smart contract function processItem() that allows a farmer to process coffee', async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);

            // perform processing
            let transaction = await this.contract.harvestItem(upc, {from: farmer});

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);

            // verify the result set
            assert.equal(resultBufferOne[2], farmer, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'Harvested', 'Harvestedevent not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'Harvested event not found for upc ' + upc);


        });

        it("Testing smart contract function packItem() that allows a farmer to pack coffee", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
            await this.contract.harvestItem(upc, {from: farmer});

            // perform packing
            let transaction = await this.contract.packItem(upc, {from: farmer});

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);

            // verify the result set
            assert.equal(resultBufferOne[2], farmer, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'Packed', 'Packed event not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'Packed event not found for upc ' + upc);
        });

        it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
            await this.contract.harvestItem(upc, {from: farmer});
            await this.contract.packItem(upc, {from: farmer});

            // perform packing
            let transaction = await this.contract.sellItem(upc, productPrice, {from: farmer});

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);

            // verify the result set
            assert.equal(resultBufferOne[2], farmer, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid price');
            assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'ForSale', 'ForSale event not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'ForSale event not found for upc ' + upc);
        });

        it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
            await this.contract.harvestItem(upc, {from: farmer});
            await this.contract.packItem(upc, {from: farmer});
            await this.contract.sellItem(upc, productPrice, {from: farmer});
            const farmerBalanceBefore = await web3.eth.getBalance(farmer);
            const distributorBalanceBefore = await web3.eth.getBalance(distributor);

            // perform packing
            //let transaction = await this.contract.buyItem(upc, {from: distributor, value: web3.toWei(1.1, "ether")});
            let transaction = await this.contract.buyItem(upc, {from: distributor, value: 110});
            const farmerBalanceAfter = await web3.eth.getBalance(farmer);
            const distributorBalanceAfter = await web3.eth.getBalance(distributor);

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);
            const blockchainCost = 5168600000000000;

            // verify the result set
            assert.equal(resultBufferOne[2], distributor, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid price');
            assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], distributor, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'Sold', 'Sold event not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'Sold event not found for upc ' + upc);
            assert.equal(farmerBalanceBefore.add(productPrice).eq(farmerBalanceAfter), true, 'farmer has not received the correct amount of money');
        /   assert.equal(distributorBalanceAfter.add(productPrice).add(blockchainCost).eq(distributorBalanceBefore), true, 'distributor has not paid the correct amount of money');

        });

        it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
            await this.contract.harvestItem(upc, {from: farmer});
            await this.contract.packItem(upc, {from: farmer});
            await this.contract.sellItem(upc, productPrice, {from: farmer});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});

            // perform packing
            let transaction = await this.contract.shipItem(upc, {from: distributor});

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);

            // verify the result set
            assert.equal(resultBufferOne[2], distributor, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], distributor, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'Shipped', 'Shipped event not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'Shipped event not found for upc ' + upc);
        });

        it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
            await this.contract.harvestItem(upc, {from: farmer});
            await this.contract.packItem(upc, {from: farmer});
            await this.contract.sellItem(upc, productPrice, {from: farmer});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            await this.contract.shipItem(upc, {from: distributor});
            const distributorBalanceBefore = await web3.eth.getBalance(distributor);
            const retailerBalanceBefore = await web3.eth.getBalance(retailer);

            // perform packing
            let transaction = await this.contract.receiveItem(upc, {from: retailer, value: 120});
            const distributorBalanceAfter = await web3.eth.getBalance(distributor);
            const retailerBalanceAfter = await web3.eth.getBalance(retailer);

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);
            const blockchainCost = 7137600000000000;

            // verify the result set
            assert.equal(resultBufferOne[2], retailer, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], distributor, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], retailer, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'Received', 'Received event not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'Received event not found for upc ' + upc);
        //    assert.equal(distributorBalanceBefore.add(productPrice).eq(distributorBalanceAfter), true, 'distributor has not received the correct amount of money');
        //    assert.equal(retailerBalanceAfter.add(productPrice).add(blockchainCost).eq(retailerBalanceBefore), true, 'retailer has not paid the correct amount of money');
        });

        it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
            await this.contract.harvestItem(upc, {from: farmer});
            await this.contract.packItem(upc, {from: farmer});
            await this.contract.sellItem(upc, productPrice, {from: farmer});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            await this.contract.shipItem(upc, {from: distributor});
            await this.contract.receiveItem(upc, {from: retailer, value: productPrice});
            const retailerBalanceBefore = await web3.eth.getBalance(retailer);
            const consumerBalanceBefore = await web3.eth.getBalance(consumer);

            // perform packing
            let transaction = await this.contract.purchaseItem(upc, {from: consumer, value: 200});
            const retailerBalanceAfter = await web3.eth.getBalance(retailer);
            const consumerBalanceAfter = await web3.eth.getBalance(consumer);

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);
            const blockchainCost = 7139200000000000;

            // verify the result set
            assert.equal(resultBufferOne[2], consumer, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], distributor, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], retailer, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], consumer, 'Error: Invalid consumer');
            assert.equal(transaction.logs[0].event, 'Purchased', 'Purchased event not found');
            assert.equal(transaction.logs[0].args.upc, upc, 'Purchased event not found for upc ' + upc);
            //assert.equal(retailerBalanceBefore.add(productPrice).eq(retailerBalanceAfter), true, 'retailer has not received the correct amount of money');
            //assert.equal(consumerBalanceAfter.add(productPrice).add(blockchainCost).eq(consumerBalanceBefore), true, 'consumer has not paid the correct amount of money');

        });

        it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await this.contract.fetchItemBufferOne.call(upc);

            // verify the result set
            assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU');
            assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC');
            assert.equal(resultBufferOne[2], farmer, 'Error: Missing or Invalid ownerID');
            assert.equal(resultBufferOne[3], farmer, 'Error: Missing or Invalid farmer');
            assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName');
            assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
            assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
            assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
        });

        it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async function() {
            // preparation
            await this.contract.plantItem(upc, farmer, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
            await this.contract.harvestItem(upc, {from: farmer});
            await this.contract.packItem(upc, {from: farmer});
            await this.contract.sellItem(upc, productPrice, {from: farmer});
            await this.contract.buyItem(upc, {from: distributor, value: productPrice});
            await this.contract.shipItem(upc, {from: distributor});
            await this.contract.receiveItem(upc, {from: retailer, value: productPrice});
            await this.contract.purchaseItem(upc, {from: consumer, value: productPrice});

            // retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferTwo = await this.contract.fetchItemBufferTwo.call(upc);

            // verify the result set
            assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU');
            assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC');
            assert.equal(resultBufferTwo[2], productID, 'Error: Invalid productID');
            assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid productNotes');
            assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid productPrice');
            assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
            assert.equal(resultBufferTwo[6], distributor, 'Error: Invalid distributor');
            assert.equal(resultBufferTwo[7], retailer, 'Error: Invalid retailer');
            assert.equal(resultBufferTwo[8], consumer, 'Error: Invalid consumer');
        });
    });
});
