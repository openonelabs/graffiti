pragma solidity ^0.4.11;


contract Message {

  // define storage object

  // declare storage object
  bytes[] messages;

  // declare owner
  address private owner;

  // declare fee
  uint256 private currentFee = 50000000000000; // ~ $.01 at time of writing

  // constructor
  function Message(){
    owner = msg.sender;
  }

  // function modifier onlyOwner
  modifier onlyOwner {
    require(msg.sender == owner);
     _;
  }

  // change tax amount (only owner)
  function changeFee(uint256 fee) onlyOwner {
    if (fee > currentFee) throw;  // only lower the fee

    currentFee = fee;
  }

  // function post
       // write to storage
       // check for anything?
       // pay tax to owner
       

}
