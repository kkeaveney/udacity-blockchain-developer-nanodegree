
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
      //console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
    }
    let firstRegisteredOracle = await data.getOracleDetails(accounts[1], {from:owner});
    assert.equal(firstRegisteredOracle[0],true);
    let thirdRegisteredOracele = await data.getOracleDetails(accounts[3], {from:owner});
    assert.equal(thirdRegisteredOracele[0],true);
    let fourthRegisteredOracele = await data.getOracleDetails(accounts[4], {from:owner});
    assert.equal(fourthRegisteredOracele [0],true);
  });

  it('can request flight status', async () => {

    // ARRANGE
    let flight = 'ND1309'; // Course number
    let timestamp = Math.floor(Date.now() / 1000);

    // Submit a request for oracles to get status information for a flight
    await data.fetchFlightStatus(config.firstAirline, flight, timestamp);
    // ACT

    // Since the Index assigned to each test account is opaque by design
    // loop through all the accounts and for each account, all its Indexes (indices?)
    // and submit a response. The contract will reject a submission if it was
    // not requested so while sub-optimal, it's a good test of that feature
    for(let a=1; a<TEST_ORACLES_COUNT; a++) {

      // Get oracle information
      let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a]});
      for(let idx=0;idx<3;idx++) {

        try {
          // Submit a response...it will only be accepted if there is an Index match
          await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight, timestamp, STATUS_CODE_ON_TIME, { from: accounts[a] });

        }
        catch(e) {
          // Enable this when debugging
           console.log('\nError', idx, oracleIndexes[idx].toNumber(), flight, timestamp);
        }

      }
    }


  });



});
