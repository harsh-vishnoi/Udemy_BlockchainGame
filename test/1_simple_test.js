var TicTacToe = artifacts.require("TicTacToe");

contract("TicTacToe", function(accounts){
   
    it("Should have enpty board in the start", function(){
        return TicTacToe.new({from: accounts[0], value: web3.utils.toWei("0.1", "ether")}).then(function(instance) {
            return instance.getBoard.call();
        }).then(board => {
            console.log(board);
        }).catch(err => {
            console.log(err);   
        })
    })

})