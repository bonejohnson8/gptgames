// skiFree.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let skierPosition = canvas.width / 2;
let yetiPosition = canvas.width / 2;
let obstacles = [];
let gameOver = false;
let gameStartTime = null;
const yetiDelay = 15000; // 15 seconds in milliseconds

const images = {
  skier: new Image(),
  tree: new Image(),
  yeti: new Image()
};
images.skier.src = 'ski.png';
images.tree.src = 'tree.png';
images.yeti.src = 'yeti.png';

function startGame() {
  skierPosition = canvas.width / 2;
  yetiPosition = Math.random() * canvas.width;
  obstacles = [];
  const safeZone = 100;
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = i * (canvas.height - safeZone) / 10;
    obstacles.push({ x, y });
  }
  gameOver = false;
  gameStartTime = Date.now(); // Record the game start time
  renderGame();
  gameLoop();
}

function gameLoop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Check if enough time has passed to render the yeti
  const elapsedTime = Date.now() - gameStartTime;
  if (elapsedTime > yetiDelay) {
    // Render the yeti and check collision
    ctx.drawImage(images.yeti, yetiPosition - 25, 50, 50, 50);
    if (Math.abs(skierPosition - yetiPosition) < 40) {
      gameOver = true;
      alert('Game Over! Caught by the yeti!');
      return;
    }
  }

  // Check collision with obstacles
  for (const obstacle of obstacles) {
    if (Math.abs(skierPosition - obstacle.x) < 40 && obstacle.y > 400) {
      gameOver = true;
      alert('Game Over! Hit an obstacle!');
      return;
    }
  }

  renderGame();
  requestAnimationFrame(gameLoop);
}

function renderGame() {
  // Draw skier
  ctx.drawImage(images.skier, skierPosition - 25, 450, 50, 50);

  // Draw yeti
  ctx.drawImage(images.yeti, yetiPosition - 25, 50, 50, 50);

  // Draw obstacles
  for (const obstacle of obstacles) {
    ctx.drawImage(images.tree, obstacle.x - 25, obstacle.y, 50, 50);
    obstacle.y += 1; // Move obstacles down
    if (obstacle.y > canvas.height) {
      // Reset the obstacle to the top of the canvas
      obstacle.y = 0;
      obstacle.x = Math.random() * canvas.width;
    }
  }
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
skierPosition = Math.max(0, skierPosition - 10);
} else if (event.key === 'ArrowRight') {
skierPosition = Math.min(canvas.width - 50, skierPosition + 10);
}
});

startGame();
