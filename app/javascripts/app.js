// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

/*
 * When you compile and deploy your Voting contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a Voting abstraction. We will use this abstraction
 * later to create an instance of the Voting contract.
 * Compare this against the index.js from our previous tutorial to see the difference
 * https://gist.github.com/maheshmurthy/f6e96d6b3fff4cd4fa7f892de8a1a1b4#file-index-js
 */

import message_artifacts from '../../build/contracts/Message.json'

var Message = contract(message_artifacts);


window.postNewMessage = function(message) {
  try {
    let newMessage = $("#newMessage").val();
    $("#msg").html("Message has been submitted. Please wait.")
    $("#newMessage").val("");

    /* Voting.deployed() returns an instance of the contract. Every call
     * in Truffle returns a promise which is why we have used then()
     * everywhere we have a transaction call
     */
    Message.deployed().then(function(contractInstance) {
      contractInstance.post(newMessage, {value: 50000000000000, gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        let div_id = "board";
        return contractInstance.getPost.call(0).then(function(postedMsg) {
          $("#" + div_id).append(postedMsg.toLocaleString());
          $("#msg").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Message.setProvider(web3.currentProvider);
  Message.deployed().then(function(contractInstance) {
    contractInstance.messageIndex().then(function(index) {
      for (var i=0; i<index; i++) {
        Message.deployed().then(function(contractInstance) {
          contractInstance.getPost.call(index).then(function(postedMsg) {
            $("#board").append(postedMsg.toLocaleString() + " || ");
          });
        });
      }
    });
  });
});
