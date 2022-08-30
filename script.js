// 1. Game logic basics
// 2. Determine winner
// 3. implement artificial i
// 4. minimax alg

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
  // calls another (fx)
  //pass in square ID & human player
  // turn f(x) can be called by ai or human
  turn(square.target.id, humanPlayer);
}

//@squareID - current square
// @player - current player
//set board to ID where player just clicked
// updatedisplay to see what was just clicked
function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  //@originalBoard arr (current state X's & Os )
  //@player - current player
  //if gameWon checkWin
  let gameWon = checkWin(originalBoard, player);
  if (gameWon) gameOver(gameWon);
}
// @board - the OG board
// @player - current player
function checkWin(board, player) {
  // Find all places on the board that have been played
  //reduce method will go thru every element of board arr and return a single value
  //@a - accumulator, @e -element, @i - index
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  // idx of the win & array
  //go thru every e check if plays.indec
  //has the player plays in every spot that counts as a win for that win
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
}
