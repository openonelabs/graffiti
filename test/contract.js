var Message = artifacts.require("./Message.sol");
var BigNumber = require("bignumber.js");

contract('Message', function(accounts){

  it('Compiles and saves to block', function() {
    return Message.deployed().then(function(response) {
      assert.notEqual(response, null);
    });
  });

  it('Can access empty messages', function() {
    return Message.deployed().then(function(instance) {
    });
  });

  it('Can change fee', function() {
    return Message.new().then(function(instance) {
      return instance.changeFee(1).then(function(response) {
        assert.notEqual(response, null);
      });
    });
  });

  it("Cannot raise fee", function() {
    return Message.new().then(function(instance) {
      var newFee = new BigNumber(50000000000001);
      return instance.changeFee(newFee).then(function() {
        assert(false);
      }).catch(function(error) {
        assert.include(error.toString(), "invalid opcode");
      });
    });
  });

  it("Non-owner cannot lower fee", function() {
    return Message.new().then(function(instance) {
      var newFee = new BigNumber(1);
      return instance.changeFee(newFee, {from: web3.eth.accounts[1]}).then(function() {
        assert(false);
      }).catch(function(error) {
        assert.include(error.toString(), "invalid opcode");
      });
    });
  });


});
