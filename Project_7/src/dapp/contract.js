import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
  constructor(network, callback) {

      let config = Config[network];
      this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
      this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
      this.initialize(callback);
      this.owner = null;
      this.airlines = [];
      this.passengers = [];
      this.users = [];
      this.allAccounts = [];
  }

  async initialize(callback) {

      try {
          let accts = await this.web3.eth.getAccounts();
          this.allAccounts = accts;
          this.owner = accts[0];
          let counter = 1;
          let numAirlines = await this.getNumberOfAirlines();
          console.log(numAirlines);
          if (numAirlines == 1) {
              this.airlines.push(this.owner);
              while(this.airlines.length < 4) {
                  this.airlines.push(accts[counter++]);
              }
          } else {
              for (let c = 0; c < numAirlines; c++) {
                  let airlineInfo = await this.getAirlineByNum(c);
                  this.airlines.push(airlineInfo[0]);
                  counter++
              }
          }

          while(this.passengers.length < 5) {
              this.passengers.push(accts[counter++]);
          }

          while(accts.length - counter > 0) {
              this.users.push(accts[counter++]);
          }


          callback();
      } catch(error) {
          console.log(error);
      }

  }
      async registerAirline(senderAddress, airlineAddress, airlineName) {
        let self = this;
        return await self.flightSuretyApp.methods
        .registerAirline(airlineAddress)
        .send({from: senderAddress, gas:500000});
      }

      async contractBalance() {
        let self = this;
        return await self.flightSuretyApp.methods
            .contractBalance()
            .call();
    }
      async getAirline(airlineAddress) {
        let self = this;
        let airline = await self.flightSuretyApp.methods.getAirline(airlineAddress).call();
        return airline;
    }

     async getNumberOfAirlines() {
         let self = this;
         let airlineCount = await self.flightSuretyApp.methods.getNumberOfAirlines().call();
         return airlineCount;
     }


     async getAirlineByNum(airlineNum) {
        let self = this;
        let airline = await self.flightSuretyApp.methods.getAirlineByNum(airlineNum).call();
        return airline;
    }

    async setStatus(address, mode) {
      let self = this;
      return await self.flightSuretyApp.methods
        .setOperatingStatus(mode)
        .send({from:address});
    }

    async getOperatingStatus() {
        let self = this;
        return await self.flightSuretyApp.methods
            .isOperational()
            .call();
    }

    async getNumberOfAirlines() {
      let self = this;
      return await self.flightSuretyApp.methods
      .getNumberOfAirlines()
      .call();
    }

    async fundAirline(airlineAddress) {
      let self = this;
      let fee = await self.web3.utils.toWei("10", "ether");
      return await self.flightSuretyApp.methods
      .fundAirline()
      .send({from:airlineAddress, value:fee});
    }

    async registerFlight(airline, flightID, departure, destination, departureDate) {
      console.log("Registering Flight");
      let self = this;
       return await self.flightSuretyApp.methods
     .registerFlight(flightID, departure ,destination, departureDate)
     .send({from:airline, gas:1000000});
    }

    async getNumberOfFlights(){
      let self = this;
      return await self.flightSuretyApp.methods
      .getNumberOfFlights()
      .call();
    }

   async getAirlineByNumber(airlineNumber){
     let self = this;
     return await self.flightSuretyApp.methods
     .getAirlineByNum(airlineNumber)
     .call();
   }

   async getFlightByNum(flightID) {
     let self = this;
     return await self.flightSuretyApp.methods
     .getFlightByNum(flightID)
     .call();
   }

   async getFlightKey(address, flightID, departDate) {
     let self = this;
     let key = await self.flightSuretyApp.methods
     .getFlightKey(address, flightID, departDate)
     .call();
    return key;
   }

   async getFlight(key){
     let self = this;
     return await self.flightSuretyApp.methods
     .getFlight(key)
     .call();
   }


   async vote(address, voter) {
     let self = this;
     return await self.flightSuretyApp.methods
     .vote(address)
     .send({from:voter});
   }

   async insureFlight(airline, flightID, departureDate) {
     let self = this;
     return await self.flightSuretyApp.methods
     .insureFlight(flightID, departureDate)
     .send({from:airline});
   }

   async buyInsurance(passengerAddress, address, departureDate, flightID, insurancePremium) {
       let self = this;
       return await self.flightSuretyApp.methods
           .buyInsurance(address,departureDate,flightID)
           .send({ from: passengerAddress, value: insurancePremium, gas: 5000000});

    }

    async getFlightStatus(passenger,address, flightID, departDate){
      let self = this;
      return await self.flightSuretyApp.methods
      .fetchFlightStatus(address,flightID, departDate)
      .send({from:passenger, gas: 500000});

    }

    async getInsuredKeysLength(passengerAddress) {
      let self = this;
      return await self.flightSuretyApp.methods
      .getInsuredKeysLength(passengerAddress)
      .call();
    }

    async getInsuredFlights(passengerAddress, index) {
      let self = this;
      return await self.flightSuretyApp.methods
      .getInsuredFlights(passengerAddress, index)
      .call();
    }

    async getInsuranceBalance(passengerAddress, flightKey) {
      let self = this;
      return await self.flightSuretyApp.methods
      .getInsuranceBalance(passengerAddress, flightKey)
      .call();
    }

    async payOut(passengerAddress, flightKey, insurerBalance) {
      let self = this;
      return await self.flightSuretyApp.methods
      .payOut(flightKey,insurerBalance)
      .send({from:passengerAddress});
    }

    /*
    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

/*    fetchFlightStatus(flight, callback) {
      let self = this;
      let payload = {
        airline: self.airlines[0],
        flight: flight,
        timestamp: Math.floor(Date.now() / 1000)
      }
      self.flightSuretyApp.methods
        .fetchFlightStatus(payload.airline,payload.flight,payload.timestamp)
        .send({ from: self.owner}, (err, result) => {
          callback(err,payload);
        });
    }

    buyInsurance(flight, fee, callback) {
        let self = this;
        self.flightSuretyApp.methods
            .buyInsurance(flight)
            .send({ from: self.owner, value: fee, gas: 5000000}, (err, result) => {
                callback(err, result);
            });
    }

*/

}
