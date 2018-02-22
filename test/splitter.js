var Splitter = artifacts.require("Splitter");


contract('Splitter', function(accounts) {


  it("should have 0 balance initially", function() {
    return Splitter.deployed().then(function(instance) {
      return instance.getBalance.call();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "shouldn't have 0 balance initially");
    });
  });


  it("should split evenly", function() {
    return Splitter.deployed().then(function(instance) {
      return instance.split.sendTransaction({from:accounts[0], value:1e18}).then(function() {
      	return new Promise(function(resolve, reject) {
      		resolve(instance);
      	});
      });
    }).then(function(instance) {
	  return instance.getAvailableBalance.call({from:accounts[1]});
    }).then(function(balance) {
    	assert.equal(balance.valueOf(), 5e17, "should have 5e17 balance");
    });
  });


  it("should withdraw", function() {
    return Splitter.deployed().then(function(instance) {
      return instance.split.sendTransaction({from:accounts[0], value:1e18}).then(function() {
        return new Promise(function(resolve, reject) {
          resolve(instance);
        });
      });
    }).then(function(instance) {
    return instance.withdraw.sendTransaction({from:accounts[1]}).then(
      function() {
        return new Promise(function(resolve, reject) {
          resolve(instance);
        })
      });
    }).then(function(instance) {
      return instance.getAvailableBalance.call({from:accounts[1]});
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "should have 0 balance");
    });
  });


  it("should not withdraw to creator", function() {
    return Splitter.deployed().then(function(instance) {
      return instance.split.sendTransaction({from:accounts[0], value:1e18}).then(function() {
        return new Promise(function(resolve, reject) {
          resolve(instance);
        });
      });
    }).then(function(instance) {
    return instance.withdraw.sendTransaction({from:accounts[0]}).then(
      function() {
      },
      function() {
        return new Promise(function(resolve, reject) {
          resolve(instance);
        })
      });
    }).then(function(instance) {
      return instance.getAvailableBalance.call({from:accounts[1]});
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 5e17, "should have 5e17 balance");
    });
  });


  it("should have 0 balance after everyone withdrawed", function() {
    return Splitter.deployed().then(function(instance) {
      return instance.split.sendTransaction({from:accounts[0], value:1e18}).then(function() {
        return new Promise(function(resolve, reject) {
          resolve(instance);
        });
      });
    }).then(function(instance) {
    return instance.withdraw.sendTransaction({from:accounts[1]}).then(
      function() {
        return new Promise(function(resolve, reject) {
          resolve(instance);
        })
      });
    }).then(function(instance) {
    return instance.withdraw.sendTransaction({from:accounts[2]}).then(
      function() {
        return new Promise(function(resolve, reject) {
          resolve(instance);
        })
      });
    }).then(function(instance) {
      return instance.getBalance.call();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "should have 0 balance");
    });
  });
});