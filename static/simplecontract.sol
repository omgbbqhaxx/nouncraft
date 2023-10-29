// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract NounCraft {
    address payable private _owner;
    
    // Using structs to define complex data types
    struct Product {
       address lister;
       string productImage;
       string productURL;
       uint256 productPrice;
       string productExplanation;
       bool isDelisted;
    }

    struct Order {
       bool isBought;
    }

    // Using mappings for efficient data retrieval
    mapping(uint256 => Product) private _products;
    mapping(string => Order) private _orders;

    uint256 private _productCount;

    // Events for logging state changes
    event ProductListed(address indexed lister, uint256 productId);
    event ProductPriceChanged(address indexed lister, uint256 productId, uint256 newPrice);
    event ProductDelisted(address indexed lister, uint256 productId);

    // Modifiers for reusable code and input validation
    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner can perform this action");
        _;
    }

    modifier productExists(uint256 productId) {
        require(productId > 0 && productId <= _productCount, "Product does not exist");
        _;
    }

    modifier onlyProductLister(uint256 productId) {
        require(msg.sender == _products[productId].lister, "Only the product lister can perform this action");
        _;
    }

    // Constructor to initialize contract state
    constructor() {
        _owner = payable(msg.sender);
    }

    // Public function to list a product
    function listProduct(string memory productImage, string memory productURL, uint256 productPrice, string memory productExplanation) public {
        require(bytes(productImage).length > 0, "Product image URL is required");
        require(bytes(productURL).length > 0, "Product URL is required");
        require(productPrice > 0, "Product price must be greater than 0");
        require(bytes(productExplanation).length > 0, "Product explanation is required");

        _productCount++;
        _products[_productCount] = Product({
            lister: msg.sender,
            productImage: productImage,
            productURL: productURL,
            productPrice: productPrice,
            productExplanation: productExplanation,
            isDelisted: false
        });

        emit ProductListed(msg.sender, _productCount);
    }

    // Public view function to get product details
    function getProduct(uint256 productId) public view productExists(productId) returns (Product memory) {
        return _products[productId];
    }

    // Public view function to get the number of products
    function productCount() public view returns (uint256) {
        return _productCount;
    }

    // Public function to change the price of a product
    function changeProductPrice(uint256 productId, uint256 newPrice) public onlyProductLister(productId) {
        require(newPrice > 0, "New price must be greater than 0");
        _products[productId].productPrice = newPrice;
        emit ProductPriceChanged(msg.sender, productId, newPrice);
    }

    // Public function to delist a product
    function delistProduct(uint256 productId) public onlyProductLister(productId) {
        _products[productId].isDelisted = true;
        emit ProductDelisted(msg.sender, productId);
    }

    // Public function to transfer ownership of the contract
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        _owner = newOwner;
    }

    // Public function to withdraw funds from the contract
    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(_owner).transfer(amount);
    }

    // Utility function to convert a uint256 to a string
    function uintToString(uint256 v) internal pure returns (string memory str) {
        if (v == 0) {
            return "0";
        }
        uint256 temp = v;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (v != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(v % 10)));
            v /= 10;
        }
        return string(buffer);
    }

    // Public view function to get a hash derived from the sender's address
    function nAddrHash() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(msg.sender))) % 10000000000;
    }

    // Public pure function to get a hash derived from an arbitrary address
    function nAddrHashx(address x) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(x))) % 10000000000;
    }

    // Utility function to concatenate two strings with a separator
    function append(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, "-", b));
    }

    // Public view function to get the hash of the previous block
    function getblockhash() public view returns (uint256) {
        return uint256(blockhash(block.number - 1));
    }

    // Public payable function to purchase a product
    function buyproduct(uint256 productID) public payable {
        require(msg.value <= _products[productID].productPrice , "Insufficient balance");

        string memory x = append(uintToString(nAddrHash()), uintToString(productID));
        _orders[x].isBought = true;
        payable(_owner).transfer(msg.value);
    }

    // Public view function to check if a product has been purchased by a specific address
    function checkDownload(address buyer, uint256 productID) public view returns (bool) {
        string memory x = append(uintToString(nAddrHashx(buyer)), uintToString(productID));
        return _orders[x].isBought;
    }
}
