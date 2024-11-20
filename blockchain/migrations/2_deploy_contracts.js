const AcademicResources = artifacts.require("AcademicResources");

module.exports = function (deployer) {
    deployer.deploy(AcademicResources);
};