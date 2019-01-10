// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require("babel-core/register");
var HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'garbage hybrid artist dwarf gain child segment shield slim stay token album';
const infura = 'https://rinkeby.infura.io/v3/8dc78ca9731a4718a51e041327b3ea60'

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infura),
      network_id: 4,
      gas : 6700000,
      gasPrice : 10000000000
      },

  }, compilers: {
     solc: {
       version: "0.4.25"
     }
  }
}
