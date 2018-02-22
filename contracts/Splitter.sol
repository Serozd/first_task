pragma solidity ^0.4.17;

contract Splitter {

    struct BalanceInfo {
        uint funded;
        uint withdrawed;
    }
    address reciever1;
    address reciever2;
    address sender;
    mapping(address => BalanceInfo) balances;

    function Splitter(address rec1, address rec2) public payable {
        sender = msg.sender;
        balances[rec1] = BalanceInfo(0,0);
        balances[rec2] = BalanceInfo(0,0);
        reciever1 = rec1;
        reciever2 = rec2;
    }
    
    modifier onlySender() {
        require(msg.sender == sender);
        _;
    }

    modifier onlyReciever() {
        require(msg.sender == reciever1 || msg.sender == reciever2);
        _;
    }

    function split() public onlySender payable {
        balances[reciever1].funded += msg.value/2;
        balances[reciever2].funded += msg.value/2;
    }

    function withdraw() public onlyReciever {
        uint change = balances[msg.sender].funded - balances[msg.sender].withdrawed;
        if(change <=0) revert();
        if(!msg.sender.send(change)){
            revert();
        }
        balances[msg.sender].withdrawed += change;
    }

    function getBalance() public returns (uint256) {
        return this.balance;
    }

    function getAvailableBalance() public onlyReciever returns (uint256) {
        return balances[msg.sender].funded - balances[msg.sender].withdrawed;
    }

}