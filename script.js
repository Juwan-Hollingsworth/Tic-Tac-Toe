// Constants
let originalBoard;
const humanPlayer = "O";
const aiPlayer = "X";
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];
const squares = document.querySelectorAll(".square");

startGame();

function startGame() {
  //set display prop to none
  document.querySelector(".endGame").style.display = "none";
  //create an array of 9 elements w/ keys 1-9
  originalBoard = Array.from(Array(9).keys());

  for (let i = 0; i < squares.length; i++) {
    squares[i].innerText = "";
    squares[i].style.removeProperty("background-color");
    //anytime a square is clicked call the turnclick f(x)
    squares[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof originalBoard[square.target.id] == "number") {
    /*
    if the square idx that was clicked is = to a # then the human or ai has not played it

    calls another (fx)
    pass in square ID & human player
    turn f(x) can be called by ai or human
    */
    turn(square.target.id, humanPlayer);
    //check if a tie - no avail spots - no wins
    //@bestSpot() return best square to click
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

/*
@squareID - current square
@player - current player
set board to ID where player just clicked
updatedisplay to see what was just clicked
*/
function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  /*
  @originalBoard arr (current state X's & Os )
  @player - current player
  if gameWon checkWin
  */
  let gameWon = checkWin(originalBoard, player);
  if (gameWon) gameOver(gameWon);
}
/*
@board - the OG board
@player - current player
*/
function checkWin(board, player) {
  // Find all places on the board that have been played
  //reduce method will go thru every element of board arr and return a single value
  //@a - accumulator, @e -element, @i - index
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;

  /*
  @idx of the win & arr
  go thru every e check if plays.index
  has the player plays in every spot that counts as a win for that win 
  */
  for (let [index, win] of winningCombos.entries()) {
    //has a player played in every spot that constitues a win
    if (win.every((e) => plays.indexOf(e) > -1)) {
      //if so the player has won.
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  // highlight all squares in winning combo
  for (let index of winningCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "#12c2f1" : "#f72d05";
  }
  //go thru every square and make it unclickable
  for (let i = 0; i < squares.length; i++) {
    squares[i].removeEventListener("click", turnClick, false);
  }

  declareWinner(gameWon.player == humanPlayer ? "you win" : "you lose");
}

function declareWinner(who) {
  document.querySelector(".endGame").style.display = "block";
  document.querySelector(".endGame.text").innerText = who;
}

function bestSpot() {
  //first empty square elem
  return emptySquares()[0];
}
function emptySquares() {
  return originalBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
  return minimax(originalBoard, aiPlayer).index;
}
function checkTie() {
  //if length = 0 and no one has won then it is a tie
  if (emptySquares().length == 0) {
    for (let i = 0; i < squares.length; i++) {
      squares[i].style.backgroundColor = "green";
      squares[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

/* 
@minimax 
make a list of the avail spots.
check for win for the human player - check terminal states 
assign score based best outcome -10 - humanwin, 10 aiwin, 0 tie
the 2nd f(x) collects values from the lower level
then chooses the lowest of two values 
*/

function minimax(newBoard, player) {
  // make a list of all avail spots on board
  let availSpots = emptySquares(newBoard);

  // check for terminal states
  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  // loop thru every empty spot starting w/ 1st
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    //place the human player in first empty spot on new board
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      // call itself (minimax) then wait for value
      let result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      // wait for the function to return a value
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }
    //assign index to new board
    newBoard[availSpots[i]] = move.index;
    //push all moves to the move arr
    moves.push(move);
  }

  // determine best move based on values
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  //return an object containing the highest score
  return moves[bestMove];
}
