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
  console.log(originalBoard);

  for (let i = 0; i < squares.length; i++) {
    squares[i].innerText = "";
    squares[i].style.removeProperty("background-color");
    //anytime a square is clicked call the turnclick f(x)
    squares[i].addEventListener("click", turnClick, false);
  }

  function turnClick(square) {
    // calls another (fx)
    //pass in square ID & human player
    // turn f(x) can be called by ai or human
    turn(square.target.id, humanPlayer);
  }

  //2 param square ID & humanplayer
  //set board to ID where player just clicked
  // updatedisplay to see what was just clicked
  function turn(squareId, player) {
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
  }
}
