import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";
import $ from "jquery";

import tictactoeArtifacts from "../../build/contracts/TicTacToe.json";

//abi file
var TicTacToe = contract(tictactoeArtifacts);

var accounts;
var player1;
var player2;
var ticTacToeInstance;

window.App = {

  start: async function() {
    var self = this;

    //set provider
    TicTacToe.setProvider(web3.currentProvider);

    // Get the intial accounts
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      player1 = accounts[0];
      player2 = accounts[1];
    });
  },

  newGame: async function() {
    TicTacToe.new({from: player1, value: web3.utils.toWei("0.1", "ether"), gas: 3000000}).then(instance => {
      ticTacToeInstance = instance;

      for(var i = 0; i < 3; i++){
        for(var j = 0;j < 3; j++){
          $($("#board")[0].children[0].children[i].children[j]).off('click').click({x: i, y:j}, App.setStone1);        
        }
      }

      console.log(instance);
    })
  },

  joinGame: async function() {
    
    var gameAddress = prompt("Address of the Game");

    if(gameAddress != null){

      TicTacToe.at(gameAddress).then(instance => {
        ticTacToeInstance = instance;
        return ticTacToeInstance.joinGame({from: player2, value: web3.utils.toWei("0.1", "ether"), gas: 3000000});
      }).then(txResult => {

        for(var i = 0; i < 3; i++) {
          for(var j = 0; j < 3; j++) {
            $($("#board")[0].children[0].children[i].children[j]).off('click').click({x: i, y:j}, App.setStone2);
          }
        }

        console.log(txResult);
      })
    }
  },

  setStone1: function(event) {
    console.log(event);
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        $($("#board")[0].children[0].children[i].children[j]).prop('onclick',null).off('click');
      }
    }

    ticTacToeInstance.setStone(event.data.x, event.data.y, {from: player1}).then(txResult => {
      console.log(txResult);
      App.printBoard();
    })

  },

  setStone2: function(event) {
    console.log(event);
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        $($("#board")[0].children[0].children[i].children[j]).prop('onclick',null).off('click');
      }
    }

    ticTacToeInstance.setStone(event.data.x, event.data.y, {from: player2}).then(txResult => {
      console.log(txResult);
      App.printBoard();
    })

  },

  printBoard: function() {
    ticTacToeInstance.getBoard.call().then(board => {
      for(var i=0; i < board.length; i++) {
        for(var j=0; j < board[i].length; j++) {
          if(board[i][j] == player1) {
            $("#board")[0].children[0].children[i].children[j].innerHTML = "X";
          } else if(board[i][j] != 0) {
            $("#board")[0].children[0].children[i].children[j].innerHTML = "O";
          }
        }
      }
    });
  },

  nextPlayer: function(error, eventobj) {

  }

};

window.addEventListener("load", function() {

  // if (typeof web3 !== 'undefined') {
  //   window.web3 = new Web3(web3.currentProvider);
  // } else {
     window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  // }

  App.start();
});