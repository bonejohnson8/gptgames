const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gameWidth = canvas.width;
const gameHeight = canvas.height;

// Player settings
const playerWidth = 32;
const playerHeight = 32;

let player = {
    x: gameWidth / 2 - playerWidth / 2,
    y: gameHeight - playerHeight * 2,
    width: playerWidth,
    height: playerHeight
};

let bullets = [];
let enemies = [];
let particles = [];
let score = 0;

function createExplosion(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 - 2,
            radius: Math.random() * 3 + 1,
            alpha: 1
        });
    }
}

// Main game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // Draw the player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw and update bullets
    ctx.fillStyle = 'red';
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullets that are off-screen
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });

    // Draw and update enemies
    ctx.fillStyle = 'green';
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Remove enemies that are off-screen
        if (enemy.y - enemy.height > gameHeight) {
            enemies.splice(index, 1);
        }
    });

    // Draw and update particles
    ctx.fillStyle = 'orange';
    particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.alpha -= 0.01;

        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Remove particles with an alpha less than or equal to zero
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    // Reset global alpha
    ctx.globalAlpha = 1;

    // Collision detection
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Create explosion
                createExplosion(enemy.x, enemy.y);

                // Remove the bullet and the enemy
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);

                // Update the score
                score += 10;
            }
        });
    });

    // Display score
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 20);

    // Refresh the game at 60 frames per second
    requestAnimationFrame(gameLoop);
}

// Spawn enemies at intervals
setInterval(() => {
    enemies.push({
        x: Math.random() * (gameWidth - 32),
        y: -32,
        width: 32,
        height: 32,
        speed: 2 + Math.random() * 3
    });
}, 1000);

// Event listeners for player movement and shooting
document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowLeft':
            player.x -= 5;
            break;
        case 'ArrowRight':
            player.x += 5;
            break;
        case 'Space':
            bullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 10
            });
            break;
    }
});

// Mouse and touch controls
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    player.x = event.clientX - rect.left - player.width / 2;
});

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    player.x = event.touches[0].clientX - rect.left - player.width / 2;
}, { passive: false });

canvas.addEventListener('click', () => {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10
    });
});

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10
    });
}, { passive: false });

// Add an event listener for the start button
document.getElementById('startButton').addEventListener('click', () => {
    // Hide the start screen
    document.getElementById('startScreen').style.display = 'none';

    // Show the game canvas
    canvas.style.display = 'block';

    // Start the game loop
    gameLoop();
});
