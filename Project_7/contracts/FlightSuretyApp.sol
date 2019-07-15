pragma solidity ^0.4.24;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    address private contractOwner;          // Account used to deploy contract

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;
        address airline;
    }

    mapping(bytes32 => Flight) private flights;

    bool private operational = true;

    uint numberOfInsurances = 0;

    FlightSuretyData flightSuretyData;


    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational()
    {
         // Modify to call data contract's status
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor(address newContract) public
    {
        contractOwner = msg.sender;
        flightSuretyData = FlightSuretyData(newContract);
        registerAirline(contractOwner);
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isOperational() public view returns(bool)
    {
        return operational;  // Modify to call data contract's status
    }

    function setOperatingStatus(bool status) external requireContractOwner {
        operational = status;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/


   /**
    * @dev Add an airline to the registration queue
    *
    */
    function registerAirline(address airline) public
    {
        flightSuretyData.registerAirline(airline);
    }


   /**
    * @dev Register a future flight for insuring.
    *
    */
    function registerFlight(string memory flightNumber, string memory departure, string memory destination, uint256 departureDate) public {
      flightSuretyData.registerFlight(flightNumber,departure,destination,departureDate);
    }


    function isAirlineRegistered(address airline) public view returns(bool) {
      return flightSuretyData.isAirlineRegistered(airline);
    }

    function airlinesListCount(address airline) public view returns (uint) {
      return flightSuretyData.airlinesListCount(airline);
    }

    function contractBalance() public view returns(uint) {
      return flightSuretyData.contractBalance();
    }

    function getNumberOfAirlines() external view returns(uint) {

      return flightSuretyData.getNumberOfAirlines();
    }

    function getNumberOfFlights() external view returns (uint) {
      return flightSuretyData.getNumberOfFlights();
    }



    function buyInsurance(address airlineAddress, uint departureDate, string memory flightID) public payable {
        flightSuretyData.buyInsurance.value(msg.value)(airlineAddress, departureDate, flightID);
    }

    function fundAirline() public payable {
        flightSuretyData.fundAirline.value(msg.value)(msg.sender);

    }

    function getAirline(address airlineAddress) public view returns(address, bool, bool, address[]) {
        return flightSuretyData.getAirline(airlineAddress);
    }

    function vote(address airlineAddress) public {
        flightSuretyData.vote(airlineAddress);
    }

    function voteCount(address airlineAddress) public view returns(uint) {
        return flightSuretyData.voteCount(airlineAddress);
    }

    function hasInsurance(address airlineAddress, address passengerAddress, string flightID, uint departureDate) public view returns(bool) {
        return flightSuretyData.hasInsurance(airlineAddress, passengerAddress, flightID, departureDate);
    }

    function insuranceTotal(address passengerAddress, bytes32 flightHash) public view returns(uint) {
        return flightSuretyData.insuranceTotal(passengerAddress, flightHash);
    }

    function updateFlightDetails(bytes32 flightHash, uint8 status) internal {
            flightSuretyData.updateFlightDetails(flightHash, status);
    }

   /**
    * @dev Called after oracle has updated flight status
    *
    */
    function processFlightStatus(address airline,string memory flightID, uint256 departureDate, uint8 statusCode)public

    {
      bytes32 flightHash = getFlightKey(airline, flightID, departureDate);
      updateFlightDetails(flightHash, statusCode);
      if(statusCode == STATUS_CODE_LATE_AIRLINE) {
        flightSuretyData.creditInsurees(flightHash);
      }
    }


    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus(address airline,string flight, uint256 timestamp) external
    {
        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        oracleResponses[key] = ResponseInfo({ requester: msg.sender,isOpen: true });

        emit OracleRequest(index, airline, flight, timestamp);
    }


// region ORACLE MANAGEMENT

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;


    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
                                                        // This lets us group responses and identify
                                                        // the response that majority of the oracles
    }

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);

    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);


    // Register an oracle with the contract
    function registerOracle() external payable
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required");

        uint8[3] memory indexes = generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({
                                        isRegistered: true,
                                        indexes: indexes
                                    });
    }

    function getMyIndexes() view external returns(uint8[3])
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");
        return oracles[msg.sender].indexes;
    }
    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse(uint8 index, address airline,string flight, uint256 timestamp, uint8 statusCode) external
    {
        require((oracles[msg.sender].indexes[0] == index) || (oracles[msg.sender].indexes[1] == index) || (oracles[msg.sender].indexes[2] == index), "Index does not match oracle request");


        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");

        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {

            emit FlightStatusInfo(airline, flight, timestamp, statusCode);

            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }


    function getFlightKey(address airline, string flight, uint256 timestamp) pure public returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    function getFlight(bytes32 flightHash) public view returns(
      address airline,
      bool isRegistered,
      bool isInsured,
      string flightID,
      string source,
      string destination,
      uint256 departureDate,
      uint8 statusCode) {
        return flightSuretyData.getFlight(flightHash);
    }



    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes(address account) internal returns(uint8[3])
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);

        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex(address account) internal returns (uint8)
    {
        uint8 maxValue = 10;
        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

// endregion

}

  contract FlightSuretyData {
    function registerAirline(address airline) external;
    function buyInsurance(address airlineAddress, uint departureDate, string memory flightID) public payable;
    function creditInsurees(bytes32 flightHash) external;
    function contractBalance() public view returns(uint);
    function isAirlineRegistered(address airlineAddress) public view returns(bool);
    function airlinesListCount(address airlineAddress) public view returns(uint);
    function fundAirline(address airlineAddress) external payable;
    function getAirline(address airlineAddress) public view returns(address, bool, bool, address[]);
    function getNumberOfAirlines() external view returns(uint);
    function vote(address airlineAddress) public;
    function voteCount(address airlineAddress) public view returns(uint);
    function registerFlight(string memory flightNumber, string memory departure, string memory destination, uint256 departureDate) public;
    function getNumberOfFlights() external view returns (uint);
    function getFlightKey(address airline, string flight, uint256 timestamp) pure internal returns(bytes32);
    function getFlight(bytes32 flightHash) public view returns(
      address airline,
      bool isRegistered,
      bool isInsured,
      string flightID,
      string source,
      string destination,
      uint256 departureDate,
      uint8 statusCode);
      function hasInsurance(address airlineAddress, address passengerAddress, string flightID, uint departureDate) public view returns(bool);
      function insuranceTotal(address passengerAddress, bytes32 flightHash) external view returns(uint);
      function updateFlightDetails(bytes32 flightHash, uint8 status) external;
  }
