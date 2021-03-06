var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'garbage hybrid artist dwarf gain child segment shield slim stay token album';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/a7f2e2456ad34d10bd09f94dc2f53000')
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }, compilers: {
    solc: {
      version: "0.4.25",
    },
  },
};
