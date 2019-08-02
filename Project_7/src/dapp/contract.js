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

    async registerFlight(flightID, departure, destination, departureDate) {
      let self = this;
       return await self.flightSuretyApp.methods
     .registerFlight(flightID, departure ,destination, departureDate)
      send({from:airline, gas:1000000});
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
