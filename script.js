//start variables
const startPage = document.getElementById("start");
const startTitle = document.getElementById("start-title");
const selectPlayer = document.getElementById("select-player");
const selectX = document.getElementById("select-x");
const selectO = document.getElementById("select-o");
const game = document.getElementById("game");
const statusDisplay = document.getElementById("main__status-display");

//button variables 
const startGame = document.getElementById("start-game-button");
const backButton = document.getElementById('back-button');
const resetButton = document.getElementById('reset-button');
const nextButton = document.getElementById('next-button');
const historyButton = document.getElementById('history-button');
const historyCloseButton = document.getElementById('history__close-button');
const exitButton = document.getElementById("exit-button-img");


//board variables 
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const boxName = [
    ["Top-left","Top-middle","Top-right"],
    ["Middle-left", "Middle", "Middle-right"],
    ["Bottom-left", "Bottom-middle", "Bottom-right"]
];
const boxes = document.querySelectorAll('.box');


//game state variables 
const xScoreDisplay = document.getElementById('x-score');
const oScoreDisplay = document.getElementById('o-score');
const gameHistoryContainer =  document.getElementById("game-history__container");
const gameHistoryDisplay = document.getElementById("game-history-display");
const moveHistory = [];
let xScoreValue = 0;
let oScoreValue = 0;
let currentPlayer; 
let gameActive = true; //variable to track if the game is still active
let currentMoveIndex = -1;



//functions 
boxes.forEach((box, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;

    box.addEventListener('click', () => {

        if (gameActive && board[row][col] === '') { //checks if the game is active and the box is empty
            updateBoard(row, col);
            updateGameHistoryDisplay(row, col);
            box.textContent = currentPlayer; //updates the box with the current player's symbol
            const winner = checkWin();
            if (winner) {
                statusDisplay.textContent = `Player ${winner} wins!`;
                statusDisplay.style.color = '#27AAE1';
                backButton.style.display = "block";
                historyButton.style.display = "block";
            } else if (checkDraw()) {
                statusDisplay.textContent = `It's a draw!`;
                statusDisplay.style.color = '#27AAE1';
                backButton.style.display = "block";
                historyButton.style.display = "block";
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; //updates the current player: if the currentPlayer is 'X' it assigns the currentPLayer value to 'O', otherwise it assigns the value to 'X'
                statusDisplay.textContent = `Player ${currentPlayer}'s move`; //updates the status display
            }
            
        }
    });
});


function updateBoard(row, col) {
    board[row][col] = currentPlayer;
    updateGameHistory();
}

function updateGameHistory() {
    const boardCopy = board.map(row => row.slice()); //creates a copy of the board
    moveHistory.push(boardCopy);
    currentMoveIndex++;
}

function updateBoardFromHistory(index) {
    const boardState = moveHistory[index];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] !== boardState[i][j]) {
                board[i][j] = boardState[i][j];
                boxes[i * 3 + j].textContent = boardState[i][j];
            }
        }
    }
}

function updateGameHistoryDisplay(row,col){
    const historyItem = document.createElement ('li');
    historyItem.textContent = `${currentPlayer}: ${boxName[row][col]}`;
    gameHistoryDisplay.append(historyItem);
}

function checkWin() {
    for (const combination of winningCombination) {
        const [a, b, c] = combination; //destructuring assignment
        if (
            board[Math.floor(a / 3)][a % 3] && 
            board[Math.floor(a / 3)][a % 3] === 
            board[Math.floor(b / 3)][b % 3] && 
            board[Math.floor(a / 3)][a % 3] === 
            board[Math.floor(c / 3)][c % 3]
            ) {

            gameActive = false; //sets the game as inactive and prevents the player from adding input to the board. 
            
            if (currentPlayer === 'X') {
                xScoreValue++;
                xScoreDisplay.textContent = `X: ${xScoreValue}`;
            } else if (currentPlayer === 'O') {
                oScoreValue++;
                oScoreDisplay.textContent = `O: ${oScoreValue}`;
            }

            boxes[a].style.color = '#EE2A7B';
            boxes[b].style.color = '#EE2A7B';
            boxes[c].style.color = '#EE2A7B';

            return board[Math.floor(a / 3)][a % 3];
        }
    }
    return false;
}


function checkDraw() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    gameActive = false; //sets the game as not active when it's a draw
    return true;
}



function resetGame() {
    //determines the player who lost in the last game
    const lastWinner = currentPlayer === 'X' ? 'O' : 'X';

    //sets the currentPlayer to the player who lost, so they play first in the next game
    currentPlayer = lastWinner;

    //resets the game state to its initial state
    board.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            board[rowIndex][colIndex] = '';
        });
    });

    //clears the content of each box and re-enable them for clicking
    boxes.forEach(box => {
        box.textContent = '';
        box.style.color = 'white';
        box.disabled = false;
    });

    //resets other game-related variables
    gameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s move`;
    statusDisplay.style.color = 'white';
    backButton.style.display = "none";
    nextButton.style.display = "none";
    historyButton.style.display = "none";

    //clears move history
    moveHistory.length = 0;
    currentMoveIndex = -1;

    //clears the content of gameHistoryDisplay
    gameHistoryDisplay.innerHTML = '';
    gameHistoryContainer.style.display = "none";
}



//event listeners
startGame.addEventListener('click', ()=>{
    startGame.style.display = "none";
    startTitle.style.display = "none";
    selectPlayer.style.display = "flex";
})

selectX.addEventListener('click',()=>{
    currentPlayer = 'X';
    startPage.style.display = "none";
    game.style.display = "block";
    statusDisplay.textContent = `Player ${currentPlayer}'s move`;
});

selectO.addEventListener('click',()=>{
    currentPlayer = 'O';
    startPage.style.display = "none";
    game.style.display = "block";
    statusDisplay.textContent = `Player ${currentPlayer}'s move`;
})

backButton.addEventListener('click', () => {
    nextButton.style.display = "block";
    if (currentMoveIndex > 0) {
        currentMoveIndex--;
        updateBoardFromHistory(currentMoveIndex);
        if(currentMoveIndex === 0){
            backButton.style.display = "none";
        }
    }
});

nextButton.addEventListener('click', () => {
    backButton.style.display = "block";
    if (currentMoveIndex < moveHistory.length - 1) {
        currentMoveIndex++;
        updateBoardFromHistory(currentMoveIndex);
        if(currentMoveIndex === moveHistory.length - 1){
            nextButton.style.display = "none";
        }
    }
});

historyButton.addEventListener("click",()=>{
    gameHistoryContainer.style.display = "flex";
    historyButton.style.display ="none";
});

historyCloseButton.addEventListener("click",()=>{
    gameHistoryContainer.style.display = "none";
    historyButton.style.display ="block";
});

resetButton.addEventListener('click', () => {
    resetGame();
});


exitButton.addEventListener('click', ()=> {
    location.reload();
  });