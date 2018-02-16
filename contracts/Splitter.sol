pragma solidity ^0.4.17;

contract Splitter {


    address receiver1;
    address receiver2;
    address sender;

    function Splitter(address rec1, address rec2) public payable {
        sender = msg.sender;
        receiver1 = rec1;
        receiver2 = rec2;
        
    }
    
    modifier onlySender() {
        require(msg.sender == sender);
        _;
    }

    function slpit() public onlySender payable {
        receiver1.send(msg.value/2);
        receiver2.send(msg.value/2);
    }

    function getBalance() public returns (uint256) {
        return this.balance;
    }

}