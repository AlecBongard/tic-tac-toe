//note: X = black, O = white


const squares = document.querySelectorAll(".square");
const start = document.querySelector(".start");
const xname = document.querySelector("#xname");
const oname =document.querySelector("#oname");
const infowrap = document.querySelector(".info-wrapper");
const gameInfo = document.querySelector(".game-info");
const turnText = document.querySelector(".turn-text");
const boardGrid = document.querySelector(".board");
const p2bot = document.querySelector("#p2bot");
const p1bot = document.querySelector("#p1bot");

//player factory function
const Player = (side, playerName) => {
    let bot = false; //determines whether player is a bot
    let botDifficulty = "easy";

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

    const _randMove = () => {
        let valid = [];

        for(let i=0;i<Gameboard.board.length;i++){
            if(Gameboard.board[i] === null){
                valid.push(i);
            }
        }

        let chosen = valid[Math.floor(Math.random() * valid.length)];
        move(chosen);
    }

    //Will determine which difficulty should be used when more difficulties are added
    const botMove = () => {
        if(botDifficulty === "easy"){
            _randMove();
        }
    }

    let name = playerName;

    const move = (square) => {
        if(!Gameboard.board[square]){
            squares[square].textContent = "";
            Gameboard.board[square] = side;
            _renderMove(square);
            

            let win = Gamestate.checkState();

            if(win){
                turnText.textContent = win.toString();
            }else{
                //pass turn to other player
                if(side === "X"){
                    

                    Gamestate.turn = "O";
                    turnText.textContent = oplayer.name + "'s turn";

                    if(oplayer.bot){
                        setTimeout(()=>oplayer.botMove(), 200);
                    }
                } else{
                    Gamestate.turn = "X";
                    turnText.textContent = xplayer.name + "'s turn";

                    if(xplayer.bot){
                        setTimeout(()=>xplayer.botMove(), 200);
                    }
                }
            }

            
        }
    };

    return {
        move,
        botMove,
        name,
    };
};

const Gameboard = (()=>{
    let board =
                    [null, null, null,
                    null, null, null,
                    null, null, null];

    //lets player make a move by clicking the board
    const _makeClickable = (()=>{
        for(let i=0; i < board.length;i++){
            squares[i].addEventListener("click", ()=>{
                if(!Gamestate.checkState()){ //doesn't allow moves if game is over
                    if(Gamestate.turn === "X"){
                        xplayer.move(i);
                    }else{
                        oplayer.move(i);
                    }
                }
            });
        }
    })();


    //add shadows when hovering over a square
    const _addHover = (()=>{
        const shadow = document.createElement("img");
        shadow.classList.add("shadow");


        for(let i=0;i<board.length;i++){
            squares[i].addEventListener("mouseover", ()=>{

                if(Gamestate.turn==="X"){
                    shadow.src = "imgs/black_stone.png";
                }else{
                    shadow.src = "imgs/white_stone.png";
                }

                if(board[i]===null){
                    squares[i].appendChild(shadow);
                }
            });
        }
    })();

    const _restart = ()=>{
        for(let i=0;i<board.length;i++){
            squares[i].textContent = "";
            board[i] = null;

        }

        if(xplayer.bot){
            setTimeout(()=>xplayer.botMove(), 250);
        } 
    }

    const playagain = () => {
        Gamestate.turn = "X";
        const playAgain = document.createElement('p');
        playAgain.id = "restart";
        playAgain.textContent = "Play again";

        gameInfo.appendChild(playAgain);

        playAgain.addEventListener("click", ()=>{
            gameInfo.removeChild(playAgain);
            _restart();
        });
    }

    return {
        board,
        playagain,
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
            if(!document.getElementById("restart")){
                Gameboard.playagain();
            }

            if(win === "X"){
                return xplayer.name + " wins.";
            }else{
                return oplayer.name + " wins.";
            }
        }else if(!(Gameboard.board.includes(null))){
            Gameboard.playagain();
            return "Tie Game.";
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
    if(!((xname.value==="" && !xname.disabled) || (oname.value==="" && !oname.disabled))){
        infowrap.classList.add("hidden");


        xplayer.name = xname.value;
        oplayer.name = oname.value;

        turnText.textContent = xplayer.name + "'s turn";
    }else{

        if(!xname.disabled){
            xname.classList.add("post-submit");
        }
        if(!oname.disabled){
            oname.classList.add("post-submit");
        }
    }

    if(p2bot.checked){
        oplayer.bot = true;
    }

    if(p1bot.checked){
        xplayer.bot = true;
        setTimeout(()=>xplayer.botMove(), 250);
    }
});

p2bot.addEventListener('click', ()=>{
    if(p2bot.checked){
        oname.disabled = true;
        oname.value = "White Bot";
    } else{
        oname.disabled = false;
        oname.value = "";
    }
});

p1bot.addEventListener('click', ()=>{
    if(p1bot.checked){
        xname.disabled = true;
        xname.value = "Black Bot";
    } else{
        xname.disabled = false;
        xname.value = "";
    }
});
