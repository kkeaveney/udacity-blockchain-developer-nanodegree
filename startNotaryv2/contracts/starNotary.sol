pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

mapping(uint256 => string) public tokenIdToStarInfo;
mapping(uint256 => uint256) public starsForSale;

function createStar(string _name, uint256 _tokenId) public {

    tokenIdToStarInfo[_tokenId] = _name;

    _mint(msg.sender, _tokenId);
}


function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
    require(this.ownerOf(_tokenId) == msg.sender);

    starsForSale[_tokenId] = _price;
}

function buyStar(uint256 _tokenId) public payable {
    require(starsForSale[_tokenId] > 0);

    uint256 starCost = starsForSale[_tokenId];
    address starOwner = this.ownerOf(_tokenId);
    require(msg.value >= starCost);

    _removeTokenFrom(starOwner, _tokenId);
    _addTokenTo(msg.sender, _tokenId);

    starOwner.transfer(starCost);

    if(msg.value > starCost) {
        msg.sender.transfer(msg.value - starCost);
    }
  }
 }
