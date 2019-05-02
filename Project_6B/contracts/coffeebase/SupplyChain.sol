pragma solidity ^0.4.24;

  import "../coffeeaccesscontrol/FarmerRole.sol";
  import "../coffeeaccesscontrol/DistributorRole.sol";
  import "../coffeeaccesscontrol/RetailerRole.sol";
  import "../coffeeaccesscontrol/ConsumerRole.sol";
  import "../coffeecore/Ownable.sol";

  contract SupplyChain is Ownable, FarmerRole, DistributorRole, RetailerRole, ConsumerRole{

  // Define 'owner'
  address contractOwner;

  // Define a variable called 'upc' for Universal Product Code (UPC)
  uint  upc;

  // Define a variable called 'sku' for Stock Keeping Unit (SKU)
  uint  sku;

  // Define a public mapping 'items' that maps the UPC to an Item.
  mapping (uint => Item) items;

  // Define a public mapping 'itemsHistory' that maps the UPC to an array of TxHash,
  // that track its journey through the supply chain -- to be sent from DApp.
  mapping (uint => string[]) itemsHistory;

  // Define enum 'State' with the following values:
  enum State
  {
    Planted,  // 0
    Harvested,  // 1
    Packed,     // 2
    ForSale,    // 3
    Sold,       // 4
    Shipped,    // 5
    Received,   // 6
    Purchased   // 7
    }

  State constant defaultState = State.Planted;

  // Define a struct 'Item' with the following fields:
    struct Item {
    uint    sku;  // Stock Keeping Unit (SKU)
    uint    upc; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
    address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address originFarmID; // Metamask-Ethereum address of the Farmer
    string  originFarmName; // Farmer Name
    string  originFarmInformation;  // Farmer Information
    string  originFarmLatitude; // Farm Latitude
    string  originFarmLongitude;  // Farm Longitude
    uint    productID;  // Product ID potentially a combination of upc + sku
    string  productNotes; // Product Notes
    uint    productPrice; // Product Price
    State   itemState;  // Product State as represented in the enum above
    address distributorID;  // Metamask-Ethereum address of the Distributor
    address retailerID; // Metamask-Ethereum address of the Retailer
    address consumerID; // Metamask-Ethereum address of the Consumer
  }

  // Define 8 events with the same 8 state values and accept 'upc' as input argument
  event Planted(uint upc);
  event Harvested(uint upc);
  event Packed(uint upc);
  event ForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event Purchased(uint upc);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  modifier onlyOwner() {
  require(msg.sender == owner());
  _;
}

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address _address) {
    require(msg.sender == _address);
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) {
    //emit Debug(msg.sender, msg.value, _price);
    require(msg.value >= _price);
    _;
  }

  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint _upc) {
    uint _price = items[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    items[_upc].consumerID.transfer(amountToReturn);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Planted
  modifier planted(uint _upc) {
    require(items[_upc].itemState == State.Planted);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is ForSale
  modifier forSale(uint _upc) {
    require(items[_upc].itemState == State.ForSale);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Sold
  modifier sold(uint _upc) {
    require(items[_upc].itemState == State.Sold);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Harvested
  modifier harvested(uint _upc) {
    require(items[_upc].itemState == State.Harvested);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Packed
  modifier packed(uint _upc) {
    require(items[_upc].itemState == State.Packed);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Shipped
  modifier shipped(uint _upc) {
    require(items[_upc].itemState == State.Shipped);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Received
  modifier received(uint _upc) {
    require(items[_upc].itemState == State.Received);
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Purchased
  modifier purchased(uint _upc) {
    require(items[_upc].itemState == State.Purchased);
    _;
  }

  // In the constructor set 'owner' to the address that instantiated the contract
  // and set 'sku' to 1
  // and set 'upc' to 1
  constructor() public payable {
    contractOwner = msg.sender;
    sku = 1;
    upc = 1;
  }

  // Define a function 'kill' if required
  function kill() public {
    if (msg.sender == contractOwner) {
      selfdestruct(contractOwner);
    }
  }

  // Define a function 'harvestItem' that allows a farmer to mark an item 'Planted'
  function plantItem(uint _upc, address _originFarmID, string _originFarmName, string _originFarmInformation, string  _originFarmLatitude, string  _originFarmLongitude, string  _productNotes) public

  onlyOwner()

  {
    addFarmer(_originFarmID);
    transferOwnership(_originFarmID);

    // Add the new item as part of Processed
        Item memory newItem;
        newItem.upc = _upc;
        newItem.sku = sku;
        newItem.productID = sku + _upc;
        newItem.ownerID = _originFarmID;
        newItem.originFarmID = _originFarmID;
        newItem.originFarmName = _originFarmName;
        newItem.originFarmInformation = _originFarmInformation;
        newItem.originFarmLatitude = _originFarmLatitude;
        newItem.originFarmLongitude = _originFarmLongitude;
        newItem.itemState = defaultState;

        items[_upc] = newItem;

        // Increment sku
        sku = sku + 1;

        // Emit the appropriate event
        emit Planted(_upc);



  }
  // Define a function 'processItem' that allows a farmer to mark an item 'Harvested'
  function harvestItem(uint _upc)  public
     onlyOwner()
     onlyFarmer()
        // Call modifier to check if upc has passed previous supply chain stage
     planted(_upc)

      // Call modifier to verify caller of this function
    verifyCaller(items[_upc].ownerID)
    {
        // Update the appropriate fields
        items[_upc].itemState = State.Harvested;

        // Emit the appropriate event
        emit Harvested(_upc);
    }


  // Define a function 'packItem' that allows a farmer to mark an item 'Packed'
  function packItem(uint _upc)   public
  // Call modifier to check if upc has passed previous supply chain stage

  // Call modifier to verify caller of this function
  onlyOwner()
  onlyFarmer()
  harvested(_upc)

  verifyCaller(items[_upc].ownerID)
  {
      // Update the appropriate fields
      items[_upc].itemState = State.Packed;

      // Emit the appropriate event
      emit Packed(_upc);
  }


  // Define a function 'sellItem' that allows a farmer to mark an item 'ForSale'
<<<<<<< HEAD
  function sellItem(uint _upc, uint _price, address retailerID)  public
  // Call modifier to check if upc has passed previous supply chain stage

  // Call modifier to verify caller of this function
//  onlyFarmer()
//  packed(_upc)
=======
  function sellItem(uint _upc, uint _price, address distributorID)   public
  // Call modifier to check if upc has passed previous supply chain stage

  // Call modifier to verify caller of this function
  onlyOwner()
  onlyFarmer()
  packed(_upc)
>>>>>>> 03fcd920ae840a2bf0e21415341a2ea857a7e986

  verifyCaller(items[_upc].ownerID)
    {
<<<<<<< HEAD


         //addDistributor(_distributorID);
          transferOwnership(retailerID);
=======
          addDistributor(distributorID);
          transferOwnership(distributorID);
>>>>>>> 03fcd920ae840a2bf0e21415341a2ea857a7e986

        // Update the appropriate fields
    //    items[_upc].ownerID = distributorID;
    //    items[_upc].distributorID = distributorID;
    //    items[_upc].itemState = State.ForSale;
    //    items[_upc].productPrice = _price;

<<<<<<< HEAD
    //    // Emit the appropriate event
=======
        // Emit the appropriate event
>>>>>>> 03fcd920ae840a2bf0e21415341a2ea857a7e986
        emit ForSale(_upc);
    }
  // Define a function 'buyItem' that allows the distributor to mark an item 'Sold'
  // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough,
  // and any excess ether sent is refunded back to the buyer
  function buyItem(uint _upc)  public payable
      onlyOwner()
      onlyDistributor()
      // Call modifier to check if upc has passed previous supply chain stage
      forSale(_upc)
      // Call modifer to check if buyer has paid enough
      paidEnough(items[_upc].productPrice)
      // Call modifer to send any excess ether back to buyer
      checkValue(_upc)

      verifyCaller(items[_upc].ownerID)
  {
    // Update the appropriate fields - ownerID,  itemState

     items[_upc].ownerID = msg.sender;
     items[_upc].distributorID = msg.sender;
     items[_upc].itemState = State.Sold;

    // Transfer money to farmer
    items[_upc].originFarmID.transfer(items[_upc].productPrice);

    // emit the appropriate event
    emit Sold(_upc);
  }

  // Define a function 'shipItem' that allows the distributor to mark an item 'Shipped'
  // Use the above modifers to check if the item is sold
  function shipItem(uint _upc, address retailerID) public
    onlyOwner()
    onlyDistributor()
    // Call modifier to check if upc has passed previous supply chain stage
    sold(_upc)
    // Call modifier to verify caller of this function
    verifyCaller(items[_upc].ownerID)

    {
    //  addRetailer(retailerID);
    //  transferOwnership(retailerID);

    // Update the appropriate fields
    //items[_upc].ownerID = retailerID;
    //items[_upc].retailerID = retailerID;
    //items[_upc].itemState = State.ForSale;

    // Emit the appropriate event
    emit Shipped(_upc);

  }

  // Define a function 'receiveItem' that allows the retailer to mark an item 'Received'
  // Use the above modifiers to check if the item is shipped
  function receiveItem(uint _upc) shipped(_upc) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Access Control List enforced by calling Smart Contract / DApp
  {
    // Update the appropriate fields - ownerID, retailerID, itemState
    address retailer = msg.sender;
    items[_upc].ownerID = retailer;
    items[_upc].retailerID = retailer;
    items[_upc].itemState = State.Received;

    // Emit the appropriate event
    emit Received(_upc);

  }

  // Define a function 'purchaseItem' that allows the consumer to mark an item 'Purchased'
  // Use the above modifiers to check if the item is received
  function purchaseItem(uint _upc) received(_upc) public
    // Call modifier to check if upc has passed previous supply chain stage

    // Access Control List enforced by calling Smart Contract / DApp
  {
    // Update the appropriate fields - ownerID, consumerID, itemState
    address consumer = msg.sender;
    items[_upc].ownerID = consumer;
    items[_upc].consumerID = consumer;
    items[_upc].itemState = State.Purchased;

    // Emit the appropriate event
    emit Purchased(_upc);

  }

  function fetchItem(uint _upc) public view returns
    (
        uint itemSKU,
        uint itemUPC,
        address ownerID,
        address originFarmID,
        string originFarmName,
        State itemState,
        uint productPrice,
        address distributorID,
        address retailerID,
        address consumerID
    )
    {
        // Assign values to the parameters

        itemSKU = items[_upc].sku;
        itemUPC = items[_upc].upc;
        ownerID = items[_upc].ownerID;
        originFarmID = items[_upc].originFarmID;
        originFarmName = items[_upc].originFarmName;
        itemState = items[_upc].itemState;
        productPrice = items[_upc].productPrice;
        distributorID = items[_upc].distributorID;
        retailerID = items[_upc].retailerID;
        consumerID = items[_upc].consumerID;

        return
        (
        itemSKU,
        itemUPC,
        ownerID,
        originFarmID,
        originFarmName,
        itemState,
        productPrice,
        distributorID,
        retailerID,
        consumerID
        );
    }

}
