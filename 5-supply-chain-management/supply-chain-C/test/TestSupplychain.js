// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.toWei(1, "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    //Available Accounts
    //==================
    //(0) 0x963865f57804b38459dd4b2da2f760211a200438
    //(1) 0x99c289eb2aacec289631a5ddf62cf27a63d4494f
    //(2) 0xf1b1bcd24dad92303dd9fe78be639f7bcf9c238d
    //(3) 0x0fb2bfefd526966c87efa19f6693d50971763fc2
    //(4) 0x5d777e9127b28fb119e81a6304278a0a21bef1c4
    //(5) 0xa966316bae3ca61b2e6e46a512375c516edf3515
    //(6) 0x088b0f37304e8bebf3276af1e04855ceba3c4c28
    //(7) 0x6c21b447357e8e390281d58566e65bde87d844e4
    //(8) 0x433063681428d09b1b8a5b3eaeb2570c7f8fbbba
    //(9) 0xfdac83b3e9e9853f2e0a013bcb44b912d9196669

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
        var eventEmitted = false
        
        // Watch the emitted event Processed()
        var event = supplyChain.Processed()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.processItem(upc, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Error: Invalid event emitted')        
    })    

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Packed()
        var event = supplyChain.Packed()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Error: Invalid event emitted')        
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event ForSale()
        var event = supplyChain.ForSale()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item Price')
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Error: Invalid event emitted')        
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Sold()
        var event = supplyChain.Sold()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], distributorID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item Price')
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Error: Invalid event emitted')        
    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Shipped()
        var event = supplyChain.Shipped()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.shipItem(upc, {from: distributorID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], distributorID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Error: Invalid event emitted')        
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Received()
        var event = supplyChain.Received()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.receiveItem(upc, {from: retailerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], retailerID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Error: Invalid event emitted')        
    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Purchased()
        var event = supplyChain.Purchased()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Sold by calling function buyItem()
        await supplyChain.purchaseItem(upc, {from: consumerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], consumerID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid item Owner')
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Error: Invalid event emitted')        
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Invalid item ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Invalid item originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Invalid item originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Invalid item originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Invalid item originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Invalid item originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], productID, 'Error: Invalid item productID')
        assert.equal(resultBufferOne[3], productNotes, 'Error: Invalid item productNotes')
        assert.equal(resultBufferOne[4], productPrice, 'Error: Invalid item productPrice')
        assert.equal(resultBufferOne[5], 7, 'Error: Invalid item itemState')
        assert.equal(resultBufferOne[6], distributorID, 'Error: Invalid item distributorID')
        assert.equal(resultBufferOne[7], retailerID, 'Error: Invalid item retailerID')
        assert.equal(resultBufferOne[8], consumerID, 'Error: Invalid item consumerID')
    })

});
