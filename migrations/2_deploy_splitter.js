var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(Splitter, "0x59c53a5d27acda2eed24f0077a2d64a80f665c86", "0x5b7e1b00d64db8d5639fba47f6cc48e310e19047");
};
