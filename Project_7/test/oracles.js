
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
    let thirdRegisteredOracele = await data.getOracleDetails(accounts[3], {from:owner});
    assert.equal(thirdRegisteredOracele[0],true);
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

        }
        catch(e) {
          // Enable this when debugging
          //console.log(`\nError with oracle ${i}`, 0, oracleIndexes[0].toNumber(), flightID, departureDate);
        }


      let hash = await data.getFlightKey(owner, flightID, departureDate);
      let flightInfo = await data.getFlight(hash);
      //assert.equal("flightID = ", flightInfo[0],"IR01");
      console.log(flightInfo);

    }


  });

*/

});
