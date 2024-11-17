const StudentNotes = artifacts.require("StudentNotes");

module.exports = function (deployer) {
    deployer.deploy(StudentNotes);
};
