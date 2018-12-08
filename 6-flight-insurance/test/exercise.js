var BigNumber = require('bignumber.js');
var Test = require('../config/testConfig.js');

contract('Exercise Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {

    config = await Test.Config(accounts);

    // Call the contract and sets it into testing mode
    await config.exercises.setTestingMode(true);
  });

  it(`has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.exercises.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.exercises.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
      
      
  });

  it(`can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.exercises.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

  });

  it(`can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.exercises.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.exercises.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.exercises.setOperatingStatus(true);

  });

 
});
