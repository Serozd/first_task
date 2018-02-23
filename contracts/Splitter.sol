pragma solidity ^0.4.17;

contract Splitter {

    struct BalanceInfo {
        uint funded;
        uint withdrawed;
    }
    event FundsWithdrawed(address, uint);
    address public reciever1;
    address public reciever2;
    address public owner;
    mapping(address => BalanceInfo) public balances;

    function Splitter(address rec1, address rec2) public {
        require(rec1 != 0);
        require(rec2 != 0);
        owner = msg.sender;
        balances[rec1] = BalanceInfo(0,0);
        balances[rec2] = BalanceInfo(0,0);
        reciever1 = rec1;
        reciever2 = rec2;
    }
    
    modifier onlySender() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyReciever() {
        require(msg.sender == reciever1 || msg.sender == reciever2);
        _;
    }

    modifier fundsAvailable() {
        bool available_balance = balances[msg.sender].funded >= balances[msg.sender].withdrawed;
        require(available_balance);
        _;
    }

    function split() public onlySender payable {
        balances[reciever1].funded += msg.value/2;
        balances[reciever2].funded += msg.value/2;
    }
    


    function withdraw() public onlyReciever fundsAvailable {
        uint diff = getBal(msg.sender);
        balances[msg.sender].withdrawed += diff; 
        msg.sender.transfer(diff);
        FundsWithdrawed(msg.sender, diff);
    }

    function getBal(address addr) internal view returns (uint256){
        return balances[addr].funded - balances[addr].withdrawed;
    }

    function getAvailableBalance() public onlyReciever fundsAvailable view returns (uint256) {
        
        return getBal(msg.sender);
    }
    
    function collectDust() public onlySender {
        if(balances[reciever1].withdrawed == balances[reciever1].funded &&
        balances[reciever2].withdrawed == balances[reciever2].funded
        )
        msg.sender.transfer(this.balance);
    }

}
