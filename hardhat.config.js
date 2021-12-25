require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");

require("hardhat-gas-reporter");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2100,
      },
    },
  },
  gasReporter: {
    currency: "CHF",
    gasPrice: 21,
  },
};
