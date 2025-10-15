const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const resetButton = document.getElementById('reset');
const fullResetButton = document.getElementById('fullReset');
const levelSelect = document.getElementById('level');

const fireworksCanvas = document.getElementById('fireworks');
const fireworksMessage = document.getElementById('fireworksMessage');
const celebrationMusic = document.getElementById('celebrationMusic');
const ctx = fireworksCanvas.getContext('2d');

fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

let board = Array(9).fill('');
let human = 'X';
let ai = 'O';
let currentPlayer = human;
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Scoreboard
let humanScore = 0;
let aiScore = 0;
let tieScore = 0;
let round = 0;

const humanScoreEl = document.getElementById('humanScore');
const aiScoreEl = document.getElementById('aiScore');
const tieScoreEl = document.getElementById('tieScore');
const roundEl = document.getElementById('round');

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
fullResetButton.addEventListener('click', fullReset);

function handleClick(e){
  const index = e.target.dataset.index;
  if(board[index] === '' && currentPlayer === human){
    makeMove(index,human);
    if(!checkWinner(board,human)){
      currentPlayer = ai;
      setTimeout(()=>{
        const aiMove = getAIMove(levelSelect.value);
        makeMove(aiMove, ai);
      }, 300);
    }
  }
}

function makeMove(index, player){
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  const winner = checkWinner(board, player);
  if(winner){
    result.textContent = winner==='tie' ? "It's a tie!" : `${winner} wins! 🎉`;
    cells.forEach(cell=>cell.removeEventListener('click',handleClick));

    // Update scores
    if(winner === human) humanScore++;
    else if(winner === ai) aiScore++;
    else if(winner === 'tie') tieScore++;

    round++;
    updateScoreboard();

    if(winner===human) startCelebration();
  }
  currentPlayer = currentPlayer === human ? ai : human;
}

function checkWinner(board,player){
  let won = null;
  for(let combo of winCombos) if(combo.every(i=>board[i]===player)) won=player;
  if(!won && board.every(c=>c!=='')) won='tie';
  return won;
}

function getAIMove(level){
  const empty = board.map((v,i)=>v===''?i:null).filter(v=>v!==null);
  if(level==='easy') return empty[Math.floor(Math.random()*empty.length)];
  if(level==='medium') return Math.random()<0.5 ? minimax(board,ai).index : empty[Math.floor(Math.random()*empty.length)];
  return minimax(board,ai).index;
}

function minimax(newBoard, player){
  const availSpots = newBoard.map((v,i)=>v===''?i:null).filter(v=>v!==null);
  if(checkWinner(newBoard,human)===human) return {score:-10};
  if(checkWinner(newBoard,ai)===ai) return {score:10};
  if(availSpots.length===0) return {score:0};

  const moves = [];
  for(let i of availSpots){
    const move = {};
    move.index = i;
    newBoard[i] = player;
    move.score = player===ai ? minimax(newBoard,human).score : minimax(newBoard,ai).score;
    newBoard[i] = '';
    moves.push(move);
  }

  let bestMove;
  if(player===ai){
    let bestScore=-Infinity;
    for(let m of moves) if(m.score>bestScore){ bestScore=m.score; bestMove=m; }
  } else {
    let bestScore=Infinity;
    for(let m of moves) if(m.score<bestScore){ bestScore=m.score; bestMove=m; }
  }
  return bestMove;
}

function updateScoreboard(){
  humanScoreEl.textContent = humanScore;
  aiScoreEl.textContent = aiScore;
  tieScoreEl.textContent = tieScore;
  roundEl.textContent = round;
}

function resetGame(){
  board.fill('');
  cells.forEach(cell=>{
    cell.textContent='';
    cell.classList.remove('x','o');
  });
  result.textContent='';
  currentPlayer = human;
  cells.forEach(cell=>cell.addEventListener('click',handleClick));
  stopCelebration();
}

function fullReset(){
  humanScore = 0;
  aiScore = 0;
  tieScore = 0;
  round = 0;
  updateScoreboard();
  resetGame();
}

// ====== Celebration ======
let fireworks = [];
let fireworksInterval;

function createFirework(){
  const colors = ['#ff0040','#00ffff','#fffa00','#ff7f00','#ff00ff','#00ff00','#00ff7f'];
  const count = 50;
  const x = Math.random()*fireworksCanvas.width;
  const y = Math.random()*fireworksCanvas.height/2;
  const sparks = [];
  for(let i=0;i<count;i++){
    const angle = Math.random()*2*Math.PI;
    const speed = Math.random()*5+2;
    sparks.push({
      x, y,
      dx: Math.cos(angle)*speed,
      dy: Math.sin(angle)*speed,
      radius: Math.random()*3+2,
      color: colors[Math.floor(Math.random()*colors.length)],
      alpha:1,
      decay:Math.random()*0.02+0.01
    });
  }
  fireworks.push(sparks);
}

function drawFireworks(){
  ctx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);

  for(let i = fireworks.length-1;i>=0;i--){
    const sparks = fireworks[i];
    for(let j = sparks.length-1;j>=0;j--){
      const s = sparks[j];
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.radius,0,Math.PI*2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
      s.x+=s.dx; s.y+=s.dy; s.alpha-=s.decay;
      if(s.alpha<=0) sparks.splice(j,1);
    }
    if(sparks.length===0) fireworks.splice(i,1);
  }

  requestAnimationFrame(drawFireworks);
}

function startCelebration(){
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
  fireworksMessage.style.display = 'block';
  fireworksInterval = setInterval(createFirework,200);
  drawFireworks();
  
  // Play full music
  celebrationMusic.currentTime = 0;
  celebrationMusic.play();

  // Hide message & fireworks after 3 sec
  setTimeout(()=>{
    fireworksMessage.style.display='none';
    clearInterval(fireworksInterval);
    fireworks=[];
    ctx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);
  },3000);
}

function stopCelebration(){
  fireworksMessage.style.display='none';
  clearInterval(fireworksInterval);
  fireworks=[];
  ctx.clearRect(0,0,fireworksCanvas.width,fireworksCanvas.height);
}
