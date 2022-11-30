const squares = document.querySelectorAll(".square");

//player factory function
const Player = (side) => {
    const _renderMove = square => {
        squares[square].textContent = Gameboard.board[square];
    };

    const move = (square) => {
        if(!Gameboard.board[square]){
            Gameboard.board[square] = side;
            _renderMove(square);
            
            //pass turn to other player
            if(side === "X"){
                Gamestate.turn = "O";
            } else{
                Gamestate.turn = "X";
            }
        }
    };

    return {
        move,
    };
};

const Gameboard = (()=>{
    let board =
                    [null, null, null,
                    null, null, null,
                    null, null, null];

    //lets player make a move by clicking the board
    const _makeClickable = ()=>{
        for(let i=0; i < board.length;i++){
            squares[i].addEventListener("click", ()=>{
                if(Gamestate.turn === "X"){
                    xplayer.move(i);
                }else{
                    oplayer.move(i);
                }
            });
        }
    }

    _makeClickable();

    return {
        board,
    }
})();

const Gamestate = (() => {
    let turn = "X"

    const _getRows = () => {
        let row1 = Gameboard.board.slice(0, 3);
        let row2 = Gameboard.board.slice(3, 6);
        let row3 = Gameboard.board.slice(6);
        
        return [row1, row2, row3];
    }

    const _getCols = () => {
        let col1 = [];
        let col2 = [];
        let col3 = [];

        for(let i=0; i<Gameboard.board.length;i++){
            if(i%3 === 0){ //column 1
                col1.push(Gameboard.board[i]);
            }else if((i - 1)%3 === 0){ //column 2
                col2.push(Gameboard.board[i]);
            }else{
                col3.push(Gameboard.board[i]);
            }
        }
        return [col1, col2, col3];
    }

    const _getDiags = () =>{
        let downRight = [Gameboard.board[0], Gameboard.board[4], Gameboard.board[8]];
        let upLeft = [Gameboard.board[6], Gameboard.board[4], Gameboard.board[2]];

        return [downRight, upLeft];
    }

    const _checkThree = (arr) => {
        for(let i=0;i<arr.length;i++){
            if(arr[i][0] === arr[i][1] && arr[i][1] === arr[i][2]){
                return arr[i][0]; //returns X if X wins and O if O wins
            }
        }

        return false;
    }


    const checkState = ()=>{
        let rows = _getRows();
        let cols = _getCols();
        let diags = _getDiags();

        let win = _checkThree(rows) || _checkThree(cols) || _checkThree(diags);

        if(win){
            console.log(win + " Wins");
        }else if(!(Gameboard.board.includes(null))){
            console.log("Tie Game");
        }else{
            return false;
        }
    }

    return {
        turn,
        checkState,
    };
})()


const xplayer = Player("X");
const oplayer = Player("O");


