var Exercises = artifacts.require("Exercises");
var FlightSurety = artifacts.require("FlightSurety");

module.exports = function(deployer) {
    deployer.deploy(Exercises);
    deployer.deploy(FlightSurety);
};
