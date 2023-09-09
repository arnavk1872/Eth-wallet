// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./owned.sol"; // as these contracts are imported and their migration.js file is also not made
import "./logger.sol";//they are not specified as deployed in ganache
import "./IFaucet.sol";

contract faucet is Owned,Logger,IFaucet{
    //uint256 public funds = 1000;    unsigned integer (256 is the number of bits,can only hold positive values)

  uint public numOfFunders;
 

 mapping(address => bool) private funders;
 mapping(uint => address) private lutfunders;

modifier limitWithdraw(uint withdrawAmount) {
    require(
      withdrawAmount <= 100000000000000000,
      "Cannot withdraw more than 0.1 ether"
    );
    _;
  }

function emitLog() public override pure returns(bytes32) {
    return "Hello World";
  }

  function test1() external onlyOwner {
    // some managing stuff that only admin should have access to
  }

  function test2() external onlyOwner {
    // some managing stuff that only admin should have access to
  }


   receive() external payable{}

   function addFunds() external override payable{
     address funder = msg.sender;
     test3();
     if (!funders[funder]) {
      uint index= numOfFunders++;
      funders[funder] = true;
      lutfunders[index] = funder;
   }
   } 
  
   function withdraw(uint withdrawAmount) external override limitWithdraw(withdrawAmount) {
      payable(msg.sender).transfer(withdrawAmount);
    }
   

   
  function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for (uint i = 0; i < numOfFunders; i++) {
      _funders[i] = lutfunders[i];
    }

    return _funders;
  

  }


  function getFunderAtIndex(uint8 index) external view returns(address) {
  
    return lutfunders[index];
  
  }

}