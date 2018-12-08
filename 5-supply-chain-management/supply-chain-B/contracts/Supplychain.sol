pragma solidity ^0.4.24;
// Define a contract 'Supplychain'
contract Supplychain {

  // Define 'owner'
  address owner;
  
  // Define a variable called 'skuCount' to track the most recent sku # 
  uint  skuCount;

  // Define a public mapping 'items' that maps the SKU (a number) to an Item.
  mapping (uint => Item) items;
    
  // Define enum 'State' with the following values:
  enum State { Harvested, Processed, Packed, ForSale, Sold, Shipped, Received, Purchased }
  State constant defaultState = State.Harvested;

  // Define a struct 'Item' with the following fields:
  struct Item {
    uint    sku;
    address ownerID;
    string  productID;
    string  productUPC;
    address originFarmerID;
    string  originFarmName;
    string  originFarmInformation;
    string  originFarmLatitude;
    string  originFarmLongitude;
    string  productNotes;
    uint    productPrice;
    State   itemState;
    address distributorID;
    address retailerID;
    address consumerID;
  }

  // Define 8 events with the same 8 state values and accept 'sku' as input argument
  event Harvested(uint sku);
  event Processed(uint sku);
  event Packed(uint sku);
  event ForSale(uint sku);
  event Sold(uint sku);
  event Shipped(uint sku);
  event Received(uint sku);
  event Purchased(uint sku);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address _address) {
    require(msg.sender == _address); 
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) { 
    require(msg.value >= _price); 
    _;
  }
  
  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint _sku) {
    _;
    uint _price = items[_sku].price;
    uint amountToReturn = msg.value - _price;
    items[_sku].buyer.transfer(amountToReturn);
  }

  // Define a modifier that checks if an item.state of a sku is Harvested
  modifier harvested(uint _sku) {
    require(items[_sku].state == State.Harvested);
    _;
  }

  // Define a modifier that checks if an item.state of a sku is Processed
  modifier processed(uint _sku) {
    require(items[_sku].state == State.Processed);
    _;
  }
  
  // Define a modifier that checks if an item.state of a sku is Packed
  modifier packed(uint _sku) {
    require(items[_sku].state == State.Packed);
    _;
  }

  // Define a modifier that checks if an item.state of a sku is ForSale
  modifier forSale(uint _sku) {
    require(items[_sku].state == State.ForSale);
    _;
  }

  // Define a modifier that checks if an item.state of a sku is Sold
  modifier sold(uint _sku) {
    require(items[_sku].state == State.Sold);
    _;
  }
  
  // Define a modifier that checks if an item.state of a sku is Shipped
  modifier shipped(uint _sku) {
    require(items[_sku].state == State.Shipped);
    _;
  }

  // Define a modifier that checks if an item.state of a sku is Received
  modifier received(uint _sku) {
    require(items[_sku].state == State.Received);
    _;
  }

  // Define a modifier that checks if an item.state of a sku is Purchased
  modifier purchased(uint _sku) {
    require(items[_sku].state == State.Purchased);
    _;
  }

  // In the constructor set 'owner' to the address that instantiated the contract
  // and set 'skuCount' to 0
  constructor() public payable {
    owner = msg.sender;
    skuCount = 0;
  }

  // Define a function 'kill' if required
  function kill() public {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }

  // Define a function 'harvestItem'
  function harvestItem(address _originFarmerID, string _originFarmName, string _originFarmInformation, string  _originFarmLatitude, string  _originFarmLongitude, string  _productNotes ) public 
  {
    // Emit the appropriate event
    emit Harvested(skuCount);
    // Add the new item as part of Harvest
    items[skuCount] = Item
    ({
      sku: skuCount,
      ownerID: _originFarmerID,
      productID: 0,
      productUPC: 0,
      originFarmerID: _originFarmerID,
      originFarmName: _originFarmName,
      originFarmInformation: _originFarmInformation,
      originFarmLatitude: _originFarmLatitude,
      originFarmLongitude: _originFarmLongitude,
      productNotes: _productNotes,
      productPrice: 0,
      itemState: State.Harvested,
      distributorID: 0,
      retailerID: 0,
      consumerID: 0
    });
    // Increment sku
    skuCount = skuCount + 1;
  }

  // Define a function 'processtItem'
  function processtItem(uint _sku, string _productID, string _productUPC ) public 
  {
    // Update the appropriate fields
    items[_sku].productID = _productID;
    items[_sku].productUPC = _productUPC;
    items[_sku].state = State.Processed;
    // Emit the appropriate event
    emit Processed(_sku);
  }


  // Define a function 'addItem' that allows one to add new items to the inventory
  function addItem(string _name, uint _price) public {
    // Emit the appropriate event
    emit ForSale(skuCount);
    // Add the new item into inventory and mark it for sale
    items[skuCount] = Item({name: _name, sku: skuCount, price: _price, state: State.ForSale, seller: msg.sender, buyer: 0});
    // Increment sku
    skuCount = skuCount + 1;
  }

  // Define a function 'buyItem' that allows one to purchase an item from the inventory
  // Update the buyer to person calling this function, and state to 'Sold'
  // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough, 
  // and any excess ether sent is refunded back to the buyer
  function buyItem(uint sku) public payable 
    // Call modifier to check if sku is for sale
    forSale(sku) 
    // Call modifer to check if buyer has paid enough
    paidEnough(items[sku].price) 
    // Call modifer to send any excess ether back to buyer
    checkValue(sku) {
    address buyer = msg.sender;
    uint  price = items[sku].price;
    // Update buyer
    items[sku].buyer = buyer;
    // Update state
    items[sku].state = State.Sold;
    // Transfer money to seller
    items[sku].seller.transfer(price);
    // emit the appropriate event
    emit Sold(sku);
  }

  // Define a function 'shipItem' that allows the seller to change the state to 'Shipped'
  // Use the above modifers to check if the item is sold, and invoker of this function is seller
  function shipItem(uint sku) public 
    // Call modifier to check if the item is sold
    sold(sku)
    // Call modifier to check if the invoker is seller
    verifyCaller(items[sku].seller) {
    // Update state
    items[sku].state = State.Shipped;
    // Emit the appropriate event
    emit Shipped(sku);
  }

  // Define a function 'receiveItem' that allows the buyer to update state
  // Use the above modifiers to check if the item is shipped, and the invoker of this function is buyer
  function receiveItem(uint sku) public 
    // Call modifier to check if the item is sold
    shipped(sku)
    // Call modifier to check if the invoker is buyer
    verifyCaller(items[sku].buyer) {
    // Update state
    items[sku].state = State.Received;
    // Emit the appropriate event
    emit Received(sku);
  }

  // Define a function 'fetchItem' that fetches the data
  function fetchItem(uint _sku) public view returns (string name, uint sku, uint price, uint state, address seller, address buyer) {
    name = items[_sku].name;
    sku = items[_sku].sku;
    price = items[_sku].price;
    state = uint(items[_sku].state);
    seller = items[_sku].seller;
    buyer = items[_sku].buyer;
    return (name, sku, price, state, seller, buyer);
  }

}

