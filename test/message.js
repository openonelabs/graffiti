var Message = artifacts.require("./Message.sol");
var Helper = require("./helper.js");
var BigNumber = require("bignumber.js");

contract('Message', function(accounts){
  
  var vig = new BigNumber(50000000000000);
  var owner = web3.eth.accounts[0];
  var poster = web3.eth.accounts[1];
  var post = "aaa";


  function newContract(){
    return Message.new();
  }

  function changeFee(instance, fee){
    return instance.changeFee(fee);
  }

  it('Compiles and saves to block', function() {
    return newContract().then(function(response) {
      assert.notEqual(response, null);
    });
  });

  it('Can change fee', function() {
    return newContract().then(function(instance) {
      return changeFee(instance, 1).then(function(response) {
        assert.notEqual(response, null);
      });
    });
  });

  it("Cannot raise fee", function() {
    return Message.new().then(function(instance) {
      return instance.changeFee(vig.plus(1)).then(function() {
        assert(false);
      }).catch(function(error) {
        assert.include(error.toString(), "invalid opcode");
      });
    });
  });

  it("Non-owner cannot change fee", function() {
    return Message.new().then(function(instance) {
      return instance.changeFee(vig, {from: poster}).then(function() {
        assert(false);
      }).catch(function(error) {
        assert.include(error.toString(), "invalid opcode");
      });
    });
  });

  it("Can add post", function() {
    return Message.new().then(function(instance) {
      return instance.post(post, {from: poster, value: vig}).then(function(response) {
        assert.notEqual(response, null);
      });
    });
  });

  it("Cannot add post w/ low vig", function() {
    return Message.new().then(function(instance) {
      return instance.post(post, {from: poster, value: vig.minus(1)}).then(function(response) {
        assert(false);
      }).catch(function(error) {
        assert.include(error.toString(), "invalid opcode");
      });
    });
  });
 
  it("Current owner can change owner", function() {
    return Message.new().then(function(instance) {
      return instance.changeOwner(poster).then(function(response) {
        assert.notEqual(response, null);
      });
    });
  });

  it("Non-owner cannot change owner", function() {
    return Message.new().then(function(instance) {
      return instance.changeOwner(poster, {from: poster}).then(function(response) {
        assert(false);
      }).catch(function(error) {
        assert.include(error.toString(), "invalid opcode");
      });
    });
  });

  it("Vig transferred", function() {
    return Message.new().then(function(instance) {
      var preBalance = web3.eth.getBalance(owner);
      return instance.post(post, {from: poster, value: vig}).then(function(response) {
        var postBalance = web3.eth.getBalance(owner);
        assert.equal(postBalance.toLocaleString(), vig.plus(preBalance).toLocaleString());
      });
    });
  });

  it("Can get post", function() {
    return Message.new().then(function(instance) {
      return instance.post(post, {from: poster, value: vig}).then(function() {     
        return instance.getPost.call(0).then(function(data) {
          assert.equal(Helper.hex2a(data), post);
        });
      });
    });
  });

  it("Cannot get post w/ high index", function() {
    return Message.new().then(function(instance) {
      return instance.post(post, {from: poster, value: vig}).then(function() {
        return instance.getPost.call(1).then(function(response) {
          assert(false);
        }).catch(function(error) {
          assert.include(error.toString(), "invalid opcode");
        });
      });
    });
  });

});
