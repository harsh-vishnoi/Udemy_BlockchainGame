var TicTacToe = artifacts.require("TicTacToe");

contract("TicTacToe", function(accounts){
   
    it("Should have enpty board in the start", function(){

        var TicTacToeInstance;
        var playerOne = accounts[0];
        var playerTwo = accounts[1];  

        return TicTacToe.new({from: playerOne, value: web3.utils.toWei("0.1", "ether")}).then(function(instance) {
            TicTacToeInstance =  instance;
            return TicTacToeInstance.joinGame({from: playerTwo, value: web3.utils.toWei("0.1", "ether")})
        }).then(txResult => {
            console.log(txResult);
        }).catch(err => {
            console.log(err);   
        })
    })

})