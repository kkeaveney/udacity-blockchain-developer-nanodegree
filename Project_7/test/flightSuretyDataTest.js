
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');
var Test = require('../config/testConfig.js');

contract('Flight Surety Tests', async (accounts) => {

  let owner = accounts[0];
  let firstAirline = accounts[1];

  // These test addresses are useful when you need to add
  // multiple users in test scripts
  let testAddresses = [
      "0x69e1CB5cFcA8A311586e3406ed0301C06fb839a2",
      "0xF014343BDFFbED8660A9d8721deC985126f189F3",
      "0x0E79EDbD6A727CfeE09A2b1d0A59F7752d5bf7C9",
      "0x9bC1169Ca09555bf2721A5C9eC6D69c8073bfeB4",
      "0xa23eAEf02F9E0338EEcDa8Fdd0A73aDD781b2A86",
      "0x6b85cc8f612d5457d49775439335f83e12b8cfde",
      "0xcbd22ff1ded1423fbc24a7af2148745878800024",
      "0xc257274276a4e539741ca11b590b9447b26a8051",
      "0x2f2899d6d35b1a48a4fbdc93a37a72f264a9fca7"
  ];

  beforeEach(async function (){
    this.flightSuretyData = await FlightSuretyData.new(firstAirline, {from : owner});
    this.flightSuretyApp = await FlightSuretyApp.new(this.flightSuretyData.address, {from: owner});
    await this.flightSuretyData.authoriseCaller(this.flightSuretyApp.address, {from : owner});
  })



  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/
    it(` (multiparty) registers an airline when contract is deployed.`, async function () {

      // Ensure an airline has been registered
      let airlineCount = await this.flightSuretyData.getNumberOfAirlines.call();
      assert.equal(airlineCount, 1 , "Airline not registered on deployment");

    });


    it(`(multiparty) has correct initial isOperational() value`, async function () {

      // Get operating status
      let status = await this.flightSuretyData.isOperational.call();
      assert.equal(status, true, "Incorrect initial operating status value");

    });

    it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await this.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try
      {
          await this.flightSuretyData.setOperatingStatus(false, { from: this.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try
      {
          await this.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await this.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try
      {
          await this.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");

      // Set it back for other tests to work
      await this.flightSuretyData.setOperatingStatus(true);

  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {

    // ARRANGE
    let newAirline = accounts[2];

    // ACT
    try {
        
        await this.flightSuretyApp.registerAirline(newAirline, {from: this.firstAirline});
    }
    catch(e) {

    }
    let result = await this.flightSuretyData.isAirlineRegistered.call(newAirline);

    // ASSERT
    assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it(`(Multiparty Consensus) Only existing airline may register a new airline until there are at least four airlines registered`, async () => {

    await this.flightSuretyData.setOperatingStatus(true);
  //  await this.flightSuretyData.authoriseCaller(this.firstAirline);
  //  await this.flightSuretyData.fundAirline({from: this.firstAirline, value:web3.toWei('10','ether')});




  });




});
