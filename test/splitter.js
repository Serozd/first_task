var Splitter = artifacts.require("Splitter");
const expectedExceptionPromise = require("./expected_exception_testRPC_and_geth.js");

contract('Splitter', function(accounts) {
    var instance;
    beforeEach(function() {
        return Splitter.new(accounts[1], accounts[2]).then(function(contract) {
            instance = contract;
        });
    });

    it("should have 0 balance initially", function() {
        return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 0, "shouldn't have 0 balance initially");
        });
    });

    it("should split evenly", function() {
        return instance.split({
            from: accounts[0],
            value: 1e18
        }).then(function() {
            return instance.getAvailableBalance.call({
                from: accounts[1]
            });
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 5e17, "should have 5e17 balance");
        });
    });

    it("should withdraw", function() {
        return instance.split.sendTransaction({
            from: accounts[0],
            value: 1e18
        }).then(function() {
            return instance.withdraw.sendTransaction({
                from: accounts[1]
            }).then(function() {
                return instance.getAvailableBalance.call({
                    from: accounts[1]
                });
            }).then(function(balance) {
                assert.equal(balance.valueOf(), 0, "should have 0 balance");
            });
        });
    });


    it("should not withdraw to creator", function() {
        return instance.split.sendTransaction({
            from: accounts[0],
            value: 1e18
        }).then(function() {
            return expectedExceptionPromise(function() {
                    return instance.withdraw.sendTransaction({
                        from: accounts[0]
                    });
                })
                .then(function() {
                    return instance.getAvailableBalance.call({
                        from: accounts[1]
                    });
                }).then(function(balance) {
                    assert.equal(balance.valueOf(), 5e17, "should have 5e17 balance");
                });
        });

    });

    it("should have 0 balance after everyone withdrawed", function() {
        return instance.split({
            from: accounts[0],
            value: 1e18
        }).then(function() {
            return instance.withdraw.sendTransaction({
                from: accounts[1]
            }).then(function() {
                return instance.withdraw.sendTransaction({
                    from: accounts[2]
                }).then(function() {
                    return new Promise(function(resolve, reject) {
                        resolve(web3.eth.getBalance(instance.address));
                    })
                }).then(function(balance) {
                    assert.equal(balance.valueOf(), 0, "should have 0 balance");
                });
            });
        });
    });
});
