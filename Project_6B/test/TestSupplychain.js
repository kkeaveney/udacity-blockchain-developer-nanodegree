// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.toWei('1', "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID= accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

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

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("distributor: accounts[2] ", accounts[2])
    console.log("retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])



    var _assertBufferOne = function(_resultBuffer, _ownerID) {
      var anyOwnerID = _ownerID ? _ownerID : originFarmerID;
      assert.equal(_resultBuffer[0], sku, 'Error: Invalid item SKU')
      assert.equal(_resultBuffer[1], upc, 'Error: Invalid item UPC')
      assert.equal(_resultBuffer[2], anyOwnerID, 'Error: Invalid owner defaultOwnerID');
      assert.equal(_resultBuffer[3], originFarmID, 'Error: Invalid originFarmerID');
      assert.equal(_resultBuffer[4], originFarmName, 'Error: Invalid originFarmName');
      assert.equal(_resultBuffer[5], originFarmInformation, 'Error Invalid originFarmInformation');
      assert.equal(_resultBuffer[6], originFarmLatitude, 'Error Invalid originFarmLatitude');
      assert.equal(_resultBuffer[7], originFarmLongitude, 'Error Invalid originFarmLongitude');
      }

    var _assertBufferTwo = function(_resultBufferTwo, _ownerID) {
      var anyOwnerID = _ownerID ? _ownerID : originFarmerID;
      assert.equal(_resultBufferTwo [0], sku, 'Error Invalid item SKU');
      assert.equal(_resultBufferTwo [1], upc, 'Error: Invalid item UPC');
      assert.equal(_resultBufferTwo [2], productID, 'Error: Invalid productID');
      assert.equal(_resultBufferTwo [3], productNotes, 'Error: Invalid productNotes');
      assert.equal(_resultBufferTwo [4], productPrice, 'Error: Invalid productPrice');
      assert.equal(_resultBufferTwo [5].toNumber(),7, 'Error: Invalid itemState');
      assert.equal(_resultBufferTwo [6], distributorID, 'Error: Invalid distributorID ');
      assert.equal(_resultBufferTwo [7], retailerID, 'Error: Invalid retailerID,');
      assert.equal(_resultBufferTwo [8], consumerID, 'Error: Invalid consumerID');

    }



    // 1st Test
    it("Testing smart contract function PlantItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Planted()
        var event = supplyChain.Planted()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.plantItem(upc, originFarmID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBuffer = await supplyChain.fetchItem.call(upc);

        // Verify the result set
        assert.equal(resultBuffer[0], sku, 'Error: Invalid item SKU');
        assert.equal(resultBuffer[1], upc, 'Error: Invalid item UPC');
        assert.equal(resultBuffer[2], originFarmID, 'Error: Missing or Invalid ownerID');
        assert.equal(resultBuffer[3], originFarmID, 'Error: Missing or Invalid ManufacturerID');
        assert.equal(resultBuffer[4], originFarmName, 'Error: Missing or Invalid ManufacturerName');
        assert.equal(resultBuffer[5], itemState, 'Error: Invalid item State');
        assert.equal(eventEmitted, true, 'Invalid event emitted');

        console.log('Planted', resultBuffer[5].toNumber());
    })

    // 2nd Test
    it("Testing smart contract function harvestItem() that allows a farmer to process coffee", async() => {
      const supplyChain = await SupplyChain.deployed()

     // Declare and Initialize a variable for event
       var eventEmitted = false;

     // Watch the emitted event Harvested()
       var event = supplyChain.Harvested()
       await event.watch((err,res) => {
         eventEmitted = true;
       })

     // Mark an item as Harvested by calling function processtItem()

      await supplyChain.harvestItem(upc, {from: originFarmID});

      const resultBuffer = await supplyChain.fetchItem.call(upc);

     // Verify the result set
     assert.equal(eventEmitted, true,'Invalid event emitted');
     assert.equal(resultBuffer[5], 1, 'Error: Invalid item State');

     console.log('Harvested',resultBuffer[5].toNumber());

    })

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
      const supplyChain = await SupplyChain.deployed()

   // Declare and Initialize a variable for event
     var eventEmitted = false;

   // Watch the emitted event Harvested()
     var event = supplyChain.Packed()
     await event.watch((err,res) => {
       eventEmitted = true;
     })

   // Mark an item as Harvested by calling function processtItem()

   await supplyChain.packItem(upc, {from: originFarmID});

   // Retrieve the just now saved item from blockchain by calling function fetchItem()

   const resultBuffer = await supplyChain.fetchItem.call(upc);
   // Verify the result set

   console.log('Packed', resultBuffer[5].toNumber());

   assert.equal(eventEmitted, true,'Invalid event emitted');
   assert.equal(resultBuffer[5], 2, 'Error: Invalid item State');



    })

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event ForSale()
        var event = supplyChain.ForSale()
        await event.watch((err,res) => {
          eventEmitted = true;
        })

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, distributorID, {from :originFarmID});

        console.log(distributorID, 'distributorID');
        console.log(originFarmID, 'originFarmID');

        const resultBuffer = await supplyChain.fetchItem.call(upc);

        console.log(resultBuffer);


        // Verify the result set
      //    assert.equal(resultBuffer[5], 2, 'Error: Invalid item State');
    //    assert.equal(resultBuffer[6], productPrice, 'Error: Invalid item price');
    //    assert.equal(resultBuffer[7], distributorID, 'Error: Missing or Invalid retailer ID');
        assert.equal(eventEmitted, true, 'Invalid event emitted');

    });

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmmited = false;

        // Watch the emitted event Sold()
        var event = supplyChain.Sold()
        await event.watch((err,res) => {
          eventEmitted = true;
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, {from: distributorID, value: web3.toWei(2, "ether")});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        console.log('Buy Item', resultBufferTwo[5].toNumber());
        assert.equal(eventEmitted, true,'Invalid event emitted');
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State');
    })

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Shipped()
        var event = supplyChain.Shipped()
        await event.watch((err,res) =>{
          eventEmitted = true;
        })

        // Mark an item as Sold by calling function shipItem()
        await supplyChain.shipItem(upc, {from: distributorID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        console.log('Ship Item', resultBufferTwo[5].toNumber());
        assert.equal(eventEmitted, true,'Invalid event emitted');
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State');
    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Received()
        var event = supplyChain.Received()
        await event.watch((err,res) =>{
          eventEmitted = true;
        })

        // Mark an item as Sold by calling function receiveItem()
        await supplyChain.receiveItem(upc,{from: retailerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        console.log('Receive Item', resultBufferTwo[5].toNumber());
        assert.equal(eventEmitted, true,'Invalid event emitted');
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State');
    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Purchased()
        var event = supplyChain.Purchased()
        await event.watch((err, res) =>{
          eventEmitted = true;
        })

        // Mark an item as Sold by calling function purchaseItem()
        await supplyChain.purchaseItem(upc,{from: consumerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)


        // Verify the result set
        console.log('Purchase Item', resultBufferTwo[5].toNumber());
        assert.equal(eventEmitted, true,'Invalid event emitted');
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
    })

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);

        // Verify the result set:
        _assertBufferOne(resultBufferOne, consumerID);
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set:
        _assertBufferTwo(resultBufferTwo, consumerID);

    })

});
