const Contract = artifacts.require("Carrier");

module.exports = function (deployer) {
  deployer.deploy(Contract, "ipfs://cid/{id}.json");
};
