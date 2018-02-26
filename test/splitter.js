var Splitter = artifacts.require("Splitter");
const expectedExceptionPromise = require("./expected_exception_testRPC_and_geth.js");

contract('Splitter', function(accounts) {
    var instance;
    beforeEach(function() {
        return Splitter.new().then(function(contract) {
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
        return instance.split.sendTransaction(accounts[1], accounts[2],{
            from: accounts[0],
            value: web3.toWei(1)
        }).then(function() {
            return instance.balances.call(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(0.5), "should have 0.5 eth balance");
        });
    });

    it("should withdraw", function() {
        return instance.split.sendTransaction(accounts[1], accounts[2],{
            from: accounts[0],
            value: web3.toWei(1)
        }).then(function() {
            return instance.withdraw.sendTransaction({
                from: accounts[1]
            }).then(function() {
                return instance.balances.call(accounts[1]);
            }).then(function(balance) {
                assert.equal(balance.valueOf(), 0, "should have 0 balance");
            });
        });
    });


    it("should not withdraw to creator", function() {
        return instance.split.sendTransaction(accounts[1], accounts[2],{
            from: accounts[0],
            value: web3.toWei(1)
        }).then(function() {
            return expectedExceptionPromise(function() {
                    return instance.withdraw.sendTransaction({
                        from: accounts[0]
                    });
                })
                .then(function() {
                    return instance.balances.call(accounts[1],{
                        from: accounts[1]
                    });
                }).then(function(balance) {
                    assert.equal(balance.valueOf(), web3.toWei(0.5), "should have 0.5 eth balance");
                });
        });

    });

    it("should have 0 balance after everyone withdrawed", function() {
        return instance.split.sendTransaction(accounts[1], accounts[2],{
            from: accounts[0],
            value: web3.toWei(1)
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
