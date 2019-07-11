pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    uint constant CONSENSEUS_THRESHOLD = 4;
    uint constant JOINING_FEE = 10 ether;

    struct Flight {
      address airline;
      bool isRegistered;
      bool isInsured;
      string flightID;
      string source;
      string destination;
      uint256 departureDate;
      uint8 statusCode;
    }

    mapping(bytes32 => Flight) private flights;

    struct Airline {
      address airlineAddress;
      bool hasPaid;
      bool isRegistered;
      address[] registeredAirlines;
    }



    mapping(address => bytes32[]) private insurances;
    

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    uint numberOfAirlines = 0;
    uint numberOfFlights = 0;
    mapping(address => uint) private authorisedContracts;
    mapping(address => Airline) private airlines;

    mapping(address => uint) passengerAccountToRefund;

    Airline[] private airlinesList;
    Flight[] private flightsList;
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor(address firstAirline) public
    {
        contractOwner = msg.sender;

    }

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

    modifier requireAuthorisedCaller() {
      require(isCallerAuthorised(msg.sender), "Caller must be authorised");
      _;
    }



    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */
    function isOperational() public view returns(bool)
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus(bool mode) external requireContractOwner
    {
        operational = mode;
    }

    function getNumberOfAirlines() external view returns(uint) {
     return airlinesList.length;
    }

    function authoriseCaller(address caller) external requireContractOwner {
      authorisedContracts[caller] = 1;
    }

    function isCallerAuthorised(address caller) public view returns(bool){
      return authorisedContracts[caller] == 1;
    }

    function unAuthoriseCaller(address caller) external requireContractOwner {
      delete authorisedContracts[caller];
    }

    function getInsuranceKey(address passenger, string flightNumber) pure internal returns(bytes32){
      return keccak256(abi.encodePacked(passenger, flightNumber));
    }

    function isAirlineRegistered(address airline) public view returns(bool) {
      return airlines[airline].isRegistered;
    }

    function hasAirlinePaidFund(address airline) external view returns (bool){
      return airlines[airline].hasPaid;
    }

    function airlinesListCount(address airline) public view returns(uint){
      return airlinesList.length;
    }

    function getNumberOfFlights() external view returns(uint) {
     return  flightsList.length;
    }



    function contractBalance() public view returns(uint) {
      return address(this).balance;
    }

    function getAirline(address airlineAddress) external view returns(address, bool, bool, address[]) {
        Airline memory airline = airlines[airlineAddress];
        return (airline.airlineAddress, airline.hasPaid, airline.isRegistered, airline.registeredAirlines);
    }

    function registerFlight(string memory flightID, string memory departure, string memory destination, uint256 departureDate) public {
      require(airlines[tx.origin].hasPaid);
      bytes32 flightHash = getFlightKey(tx.origin, flightID, departureDate);

      Flight memory newFlight = Flight({
          airline: tx.origin,
          isRegistered:true,
          isInsured:false,
          flightID: flightID,
          source: departure,
          destination: destination,
          departureDate: departureDate,
          statusCode:0
        });
        numberOfFlights = flightsList.push(newFlight);
        flights[flightHash] = newFlight;

      }

      function hasInsurance(address airlineAddress, address passengerAddress, string flightID, uint departureDate) public view returns(bool) {
        bool hasInsurance = false;
        bytes32 flightHash = getFlightKey(airlineAddress, flightID, departureDate);
        for (uint i = 0; i < insurances[passengerAddress].length; i++) {
            if (insurances[passengerAddress][i] == flightHash) {
                hasInsurance = true;
                break;
            }
        }
        return hasInsurance;
    }

      function buyInsurance(address airlineAddress, uint departureDate, string flightID) external payable {

        require(msg.value <= 1 ether, "insurance must be less than than 1 ethetr");
        require(!hasInsurance(airlineAddress, tx.origin, flightID, departureDate),"User has already bought insurance for this flight");
        bytes32 flightHash = getFlightKey(airlineAddress,flightID, departureDate);
        insurances[tx.origin].push(flightHash);

        //address(flightSuretyData).transfer(msg.value);
        //flightSuretyData.buyInsurance(msg.sender, flight, msg.value);
        //numberOfInsurances = numberOfInsurances + 1;
      }





    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */
    function registerAirline(address airlineAddress) external requireIsOperational
    {

      require(!airlines[airlineAddress].isRegistered, "Airline is already registered");

        if(numberOfAirlines < CONSENSEUS_THRESHOLD) {
            Airline memory airline1 = Airline({
              airlineAddress: airlineAddress,
              hasPaid: false,
              isRegistered: true,
              registeredAirlines: new address[](0)
            });
            numberOfAirlines = airlinesList.push(airline1);
            airlines[airlineAddress] =  airline1;
            }  else {
              Airline memory airline2 = Airline({
                airlineAddress: airlineAddress,
                hasPaid: false,
                isRegistered: false,
                registeredAirlines: new address[](0)
              });
              numberOfAirlines = airlinesList.push(airline2);
              airlines[airlineAddress] =  airline2;
          }
        }

    function unRegisterAirline(address airline) external requireAuthorisedCaller requireIsOperational {
      require(airlines[airline].isRegistered, "airline is not registered");
      delete airlines[airline];
      numberOfAirlines = numberOfAirlines.sub(1);
    }

    function vote(address airlineAddress) public requireIsOperational {

        Airline storage currentAirline = airlines[airlineAddress];
        currentAirline.registeredAirlines.push(tx.origin);
        if(currentAirline.registeredAirlines.length > (numberOfAirlines.div(2))){
          currentAirline.isRegistered = true;
        }
    }

    function voteCount(address airlineAddress) external view returns(uint) {
        return airlines[airlineAddress].registeredAirlines.length;
    }




   /**
    * @dev Buy insurance for a flight
    *
    */
    event InsuranceBought(address passenger, string flightNumber, uint cost);




      function withdraw() external requireIsOperational {
      uint refund = passengerAccountToRefund[msg.sender];
      passengerAccountToRefund[msg.sender] = 0;
      msg.sender.transfer(refund);
    }


    function myBalance() external view returns (uint) {
      return passengerAccountToRefund[msg.sender];
    }

    function fundAirline(address airlineAddress) external payable requireIsOperational  {
      require(msg.value >= JOINING_FEE, "Value is too low");
      require(airlines[airlineAddress].isRegistered, "Caller is not registered as an airline");
      require(!airlines[airlineAddress].hasPaid, "Caller funds already paid");

      airlines[airlineAddress].hasPaid = true;
      uint refund = msg.value - JOINING_FEE;
    }
    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay() pure {

    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */
    function fund() public payable
    {
    }

    function getFlightKey(address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32)
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
      uint8 statusCode){
        Flight memory flight = flights[flightHash];
        return(flight.airline, flight.isRegistered, flight.isInsured, flight.flightID, flight.source,  flight.destination,flight.departureDate, flight.statusCode);
      }



    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() external payable
    {
        fund();
    }


}
