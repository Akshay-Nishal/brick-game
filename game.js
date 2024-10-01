var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballImage = new Image();
ballImage.src = './ball.png';

// Set canvas size dynamically based on window size
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;  // 90% of the viewport width
  canvas.height = window.innerHeight * 0.7; // 70% of the viewport height

  // Recalculate dynamic sizes based on new canvas size
  ballRadius = canvas.width * 0.04; // 4% of canvas width
  paddleHeight = canvas.height * 0.03; // 3% of canvas height
  paddleWidth = canvas.width * 0.20; // 15% of canvas width
  paddleX = (canvas.width - paddleWidth) / 2;

  brickPadding = canvas.width * 0.01; // 1% of canvas width
  brickOffsetTop = canvas.height * 0.1; // 10% of canvas height
  brickOffsetLeft = canvas.width * 0.1; // 10% of canvas width
  brickRowCount = 7;  // Number of rows
  brickColumnCount = 6; // Number of columns
//   brickWidth = (canvas.width - (brickPadding * (brickColumnCount - 1)) - brickOffsetLeft * 2) / brickColumnCount; // Adjusted width
  brickWidth = (canvas.width - brickOffsetLeft * 2 - (brickPadding * (brickColumnCount - 1))) / brickColumnCount; // Adjust the brick width calculation

  brickHeight = canvas.height * 0.03; // 5% of canvas height
  
  // Reset bricks array
  resetBricks();
}

// Initialize bricks array
function resetBricks() {
  bricks = [];
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 }; // Status 1 means visible
    }
  }
}

// Call resize to set initial canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

var dx = canvas.width * 0.005; // Adjust speed based on canvas width
var dy = -canvas.height * 0.005; // Adjust speed based on canvas height
var x = canvas.width / 2; // Ball's initial position
var y = canvas.height - 30; // Ball's initial position

var rightPressed = false;
var leftPressed = false;
var score = 0;
var lives = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function touchMoveHandler(e) {
  var relativeX = e.touches[0].clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0; // Brick is hit
          score++;
          if (score == brickRowCount * brickColumnCount) {
            window.location.href = "gameOver.html";
          }
        }
      }
    }
  }
}

function drawBall() {
    ctx.drawImage(ballImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2); // Adjust size as needed

//   ctx.beginPath();
//   ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
//   ctx.fillStyle = "#DAA520";
//   ctx.fill();
//   ctx.closePath();

}



function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#DAA520";
  ctx.fill();
  ctx.closePath();
}

// function drawBricks() {
//   for (var c = 0; c < brickColumnCount; c++) {
//     for (var r = 0; r < brickRowCount; r++) {
//       if (bricks[c][r].status == 1) {
//         var brickX = r * (brickWidth + (r === 0 ? 0 : brickPadding)) + brickOffsetLeft; // Set padding to 0 if row is 0
//         var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
//         bricks[c][r].x = brickX;
//         bricks[c][r].y = brickY;
//         ctx.beginPath();
//         ctx.rect(brickX, brickY, brickWidth, brickHeight);
//         ctx.fillStyle = "#DAA520";
//         ctx.fill();
//         ctx.closePath();
//       }
//     }
//   }
// }

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = r * (brickWidth + brickPadding) + 23; // Adjust position calculation
          var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
  
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
  
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight); // Use the original brickWidth
          ctx.fillStyle = "#DAA520";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }


function drawScore() {
  var fontSize = canvas.height * 0.030; // 3% of canvas height
  ctx.font = fontSize + "px Arial"; 
  ctx.fillStyle = "#DAA520";
  ctx.fillText("Score: " + score, 8, fontSize); // Position at (8, fontSize)
}

function drawLives() {
  var fontSize = canvas.height * 0.030; // 3% of canvas height
  ctx.font = fontSize + "px Arial"; 
  ctx.fillStyle = "#DAA520";
  ctx.fillText("Lives: " + lives, 8 + 200, fontSize); // Position to the right of score with a margin
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        // alert("GAME OVER");
        // document.location.reload();
        window.location.href = "gameOver.html";
      } else {
        // Reset ball position
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = canvas.width * 0.005; // Reset speed based on canvas width
        dy = -canvas.height * 0.005; // Reset speed based on canvas height
        paddleX = (canvas.width - paddleWidth) / 2; // Reset paddle position
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += canvas.width * 0.01; // Move based on canvas width
  } else if (leftPressed && paddleX > 0) {
    paddleX -= canvas.width * 0.01; // Move based on canvas width
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

// Start the drawing loop
draw();
