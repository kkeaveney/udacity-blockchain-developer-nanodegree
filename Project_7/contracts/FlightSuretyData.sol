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
      address[] insuredPassengers;
    }

    mapping(bytes32 => Flight) private flights;

    struct Airline {
      address airlineAddress;
      bool hasPaid;
      bool isRegistered;
      address[] registeredAirlines;

    }



    mapping(address => bytes32[]) private insurances;
    mapping(address => mapping(bytes32 => uint256)) private insuranceBalance;


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

    function updateFlightDetails(bytes32 flightHash, uint8 status) external {
        Flight storage updatedFlight = flights[flightHash];
        updatedFlight.statusCode = status;
    }





    function contractBalance() public view returns(uint) {
      return address(this).balance;
    }

    function getAirline(address airlineAddress) external view returns(address, bool, bool, address[]) {
        Airline memory airline = airlines[airlineAddress];
        return (airline.airlineAddress, airline.hasPaid, airline.isRegistered, airline.registeredAirlines);
    }

    function getAirlineByNum(uint airlineNum) external view returns(address, bool, bool, address[]) {
        Airline memory airline = airlinesList[airlineNum];
        return (airline.airlineAddress, airline.hasPaid, airline.isRegistered, airline.registeredAirlines);
    }

    function registerFlight(string flightID, string departure, string destination, uint256 departureDate) external {
      require(airlines[tx.origin].hasPaid,"Airline is not funded");
      bytes32 flightHash = getFlightKey(tx.origin, flightID, departureDate);
      require(!flights[flightHash].isRegistered, "This flight is already registered");

      Flight memory newFlight = Flight({
          airline: tx.origin,
          isRegistered:true,
          isInsured:false,
          flightID: flightID,
          source: departure,
          destination: destination,
          departureDate: departureDate,
          statusCode:0,
          insuredPassengers:new address[](0)
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

        insuranceBalance[tx.origin][flightHash] = msg.value;
        Flight storage newFlight = flights[flightHash];
        newFlight.insuredPassengers.push(tx.origin);

        //address(flightSuretyData).transfer(msg.value);
        //flightSuretyData.buyInsurance(msg.sender, flight, msg.value);
        //numberOfInsurances = numberOfInsurances + 1;
      }

      function insuranceTotal(address passengerAddress, bytes32 flightHash) external view returns(uint) {
          return insuranceBalance[passengerAddress][flightHash];
      }

      function creditInsurees(bytes32 flightHash) {
            Flight storage updatedFlight = flights[flightHash];
              for(uint i = 0; i < updatedFlight.insuredPassengers.length; i++) {
                  address insuredpassengerAddress = updatedFlight.insuredPassengers[i];
                  insuranceBalance[insuredpassengerAddress][flightHash] = insuranceBalance[insuredpassengerAddress][flightHash].mul(15);
                  insuranceBalance[insuredpassengerAddress][flightHash] = insuranceBalance[insuredpassengerAddress][flightHash].div(10);
              }
      }


      function getInsuredFlights(address passengerAddress, uint index) external view returns(bytes32) {
        return insurances[passengerAddress][index];
      }

      function getInsuredKeysLength(address passengerAddress) external view returns(uint256) {
        return insurances[passengerAddress].length;
      }

      function getInsuranceBalance(address passengerAddress, bytes32 flightKey) external view returns(uint) {
        return insuranceBalance[passengerAddress][flightKey];
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
      require(!airlineExistance(airlineAddress),"Airline already exsists");


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
        require(!votedAlready(tx.origin, airlineAddress),"Airline has already been voted by sender Address");
        require(!airlines[airlineAddress].isRegistered, "Airline is already registered");
        Airline storage currentAirline = airlines[airlineAddress];
        currentAirline.registeredAirlines.push(tx.origin);
        if(currentAirline.registeredAirlines.length > (numberOfAirlines.div(2))){
          currentAirline.isRegistered = true;
        }
    }

    function voteCount(address airlineAddress) external view returns(uint) {
        return airlines[airlineAddress].registeredAirlines.length;
    }

    function votedAlready(address voter, address airlineAddress) public view returns(bool) {
      bool voted = false;
      for(uint i = 0; i < airlines[airlineAddress].registeredAirlines.length; i++) {
        if(airlines[airlineAddress].registeredAirlines[i] == voter)
          voted = true;
          break;
      }
      return voted;
    }

    function airlineExistance(address _address) public view returns(bool) {
      bool exsists = false;
      for(uint i = 0; i < airlinesList.length; i++) {
        if(airlines[_address].airlineAddress == _address)
          exsists = true;
          break;
      }
      return exsists;
    }

    function insureFlight(string flightID, uint256 departureDate) external requireIsOperational {
      bytes32 flightHash = getFlightKey(tx.origin, flightID, departureDate);
      require(flights[flightHash].airline == tx.origin);
      Flight storage updatedFlight = flights[flightHash];
      updatedFlight.isInsured = true;
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
    function payOut(bytes32 flightHash, uint value) external requireIsOperational{
      require(insuranceBalance[tx.origin][flightHash] >= value, "Insufficient funds");
      insuranceBalance[tx.origin][flightHash] = insuranceBalance[tx.origin][flightHash].sub(value);
      tx.origin.transfer(value);
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */
    function fund() public payable
    {
    }

    function getFlightKey(address airline, string flight, uint256 timestamp) pure internal returns(bytes32)
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
      uint8 statusCode,
      address[] insuredPassengers){
        Flight memory flight = flights[flightHash];
        return(flight.airline,
          flight.isRegistered,
          flight.isInsured,
          flight.flightID,
          flight.source,
          flight.destination,
          flight.departureDate,
          flight.statusCode,
          flight.insuredPassengers);
      }

      function getFlightByNum(uint flightNum) external view returns(address, bool, bool, string memory, string memory, string memory, uint256, uint8, address[]) {
        Flight memory flight = flightsList[flightNum];
        return (
          flight.airline,
          flight.isRegistered,
          flight.isInsured,
          flight.flightID,
          flight.source,
          flight.destination,
          flight.departureDate,
          flight.statusCode,
          flight.insuredPassengers);
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
