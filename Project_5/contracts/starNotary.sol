pragma solidity >0.4.0 <0.6.0;



import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

    // name and a symbol for starNotary tokens
    string public constant name = 'StarToken';
    string public constant symbol = 'KST';

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string memory _name, uint256 _tokenId) public {
        Star memory newStar = Star(_name);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

    //Add a function lookUptokenIdToStarInfo, that looks up the stars using the Token ID,
    //and then returns the name of the star.

    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns(string memory) {
        require(bytes(tokenIdToStarInfo[_tokenId].name).length > 0);

        return tokenIdToStarInfo[_tokenId].name;
    }

    // Add a function called exchangeStars, so 2 users can exchange their star tokens.
    // Do not worry about the price, just write code to exchange stars between users.

    function exchangeStars(uint256 _senderTokenId, uint256 _receiverTokenId) public {
        require(ownerOf(_senderTokenId) == msg.sender, 'This token does not belong to you.');

        _removeTokenFrom(msg.sender, _senderTokenId);
        _addTokenTo(ownerOf(_receiverTokenId), _senderTokenId);

        _removeTokenFrom(ownerOf(_receiverTokenId), _receiverTokenId);
        _addTokenTo(msg.sender, _receiverTokenId);

        starsForSale[_senderTokenId] = 0;
        starsForSale[_receiverTokenId] = 0;
    }

    // Write a function to Transfer a Star. The function should transfer a star from the address of the caller.
    // The function should accept 2 arguments, the address to transfer the star to, and the token ID of the star.

    function transferStar(uint256 _tokenId, address _to) public {
        require(ownerOf(_tokenId) == msg.sender, 'This token dose not belong to you.');

        safeTransferFrom(msg.sender, _to, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starValue = starsForSale[_tokenId];
        address starOwner = ownerOf(_tokenId);
        require(msg.value >= starValue);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starValue);

        if(msg.value > starValue) {
            msg.sender.transfer(msg.value - starValue);
        }
        starsForSale[_tokenId] = 0;
      }
}
