
var Test = require('../config/testConfig.js');
//var BigNumber = require('bignumber.js');
const FlightSuretyData = artifacts.require("FlightSuretyData");
const FlightSuretyApp =  artifacts.require("FlightSuretyApp");

contract('Oracles', async (accounts) => {

  before('setup contract', async () => {

  });

  const TEST_ORACLES_COUNT = 20;
  const STATUS_CODE_UNKNOWN = 0;
  const STATUS_CODE_ON_TIME = 10;
  const STATUS_CODE_LATE_AIRLINE = 20;
  const STATUS_CODE_LATE_WEATHER = 30;
  const STATUS_CODE_LATE_TECHNICAL = 40;
  const STATUS_CODE_LATE_OTHER = 50;
  owner = accounts[0];



  it('can register oracles', async () => {

    let data = await FlightSuretyApp.deployed();
    let fee = await data.REGISTRATION_FEE.call();

    // ACT
    for(let i=1; i<TEST_ORACLES_COUNT; i++) {
      await data.registerOracle({ from: accounts[i], value: fee });
      let result = await data.getMyIndexes.call({from: accounts[i]});
      console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
    }
    let firstRegisteredOracle = await data.getOracleDetails(accounts[1], {from:owner});
    assert.equal(firstRegisteredOracle[0],true);
    let thirdRegisteredOracele = await data.getOracleDetails(accounts[5], {from:owner});
    assert.equal(thirdRegisteredOracele[0],true);
<<<<<<< HEAD
    let fourthRegisteredOracele = await data.getOracleDetails(accounts[4], {from:owner});
    assert.equal(fourthRegisteredOracele [0],true);

    let oracleIndexes = await data.getMyIndexes.call({ from: accounts[1]});
    console.log(oracleIndexes[0].toNumber());
    console.log(oracleIndexes[1].toNumber());
    console.log(oracleIndexes[2].toNumber());

    
    let flightID = 'IR01'; // Course number
    let date = "2019-07-14T12:30:00Z";
    let departureDate = new Date(date).getTime();

    for(let i=1; i<TEST_ORACLES_COUNT; i++) {

      // Get oracle information
      let oracleIndexes = await data.getMyIndexes.call({ from: accounts[i]});


        try {
          // Submit a response...it will only be accepted if there is an Index match
          await data.submitOracleResponse(oracleIndexes[i], owner, flightID, departureDate, STATUS_CODE_ON_TIME, { from: accounts[i] });

        }
        catch(e) {
          // Enable this when debugging
          console.log(`\nError with oracle ${i}`, 0, oracleIndexes[0].toNumber(), flightID, departureDate);
        }

      }

  });

/*  it('can request flight status', async () => {

    // ARRANGE
    let data = await FlightSuretyApp.deployed();
    let flightID = 'IR01'; // Course number
    let date = "2019-07-14T12:30:00Z";
    let departureDate = new Date(date).getTime();

    // Submit a request for oracles to get status information for a flight
    await data.fetchFlightStatus(owner, flightID, departureDate);
    // ACT

    // Since the Index assigned to each test account is opaque by design
    // loop through all the accounts and for each account, all its Indexes (indices?)
    // and submit a response. The contract will reject a submission if it was
    // not requested so while sub-optimal, it's a good test of that feature
    for(let i=1; i<TEST_ORACLES_COUNT; i++) {

      // Get oracle information
      let oracleIndexes = await data.getMyIndexes.call({ from: accounts[i]});


        try {
          // Submit a response...it will only be accepted if there is an Index match
          await data.submitOracleResponse(oracleIndexes[i], owner, flightID, departureDate, STATUS_CODE_ON_TIME, { from: accounts[i] });
=======
  //  let fourthRegisteredOracele = await data.getOracleDetails(accounts[4], {from:owner});
  //  assert.equal(fourthRegisteredOracele[0],true);
  });

  it("checks if the first airline can send funds to the contract and change its 'isFunded' state", async() => {
      let instanceApp = await FlightSuretyApp.deployed();
      let airlineFee = await web3.utils.toWei("10", "ether");
      let airlineBalanceBefore = await web3.eth.getBalance(owner);
      await instanceApp.fundAirline({from: owner, value: airlineFee});
      let contractBalance = await instanceApp.contractBalance.call();
      let airlineBalanceAfter = await web3.eth.getBalance(owner);
      assert.isAbove(Number(airlineBalanceBefore) - Number(airlineBalanceAfter), Number(airlineFee));
      let airline = await instanceApp.getAirline.call(owner);
      let isFunded = airline[1];
      assert.equal(isFunded, true);
  });

  it("enables a funded airline to register a flight", async() => {
      let instanceApp = await FlightSuretyApp.deployed();
      let airline1 = owner;
      let airline1Details = await instanceApp.getAirline.call(airline1);
      // the first airline should be funded
      assert.equal(airline1Details[1], true);
      let dateString = "2019-04-28T14:45:00Z"
      let departureDate = new Date(dateString).getTime();
      //departureDate = departureDate 1000;
      //console.log(departureDate);
      await instanceApp.registerFlight("FR109", "WAW", "LON", departureDate, {from:airline1});
      let numFlights = await instanceApp.getNumberOfFlights.call();
      //console.log(Number(numFlights));
      assert.equal(numFlights, 1);
      let flightHash = await instanceApp.getFlightKey.call(airline1, "FR109", departureDate);
      let flightInfo = await instanceApp.getFlight(flightHash);
      // the flight code is correct
      assert.equal(flightInfo[3], "FR109");
      // the flight is registered but not insured yet
      assert.equal(flightInfo[1], true);
      assert.equal(flightInfo[2], false);
      assert.equal(flightInfo[6], departureDate);
      assert.equal(flightInfo[0], airline1);
  });
>>>>>>> e61c99f9ab8bf5231c60c35ea8b2863cb81f6815

  it('can request flight status', async () => {
      let instanceApp = await FlightSuretyApp.deployed();
      let flight = 'FR109'; // flight code
      let dateString = "2019-04-28T14:45:00Z"
      let departureDate = new Date(dateString).getTime();
      //Submit a request for oracles to get status information for a flight
      await instanceApp.fetchFlightStatus(owner, flight, departureDate);

      let isOracle1Reg = await instanceApp.getOracleDetails(accounts[1]);
      //   console.log("Is Account 1 Oracle ",isOracle1Reg[0]);
      //   console.log("Account indexes" , Number(isOracle1Reg[1][0]), Number(isOracle1Reg[1][1]), Number(isOracle1Reg[1][2]));
      var numResponses = 0;
      for(let a=1; a<=TEST_ORACLES_COUNT -1; a++) {
      //
      var isOracleReg = await instanceApp.getOracleDetails(accounts[a]);
      console.log("isOracleRegistered" ,  isOracleReg);
      let oracleIndexes = await instanceApp.getMyIndexes.call({ from: accounts[a]});

      try {
    //      // Submit a response...it will only be accepted if there is an Index match
        await instanceApp.submitOracleResponse(oracleIndexes[0], owner, flight, departureDate, STATUS_CODE_ON_TIME, { from: accounts[a] });
        numResponses+=1;
    //       let numFlights = await instanceApp.howManyFlights.call();
    //       console.log(Number(numFlights));
        } catch(e) {
    //       // Enable this when debugging
    //       console.log(e);
          console.log(`\nOracle no. ${a} not chosen`, 0, oracleIndexes[0].toNumber(), flight, departureDate);
        }
<<<<<<< HEAD
        catch(e) {
          // Enable this when debugging
          //console.log(`\nError with oracle ${i}`, 0, oracleIndexes[0].toNumber(), flightID, departureDate);
        }


      let hash = await data.getFlightKey(owner, flightID, departureDate);
      let flightInfo = await data.getFlight(hash);
      //assert.equal("flightID = ", flightInfo[0],"IR01");
      console.log(flightInfo);

=======
>>>>>>> e61c99f9ab8bf5231c60c35ea8b2863cb81f6815
    }
    console.log("Num valid responses: ", numResponses)
    if (numResponses >= 3) {
        console.log("Num valid responses: ", numResponses)
        let flightHash = await instanceApp.getFlightKey(owner, flight, departureDate);
        let flightInfo = await instanceApp.getFlight(flightHash);
        assert.equal(flightInfo[0], "FR109");
        assert.equal(flightInfo[3], STATUS_CODE_ON_TIME);
    }

  });

*/

});
