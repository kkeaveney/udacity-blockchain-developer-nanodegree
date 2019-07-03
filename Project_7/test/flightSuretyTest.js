
var FlightSuretyApp = artifacts.require("FlightSuretyApp");
var FlightSuretyData = artifacts.require("FlightSuretyData");
var BigNumber = require('bignumber.js');
var Test = require('../config/testConfig.js');

contract('Flight Surety Tests', async (accounts) => {

  let owner = accounts[0];


    it(`(multiparty) has correct initial isOperational() value`, async () => {

      // Get operating status
      let data =  await FlightSuretyData.deployed();
      let status = await data.isOperational.call();
      assert.equal(status, true, "Incorrect initial operating status value");

    });

    it(`(multiparty) has correct initial isOperational() value when called from the App contract`, async () =>  {

      // Get operating status
      let data =  await FlightSuretyApp.deployed();
      let status = await data.isOperational.call();
      assert.equal(status, true, "Incorrect initial operating status value");

    });

    it("deploys with contract owner registered as the initial airline", async () => {
      let data = await FlightSuretyApp.deployed();
      let status = await data.isAirlineRegistered.call(owner);
      let airlines = await data.numberOfRegisteredAirlines.call(owner);
      assert.equal(status,true, "Contract is not registered");
      assert.equal(airlines,1,"Only one airline should be registered");
      console.log('number of airlines',airlines.toNumber());
    });

    it("deploys with contract balance equal to zero", async() => {
          let data = await FlightSuretyApp.deployed();
          let balance = await data.contractBalance.call();
          assert.equal(balance, 0, "Balance should equal 0 have contact is deployed");
      });

      it("checks if first airline can send funds to the contract", async() => {
        let data = await FlightSuretyApp.deployed();
        let fee = await web3.toWei("10", "ether");
        let balanceBefore = await web3.eth.getBalance(owner);
        await data.fundAirline({from: owner, value: fee});
        let balance = await data.contractBalance.call();
        let balanceAfter = await web3.eth.getBalance(owner);
        assert.isAbove(Number(balanceBefore) - Number(balanceAfter), Number(fee));
        let airline = await data.getAirline.call(owner);
        let hasPaid = airline[0];
        assert.equal(hasPaid, true);
        console.log('airline',airline);
      });

      it("Only air-line users can register airlines", async() => {
    let user2 = accounts[1];
    let data = await FlightSuretyApp.deployed();
    let numAirlines = await data.getNumberOfAirlines.call();
    console.log('airlines number = ',numAirlines.toNumber());
  /*  assert.equal(numAirlines, 1, "Only one airline should be registered");
    let error;
    try {
        await instanceApp.registerAirline(user2, "Irish Airways", {from:user2});
    } catch(err) {
        error = true;
    }
    assert.equal(error, true, "Only air-line users can register airlines");
    */
});




  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

/*    it(` (multiparty) registers an airline when contract is deployed.`, async function () {

      // Ensure an airline has been registered
      let airlineCount = await this.flightSuretyData.getNumberOfAirlines.call();
      assert.equal(airlineCount, 1 , "Airline not registered on deployment");

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

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async function ()  {

    // ARRANGE
    let airlineTwo = accounts[2];
    let airlineThree = accounts[3];
    await this.flightSuretyData.setOperatingStatus(true);
    await this.flightSuretyData.authoriseCaller(airlineTwo);

     let isRegistered = true;
     try {

          await this.flightSuretyData.registerAirline(airlineThree, {from: airlineTwo});
      }
      catch(e) {
       isRegistered = false;
      }

      // ASSERT
      assert.equal(isRegistered, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it(`(Multiparty Consensus) Only existing airline may register a new airline until there are at least four airlines registered`, async function (){

    await this.flightSuretyData.setOperatingStatus(true);
    await this.flightSuretyData.authoriseCaller(firstAirline);
    await this.flightSuretyData.fundAirline({from: firstAirline, value:web3.toWei('10','ether')});

    let numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,1, "One Airline is expected to be registered");

    await this.flightSuretyData.registerAirline(secondAirline, {from: firstAirline});
    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,2, "Two Airlines are expected to be registered");


    await this.flightSuretyData.registerAirline(thirdAirline, {from: firstAirline});
    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,3, "Three Airlines are expected to be registered");


    await this.flightSuretyData.registerAirline(fourthAirline, {from: firstAirline});
    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,4, "Four Airlines are expected to be registered");

    await this.flightSuretyData.registerAirline(fifthAirline, {from: firstAirline});
    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,4, "Four Airlines are expected to be registered");


  });



    it(`(Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines`, async function (){

    await this.flightSuretyData.setOperatingStatus(true);
    await this.flightSuretyData.authoriseCaller(firstAirline);
    await this.flightSuretyData.fundAirline({from: firstAirline, value:web3.toWei('10','ether')});

    let numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,1, "One Airline is expected to be registered");

    await this.flightSuretyData.registerAirline(secondAirline, {from:firstAirline});
    await this.flightSuretyData.authoriseCaller(secondAirline);
    await this.flightSuretyData.fundAirline({from: secondAirline, value:web3.toWei('10','ether')});

    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,2, "Four Airlines are expected to be registered");

    await this.flightSuretyData.registerAirline(thirdAirline, {from:firstAirline});
    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,3, "Four Airlines are expected to be registered");

    await this.flightSuretyData.registerAirline(fourthAirline, {from:firstAirline});
    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,4, "Four Airlines are expected to be registered");

    await this.flightSuretyData.registerAirline(fifthAirline, {from:secondAirline});
    numberOfAirlines = await this.flightSuretyData.getNumberOfAirlines();
    assert.equal(numberOfAirlines,4, "Five Airlines are expected to be registered");


})
 it(`Airline can be registered, but does not participate in contract until it submits funding of 10 ether`, async function () {

   await this.flightSuretyData.setOperatingStatus(true);
   await this.flightSuretyData.authoriseCaller(firstAirline);
   await this.flightSuretyData.fundAirline({from: firstAirline, value:web3.toWei('10','ether')});

   let result =  await this.flightSuretyData.hasAirlinePaidFund(firstAirline);
   assert.equal(result, true, "Airline has paid fund");

   await this.flightSuretyData.registerAirline(secondAirline, {from:firstAirline});
   result =  await this.flightSuretyData.hasAirlinePaidFund(secondAirline);
   assert.equal(result, false, "Airline has Registered but not paid funds");

   result = await this.flightSuretyData.isCallerAuthorised(secondAirline);
   assert.equal(result,false, "Airline is Registered but not Authorised");


   let canParticipate = true;
   try {

        result = await this.flightSuretyData.registerAirline(thirdAirline, {from:secondAirline})
    }
    catch(e) {
     canParticipate = false;
    }

    assert.equal(canParticipate, false, "Airline is Registered but cannot participate")

})

*/


});
