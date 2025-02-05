const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 200, y: 200 }];
let food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
};
let dx = box;
let dy = 0;
let score = 0;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;
    if (keyPressed === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -box;
    } else if (keyPressed === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = box;
    } else if (keyPressed === "ArrowLeft" && dx === 0) {
        dx = -box;
        dy = 0;
    } else if (keyPressed === "ArrowRight" && dx === 0) {
        dx = box;
        dy = 0;
    }
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } else {
        snake.pop();
    }

    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(game);
        alert("Game Over! Your score: " + score);
    }

    snake.unshift(head);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "lime";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameLoop() {
    update();
    draw();
}

const game = setInterval(gameLoop, 100);
