// Select necessary elements
const characters = document.querySelectorAll('#characters img');
const startButton = document.getElementById('start-game');
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
const gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
const finalScore = document.getElementById('final-score');
const tryAgainButton = document.getElementById('try-again');
const exitButton = document.getElementById('exit');

let selectedCharacter = null;
let characterImage = new Image();
let gravity = 1;
let playerX = 100;
let playerY = 250;
let isJumping = false;
let obstacles = [];
let score = 0;
let isGameOver = false; // New flag to track game state
let gameLoopId;

gameCanvas.width = 800;
gameCanvas.height = 600;

// Character selection logic
characters.forEach((character) => {
  character.addEventListener('click', () => {
    characters.forEach((char) => char.classList.remove('selected'));
    character.classList.add('selected');
    selectedCharacter = character.getAttribute('src');
    startButton.disabled = false;
  });
});

// Start game button logic
startButton.addEventListener('click', () => {
  if (selectedCharacter) {
    characterImage.src = selectedCharacter;
    document.getElementById('character-selection').style.display = 'none';
    gameCanvas.style.display = 'block';
    resetGame();
    startGame();
  }
});

// Reset game state
function resetGame() {
  playerY = 250;
  obstacles = [];
  score = 0;
  isJumping = false;
  isGameOver = false; // Reset game over flag
}

// Game over logic
function endGame() {
  isGameOver = true; // Set game over flag
  cancelAnimationFrame(gameLoopId); // Stop the game loop
  finalScore.textContent = `Your Score: ${score}`;
  gameOverModal.show(); // Show Bootstrap modal
}

// Try again button logic
tryAgainButton.addEventListener('click', () => {
  gameOverModal.hide(); // Hide modal
  resetGame();
  startGame();
});

// Exit button logic
exitButton.addEventListener('click', () => {
  gameOverModal.hide(); // Hide modal
  gameCanvas.style.display = 'none';
  document.getElementById('character-selection').style.display = 'flex';
});

// Create obstacles
function createObstacle() {
  const height = Math.random() * 200 + 50;
  const gap = 180;
  obstacles.push({
    x: gameCanvas.width,
    topHeight: height,
    bottomY: height + gap,
    scored: false // Add a scored flag

  });
}

// Game loop
function updateGame() {
  if (isGameOver) return; // Stop updates if the game is over

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Draw character
  ctx.drawImage(characterImage, playerX, playerY, 180, 80);

  // Gravity and jump logic
  if (!isJumping) playerY += gravity;
  if (playerY + 50 > gameCanvas.height) {
    endGame();
    return;
  }

  // Draw obstacles
  obstacles.forEach((obs, i) => {
    ctx.fillStyle = '#303841';
    ctx.fillRect(obs.x, 0, 50, obs.topHeight);
    ctx.fillRect(obs.x, obs.bottomY, 50, gameCanvas.height - obs.bottomY);

    // Move obstacle
    obs.x -= 4;

    // Remove off-screen obstacles
    if (obs.x + 50 < 0) obstacles.splice(i, 1);

    // Collision detection
    if (
      playerX + 50 > obs.x &&
      playerX < obs.x + 50 &&
      (playerY < obs.topHeight || playerY + 50 > obs.bottomY)
    ) {
      endGame();
      return;
    }

    // Scoring
   // Scoring
if (obs.x + 50 < playerX && !obs.scored) {
  score++;
  obs.scored = true; // Ensure you only score once per obstacle
}

  });

  // Add new obstacles
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 500) {
    createObstacle();
  }

  // Display score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 20);

  gameLoopId = requestAnimationFrame(updateGame);
}

// Start game function
function startGame() {
  resetGame();
  gameLoopId = requestAnimationFrame(updateGame);
}

// Jump controls
document.addEventListener('keydown', (e) => {
  if (!isGameOver && e.code === 'Space') {
    isJumping = true;
    playerY -= 30;
  }
});

document.addEventListener('keyup', (e) => {
  if (!isGameOver && e.code === 'Space') {
    isJumping = false;
  }
});
