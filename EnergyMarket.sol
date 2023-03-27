// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract EnergyMarket {
    
    address public owner;
    uint256 public ethToTokenRate;
    mapping(address => uint256) public balances;
    event FundsAdded(address indexed sender, uint256 amount);

    constructor(uint256 _ethToTokenRate) {
        owner =  msg.sender;
        ethToTokenRate = _ethToTokenRate;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
 
    function addFunds() public payable {
        require(msg.value > 0, "Cannot add 0 funds");
        emit FundsAdded(msg.sender, msg.value);
    }

    function withdrawFunds(uint amount) public onlyOwner {
        require(amount > 0, "Cannot withdraw 0 funds");
        require(address(this).balance >= amount, "Insufficient funds");
        payable(msg.sender).transfer(amount);
        // address(this).balance -= amount;
    }
    
    function addTokens() public payable{
        require(msg.value >0, "Cannot add 0 tokens");
        balances[msg.sender]+=msg.value;
    }
   
    function buyEnergyTokens(uint256 tokensToBuy,address consumer) payable public {
        require(msg.value > 0, "Amount of Ether sent must be greater than zero.");
        uint256 tokensToTransfer = tokensToBuy * ethToTokenRate;
        require(balances[address(this)] >= tokensToTransfer, "Energy market does not have enough tokens to sell.");
        balances[address(this)] -= tokensToTransfer;
        balances[consumer] += tokensToTransfer;
    }
    
    function sellEnergyTokens(uint256 tokensToSell,address Producer) public {
        require(balances[msg.sender] >= tokensToSell, "Producer does not have enough tokens to sell.");
        uint256 etherToTransfer = tokensToSell / ethToTokenRate;
        require(address(this).balance >= etherToTransfer, "Energy market does not have enough Ether to buy tokens.");
        balances[msg.sender] -= tokensToSell;
        balances[address(this)] += tokensToSell;
        payable(Producer).transfer(etherToTransfer);
    }
    
    function getEthToTokenRate() public view returns (uint256) {
        return ethToTokenRate;
    }
    
    function getEnergyTokenBalance() public view returns (uint256) {
        return balances[address(this)];
    }
    function getEnergyTokenBalanceOf(address account) public view returns (uint) {
        return balances[account];
    }
}
