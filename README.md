# Tic-Tac-Toe


Interactive Tic Tac Toe Game with AI, Levels, Scoreboard, Fireworks, and Celebration Music

Technologies Used:

HTML5: Structure and game elements

CSS3: Styling, animations, responsiveness

JavaScript: Game logic, AI (Minimax), event handling, fireworks animation, music

Project Highlights:

Human vs AI gameplay

Difficulty levels (Easy, Medium, Hard)

Interactive animations for X and O

Celebration fireworks with message and music

Scoreboard and round counter

Responsive design

HTML (index.html) Explanation
<h1>Tic Tac Toe</h1>


Displays the game title at the top of the page.

<div id="difficulty">
  <label>Select Difficulty:</label>
  <select id="level">
    <option value="easy">Easy</option>
    <option value="medium" selected>Medium</option>
    <option value="hard">Hard</option>
  </select>
</div>


Dropdown to select AI difficulty.

easy: random moves, medium: partial AI logic, hard: full Minimax AI.

id="level" is referenced in JavaScript for difficulty selection.

<div id="scoreboard">
  <p>Human (X): <span id="humanScore">0</span></p>
  <p>AI (O): <span id="aiScore">0</span></p>
  <p>Ties: <span id="tieScore">0</span></p>
  <p>Round: <span id="round">0</span></p>
</div>


Displays scores and round counter dynamically.

<span> elements updated in JavaScript to reflect real-time scores.

<div id="game">
  <div class="cell" data-index="0"></div>
  ...
  <div class="cell" data-index="8"></div>
</div>


3x3 Tic Tac Toe grid using CSS Grid.

Each cell has a data-index (0–8) for tracking moves in the JS array.

<p id="result"></p>
<button id="reset">Restart Game</button>
<button id="fullReset">Reset All Scores</button>


result: Shows who won the game.

reset: Restart current game without clearing scores.

fullReset: Restart game and reset scores and round counter.

<div id="fireworksMessage">Congratulations! You Win! 🎉</div>
<canvas id="fireworks"></canvas>
<audio id="celebrationMusic" src="celebration.mp3" preload="auto"></audio>


fireworksMessage: Displayed when human wins.

canvas: Used for drawing animated fireworks.

audio: Plays celebration music when player wins.

CSS (style.css) Explanation
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  background: linear-gradient(135deg, #f6d365, #fda085);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


Styles the page with gradient background and centered content.

min-height:100vh ensures full viewport coverage.

#game {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 10px;
  justify-content: center;
}


Creates the 3x3 grid for the game board.

Each cell is 100x100px with 10px gaps.

.cell {
  background-color: #fff;
  font-size: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}
.cell:hover { transform: scale(1.1); background-color: #f8c291; }
.cell.x { color: #e74c3c; animation: pop 0.3s ease; }
.cell.o { color: #3498db; animation: pop 0.3s ease; }

@keyframes pop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}


Each cell has hover effects, round corners, shadows, and animation for X and O using @keyframes pop.

#fireworksMessage {
  position: fixed;
  top:50%; left:50%;
  transform: translate(-50%, -50%);
  font-size:48px;
  color:#FFD700;
  text-shadow: 2px 2px 8px #ff0000, 2px 2px 12px #00ff00;
  display:none;
  z-index:10000;
}


Centers the celebration message on screen with gold text and glowing shadows.

Hidden by default (display:none), shown via JS when human wins.

#fireworks {
  position: fixed;
  top:0; left:0;
  width:100%; height:100%;
  pointer-events:none;
  z-index:9999;
}


Full-screen canvas for fireworks animation.

pointer-events:none ensures it doesn’t block clicks.

JavaScript (script.js) Explanation
Variables and Setup
const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const resetButton = document.getElementById('reset');
const fullResetButton = document.getElementById('fullReset');
const levelSelect = document.getElementById('level');


Get references to HTML elements for later interaction.

const fireworksCanvas = document.getElementById('fireworks');
const fireworksMessage = document.getElementById('fireworksMessage');
const celebrationMusic = document.getElementById('celebrationMusic');
const ctx = fireworksCanvas.getContext('2d');
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;


