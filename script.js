//note: X = black, O = white


const squares = document.querySelectorAll(".square");
const start = document.querySelector(".start");
const xname = document.querySelector("#xname");
const oname =document.querySelector("#oname");
const infowrap = document.querySelector(".info-wrapper");

//player factory function
const Player = (side, playerName) => {
    const _renderMove = square => {

        const stone = document.createElement('img');
        stone.classList.add('stone');
        
        if(Gameboard.board[square] === "X"){
            stone.src = "imgs/black_stone.png";
        }else{
            stone.src="imgs/white_stone.png";
        }

        squares[square].appendChild(stone);
    };

    let name = playerName;

    const move = (square) => {
        if(!Gameboard.board[square]){
            Gameboard.board[square] = side;
            _renderMove(square);
            

            let win = Gamestate.checkState();

            if(win){
                console.log(win);
            }

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
        name,
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
    let notStarted = true;
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
            if(win === "X"){
                return xplayer.name + " Wins";
            }else{
                return oplayer.name + " Wins";
            }
        }else if(!(Gameboard.board.includes(null))){
            return "Tie Game";
        }else{
            return false;
        }
    }

    return {
        notStarted,
        turn,
        checkState,
    };
})()


const xplayer = Player("X", null);
const oplayer = Player("O", null);


start.addEventListener("click", e =>{
    e.preventDefault();
    infowrap.classList.add("hidden");

    xplayer.name = xname.value;
    oplayer.name = oname.value;
});

