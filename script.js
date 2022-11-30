const squares = document.querySelectorAll(".square");

const xplayer = Player("X");
const oplayer = Player("O");




const Gameboard = (()=>{
    let gameboard =
                    [null, null, null,
                    null, null, null,
                    null, null, null];

    
    return {
        gameboard
    }
})();


//player factory function
const Player = (side) => {
    const _renderMove = square => {
        squares[square].innerHTML = Gameboard.gameboard[square];
    };

    const move = (square) => {
        if(!Gameboard.gameboard[square]){
            Gameboard.gameboard[square] = side;
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

const Gamestate = () => {
    let turn = "X"

    return {
        turn,
    };
}

