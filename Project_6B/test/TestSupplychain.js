// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "Kevin Keaveney Farmer"
    const originFarmInformation = "London Farms"
    const originFarmLatitude = "-28.239770"
    const originFarmLongitude = "44.341490"
    var productID = sku + upc
    const productNotes = "Best beans for London"
    const productPrice = web3.toWei('1', "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'


    ///Available Accounts
    ///==================
    ///(0) 0xAbb2EAD44cD53f357d7398061e3008307F4FB4cA
    ///(1) 0x6E9a1cb2054E46E0D2503d684D38702dE52f10d4
    ///(2) 0x878DBdc8DbB6d9cB194813116c666E6a6Ca5006a
    ///(3) 0x29B0c2C79312c0c0935096123D7fDd135D7eBD07
    ///(4) 0x92b46d2E987e2173C4DCd2Bb7a2D58F27f14089e
    ///(5) 0x95b35dBA659cC04E465f87d069ebAbd7F169b72A
    ///(6) 0x670DB02B3A677bD876Caeb9783D96Cc971458d20
    ///(7) 0xd6c0348D3777C73f28F3CFcfc4028Aa1f5BbE243
    ///(8) 0x9ca866167133EA76503267D73203c540419Da7e1
    ///(9) 0xb32c9f121A90d4349DBE86b18eD02875Ca1337b0

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Harvested()
        var event = supplyChain.Harvested()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event


        // Watch the emitted event Processed()


        // Mark an item as Processed by calling function processtItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set

    })

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event


        // Watch the emitted event Packed()


        // Mark an item as Packed by calling function packItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set

    })

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event


        // Watch the emitted event ForSale()


        // Mark an item as ForSale by calling function sellItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set

    })

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event


        // Watch the emitted event Sold()
        var event = supplyChain.Sold()


        // Mark an item as Sold by calling function buyItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set

    })

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event


        // Watch the emitted event Shipped()


        // Mark an item as Sold by calling function buyItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set

    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event


        // Watch the emitted event Received()


        // Mark an item as Sold by calling function buyItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set

    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event


        // Watch the emitted event Purchased()


        // Mark an item as Sold by calling function buyItem()


        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set

    })

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set:

    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()


        // Verify the result set:

    })

});
