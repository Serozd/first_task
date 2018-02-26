pragma solidity ^0.4.17;

contract Splitter {


    event FundsWithdrawed(address, uint);
    event FundsAdded(address, uint);

    mapping(address => uint256) public balances;

    function Splitter() public {
    }

    function split(address reciever1, address reciever2) public payable {
        require(reciever1 != 0);
        require(reciever2 != 0);

        if (msg.value % 2 == 1){
            FundsAdded(reciever1, msg.value/2 + 1);
            balances[reciever1] += msg.value/2 + 1;
        } else {
            FundsAdded(reciever1, msg.value/2);
            balances[reciever1] += msg.value/2;
        }
        FundsAdded(reciever2, msg.value/2);
        balances[reciever2] += msg.value/2;
    }

    modifier fundsAvailable() {
        require(balances[msg.sender]>0);
        _;
    }

    function withdraw() public fundsAvailable {
        uint diff = balances[msg.sender];
        balances[msg.sender]=0;
        FundsWithdrawed(msg.sender, diff);
        msg.sender.transfer(diff);
    }
}
