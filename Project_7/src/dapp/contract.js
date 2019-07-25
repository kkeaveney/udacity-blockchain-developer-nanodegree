import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(config.url));
        this.initialize(callback);
        this.owner = null;
        this.passengers = [];
        this.airlines = [];

        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress, config.dataAddress);
        //this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress, firstAirline);
    }

    initialize(callback) {
        this.web3.eth.getAccounts(async (err, accts) => {

            this.owner = accts[0];

            await this.flightSuretyData.methods.authoriseCaller(this.flightSuretyApp._address).send({ from: this.owner });

            let counter = 1;

            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    fetchFlightStatus(flight, callback) {
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



}
