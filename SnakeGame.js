const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const GRID_SIZE = 25;  
const TILE_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * TILE_SIZE;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }]; 
let direction = "RIGHT";
let food = getRandomFood();
let running = false;
let score = 0;
let timer = 0;
let gameInterval;
let timerInterval;
let speed;
let selectedDifficulty = null;

document.getElementById("startButton").addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);

function setDifficulty(level) {
    if (level === "easy") speed = 300;
    if (level === "medium") speed = 200;
    if (level === "hard") speed = 100;

    selectedDifficulty = level;
    document.getElementById("startButton").disabled = false;
    document.getElementById("startButton").classList.add("active");
}

function startGame() {
    if (!selectedDifficulty) return;

    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
    direction = "RIGHT";
    food = getRandomFood();
    running = true;
    score = 0;
    timer = 0;

    document.getElementById("score").innerText = `Score: ${score} | Time: ${timer}s`;

    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameInterval = setInterval(moveSnake, speed);
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById("score").innerText = `Score: ${score} | Time: ${timer}s`;
    }, 1000);
}

function getRandomFood() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
    };
}

function moveSnake() {
    let newHead = { ...snake[0] };

    switch (direction) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
    }

    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE || 
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = getRandomFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function gameOver() {
    running = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    alert(`Game Over! Your score: ${score}`);
}

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    if (key === 38 && direction !== "DOWN") direction = "UP";
    if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    if (key === 40 && direction !== "UP") direction = "DOWN";
}

function drawGame() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = "lime";
    snake.forEach((segment, index) => {
        ctx.beginPath();
        let radius = TILE_SIZE / 2;
        ctx.arc(segment.x * TILE_SIZE + radius, segment.y * TILE_SIZE + radius, radius, 0, Math.PI * 2);
        ctx.fill();

        if (index === 0) {
            ctx.fillStyle = "white"; 
            ctx.beginPath();
            ctx.arc(segment.x * TILE_SIZE + radius / 1.5, segment.y * TILE_SIZE + radius / 2, 3, 0, Math.PI * 2);
            ctx.arc(segment.x * TILE_SIZE + radius / 2.5, segment.y * TILE_SIZE + radius / 2, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "lime";
        }
    });

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x * TILE_SIZE + TILE_SIZE / 2, food.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
}
