pragma solidity 0.5.12;

contract TicTacToe {

    uint constant public gameCost = 0.1 ether;
    uint timeToReact = 3 minutes;
    uint gameValidUntil;

    uint8 boardSize = 3;
    uint8 movesCounter;
    uint balanceToWithdrawPlayer1;
    uint balanceToWithdrawPlayer2;

    address[3][3] board;
    address payable public player1;
    address payable public player2;

    address payable public activePlayer;
    bool activeGame;

    event PlayerJoined(address player);
    event NextPlayer(address player);
    event GameWin(address winner);
    event GameDraw();
    event PayoutSuccess(address receiver, uint amountInWei);

    constructor () public payable {
        require(msg.value == gameCost, "Pay 0.1 ethers to join game");
        player1 = msg.sender;
        gameValidUntil = now + timeToReact;
    }

    function getBoard() public view returns(address[3][3] memory){
        return board;
    }

    function setWinner(address payable player) private {
        activeGame = false;
        //emit an event
        emit GameWin(player);
        //transfer money to winner
        player.transfer(address(this).balance);
    }

    function setDraw() private {
        activeGame = false;
        emit GameDraw();
        player1.transfer(address(this).balance/2);
        player2.transfer(address(this).balance/2);
    }

    // function emergencyCashOut() public {
    //     require(gameValidUntil < now, "Wait for player to play");
    //     require(activeGame, "game is not active");
    // }

    function joinGame() public payable{
        require(msg.value == gameCost, "Pay 0.1 ethers to join game");
        require(msg.sender != player1, "Player1 has already joined Game");
        require(player2 == address(0), "Error");
        player2 = msg.sender;
        activePlayer = player2;
        activeGame = true;
        gameValidUntil = now + timeToReact;
        emit PlayerJoined(activePlayer);
    }

    function setStone(uint8 x, uint8 y) public {
        require(gameValidUntil > now, "Time out");
        require(board[x][y] == address(0), "Place is not empty");
        require(msg.sender == activePlayer, "This is not your turn");
        assert(x < boardSize);
        assert(y < boardSize);
        assert(activeGame);
        board[x][y] = msg.sender;
        gameValidUntil = now + timeToReact;
        movesCounter++;

        for(uint8 i = 0; i < boardSize; i++){
            if(board[i][y] != activePlayer){
                break;
            }
            //win
            if( i == boardSize - 1){
                //winner
                setWinner(activePlayer);
                return;
            }
        }

        for(uint8 i = 0; i < boardSize; i++){
            if(board[x][i] != activePlayer){
                break;
            }
            //win
            if( i == boardSize - 1){
                //winner
                setWinner(activePlayer);
                return;
            }
        }

        //diagonal
        if(x == y){
            for(uint8 i = 0 ; i < boardSize ; i++){
                if(board[i][i] != activePlayer ){
                    break;
                }
                //win
                if( i == boardSize - 1){
                    //winner
                    setWinner(activePlayer);
                    return;
                }
            }
        }

        //anti-diagonal
        if( (x+y) == boardSize - 1){
            for(uint8 i = 0 ; i < boardSize ; i++){
                if(board[i][boardSize-1-i] != activePlayer){
                    break;
                }
                //win
                if( i == boardSize - 1){
                    //winner
                    setWinner(activePlayer);
                    return;
                }
            }
        }

        if(movesCounter == boardSize**2){
            setDraw();
            return;
        }

        if(activePlayer == player1){
            activePlayer = player2;
            emit NextPlayer(activePlayer);
        }else{
            activePlayer = player1;
            emit NextPlayer(activePlayer);
        }
    }
}