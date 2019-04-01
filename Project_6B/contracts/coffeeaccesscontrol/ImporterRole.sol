pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ImporterRole' to manage this role - add, remove, check
contract ImporterRole {

    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event ImporterAdded(address indexed account);
    event ImporterRemoved(address indexed account);

    // Define a struct 'distributors' by inheriting from 'Roles' library, struct Role
    Roles.Role private distributors;

    // In the constructor make the address that deploys this contract the 1st distributor
    constructor() public {
        _addImporter(msg.sender);
    }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyImporter() {
    require(isImporter(msg.sender));
    _;
  }

  // Define a function 'isImporter' to check this role
  function isImporter(address account) public view returns (bool) {
        return distributors.has(account);
  }

  // Define a function 'addImporter' that adds this role
  function addImporter(address account) public onlyImporter {
        _addImporter(account);
  }

  // Define a function 'renounceImporter' to renounce this role
  function renounceImporter() public {
        _removeImporter(msg.sender);
  }

  // Define an internal function '_addImporter' to add this role, called by 'addImporter'
  function _addImporter(address account) internal {
        distributors.add(account);
        emit ImporterAdded(account);

  }

  // Define an internal function '_removeImporter' to remove this role, called by 'removeImporter'
  function _removeImporter(address account) internal {
        distributors.remove(account);
        emit ImporterRemoved(account);
  }
}
