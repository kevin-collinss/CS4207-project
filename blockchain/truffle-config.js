module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",       // Ganache host
      port: 7545,              // Ganache port
      network_id: "*",         // Match any network ID
      gas: 6721975,            // Gas limit for deployment
      gasPrice: 20000000000,   // Gas price in wei (20 gwei)
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",        // Specify the Solidity compiler version
    },
  },
};
