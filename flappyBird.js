//Flappy Bird js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const soundToggleButton = document.getElementById('soundToggle');
const closeMenuButton = document.getElementById('closeMenu');
const startScreen = document.getElementById('startScreen');
const difficultyButtons = document.querySelectorAll('.difficulty-button');


let pipeGap = 150; // Default value
let pipeSpeed = 3; // Default value
let gameStarted = false;
let gameOver = false;
let soundOn = true;
let isPaused = true;
let score = 0;
let frames = 0;
let highScore = localStorage.getItem('highScore') || 0;
startScreen.style.display = 'flex';
menu.style.display = 'none';


// playButton.addEventListener('click', () => {
//     if (!gameStarted) {
//         startScreen.style.display = 'none'; // Hide the start screen
//         isPaused = false;  // Ensure the game is not paused
//         gameStarted = true;
//         gameLoop(); // Start the game loop
//     }
// });

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameStarted) {
        startScreen.style.display = 'none';
        isPaused = false;
        gameStarted = true;
        gameLoop();
    } else if (event.code === 'Escape') {
        toggleMenu();
    } else if (event.code === 'Space') {
        if (gameOver) {
            resetGame();
            gameLoop();
        } else {
            bird.velocity = bird.lift;
            playSound(jumpSound);
        }
    }
});
document.addEventListener('touchstart', (event) => {
    event.preventDefault(); // منع السلوك الافتراضي (مثل التمرير)

    if (!gameStarted) {
        startScreen.style.display = 'none';
        isPaused = false;
        gameStarted = true;
        gameLoop();
    } else if (gameOver) {
        resetGame();
        gameLoop();
    } else {
        bird.velocity = bird.lift;
        playSound(jumpSound);
    }
}, { passive: false }); // ضمان إمكانية منع السلوك الافتراضي



// Function to resize canvas to full screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

difficultyButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const mode = event.target.dataset.mode;
        switch (mode) {
            case 'easy':
                pipeGap = 200;
                pipeSpeed = 3;
                break;
            case 'medium':
                pipeGap = 150;
                pipeSpeed = 6;
                break;
            case 'hard':
                pipeGap = 120;
                pipeSpeed = 10;
                break;
        }

        startScreen.style.display = 'none'; // Hide start screen
        isPaused = false;
        gameStarted = true;
        gameLoop();
    });
});

// Load images
const bgImage = new Image();
bgImage.src = 'Flappy-Bird-sky.png';  // Background image
const birdImg = new Image();
birdImg.src = 'Flappy-Bird.png';  // Bird image

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    gravity: 1,
    lift: -15,
    velocity: 0
};

const pipes = [];
const pipeWidth = 80;
// const pipeGap = 150; // Adjusted for larger screen sizes
// let score = 0;
// let frames = 0;
// let gameOver = false;
// let soundOn = true;
// let isPaused = false;

// const jumpSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
// const gameOverSound = new Audio('https://www.soundjay.com/button/beep-10.wav');

function playSound(sound) {
    if (soundOn) sound.play();
}

function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5; 
        const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        gradient.addColorStop(0, '#228B22');
        gradient.addColorStop(1, '#006400');

        ctx.fillStyle = gradient;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);

        ctx.fillStyle = '#006400';
        ctx.fillRect(pipe.x - 5, pipe.top - 10, pipeWidth + 10, 10);
        ctx.fillRect(pipe.x - 5, pipe.top + pipeGap, pipeWidth + 10, 10);
        ctx.shadowColor = "transparent";
    });
} score++;

function updatePipes() {
    if (frames % 100 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height / 2)) + 50;
        pipes.push({ x: canvas.width, top: pipeHeight });
    }
    pipes.forEach(pipe => pipe.x -= pipeSpeed);

    if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }
}
// function showGameOverEffect() {
//     confetti({
//         particleCount: 150,
//         spread: 70,
//         origin: { y: 0.6 }
//     });
// }

function checkCollision() {
    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)
        ) {
            gameOver = true;
            showGameOverScreen(); // Call this directly for testing
            playSound(gameOverSound);
        }
    });


}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    bird.velocity *= 0.9;
}

// let highScore = localStorage.getItem('highScore') || 0;

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`High Score: ${highScore}`, 20, 70);
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function resetGame() {
    updateHighScore();
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    gameOver = false;
    frames = 0;
}
function toggleMenu() {
    if (menu.style.display === 'none' || !menu.style.display) {
        isPaused = true;
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
        isPaused = false;
        if (gameStarted) {
            gameLoop();
        }
    }
}

function showGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Game Over!`, canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '32px Poppins, sans-serif';
    ctx.fillText(`Your score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Tap SPACE to try again`, canvas.width / 2, canvas.height / 2 + 50);

    // showGameOverEffect();
}
function gameLoop() {
    if (gameOver) {
        showGameOverScreen();
        return;
    }

    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBird();
    drawPipes();
    drawScore();
    updateBird();
    updatePipes();
    checkCollision();
    frames++;
    requestAnimationFrame(gameLoop);
}



document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (gameOver) {
            
            resetGame();
            gameLoop();
        } else {
            bird.velocity = bird.lift;
        }
    } else if (event.code === 'Escape') {
        toggleMenu();
    }
});

restartButton.addEventListener('click', () => {
    resetGame();
    gameLoop();
    toggleMenu();
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    if (!isPaused) gameLoop();
});

soundToggleButton.addEventListener('click', () => {
    soundOn = !soundOn;
    alert(`Sound is now ${soundOn ? 'ON' : 'OFF'}`);
});

closeMenuButton.addEventListener('click', toggleMenu);

gameLoop();