Setup fireworks canvas and 2D drawing context.

let board = Array(9).fill('');
let human = 'X';
let ai = 'O';
let currentPlayer = human;
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];


board: Array representing game state.

winCombos: All possible winning combinations.

let humanScore = 0, aiScore = 0, tieScore = 0, round = 0;
const humanScoreEl = document.getElementById('humanScore');
const aiScoreEl = document.getElementById('aiScore');
const tieScoreEl = document.getElementById('tieScore');
const roundEl = document.getElementById('round');


Scoreboard variables and DOM references.

Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
fullResetButton.addEventListener('click', fullReset);


Handle user clicks, game reset, and full reset.

Gameplay Logic
function handleClick(e){
  const index = e.target.dataset.index;
  if(board[index]==='' && currentPlayer===human){
    makeMove(index,human);
    if(!checkWinner(board,human)){
      currentPlayer = ai;
      setTimeout(()=>{
        const aiMove = getAIMove(levelSelect.value);
        makeMove(aiMove, ai);
      },300);
    }
  }
}


Handles human moves.

Checks if cell is empty and if it's human's turn.

Calls AI move after a short delay (300ms) for realistic gameplay.

function makeMove(index, player){
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  const winner = checkWinner(board, player);
  if(winner){
    result.textContent = winner==='tie' ? "It's a tie!" : `${winner} wins! 🎉`;
    cells.forEach(cell=>cell.removeEventListener('click',handleClick));

    if(winner === human) humanScore++;
    else if(winner === ai) aiScore++;
    else tieScore++;

    round++;
    updateScoreboard();

    if(winner===human) startCelebration();
  }
  currentPlayer = currentPlayer===human ? ai : human;
}


Updates board array and UI.

Checks winner using checkWinner().

Updates scores and rounds.

Starts celebration if human wins.

AI Logic (Minimax)
function getAIMove(level){
  const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
  if(level==='easy') return empty[Math.floor(Math.random()*empty.length)];
  if(level==='medium') return Math.random()<0.5 ? minimax(board,ai).index : empty[Math.floor(Math.random()*empty.length)];
  return minimax(board,ai).index;
}


Determines AI move based on selected difficulty.

function minimax(newBoard, player){
  // Standard minimax algorithm for AI
}


Minimax algorithm ensures AI plays perfectly on Hard difficulty.

Scoreboard Update
function updateScoreboard(){
  humanScoreEl.textContent = humanScore;
  aiScoreEl.textContent = aiScore;
  tieScoreEl.textContent = tieScore;
  roundEl.textContent = round;
}


Updates HTML with current scores and rounds.

Reset Functions
function resetGame(){ /* clears board only */ }
function fullReset(){ /* clears board and scores */ }

Celebration Fireworks
function createFirework(){ /* generates random sparks */ }
function drawFireworks(){ /* animates sparks using requestAnimationFrame */ }
function startCelebration(){
  fireworksMessage.style.display='block';
  fireworksInterval = setInterval(createFirework,200);
  drawFireworks();
  celebrationMusic.currentTime=0; celebrationMusic.play();
  setTimeout(()=>{
    fireworksMessage.style.display='none';
    clearInterval(fireworksInterval);
    fireworks=[]; ctx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);
  },3000);
}


Creates a fireworks animation with random colored sparks.

Plays celebration music.

Message and fireworks disappear after 3 seconds, while music continues.

Summary of Features

Human vs AI gameplay with difficulty levels.

Fully functional Minimax AI for hard mode.

Real-time scoreboard and round counter.

Animations for X and O.

Celebration fireworks, message, and music on victory.

Responsive design using CSS Grid and flexbox.

This detailed explanation covers every section of the project, so you can:

Add it to your resume: “Developed a fully interactive Tic Tac Toe game with AI, multiple difficulty levels, score tracking, animations, and celebration features using HTML, CSS, and JavaScript.”

Explain in interviews line by line.
