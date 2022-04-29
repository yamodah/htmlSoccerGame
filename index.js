const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#startGame");
const startModal = document.querySelector("#startModal");
const restartButton = document.querySelector("#restartGame");
const goalNotification = document.querySelector("#goal");
const goalAnimation = document.querySelector(".goal");

const player1ScoreElement = document.querySelector("#player1Score")
const player2ScoreElement = document.querySelector("#player2Score")

canvas.width = 1200;
canvas.height = 576;
const gravity = 0.7;
const friction = 0.825;
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

const player1 = new Player({ x: 100, y: 0 }, 75, 150, "blue");
const player2 = new Player({ x: canvas.width - 175, y: 0 }, 75, 150, "red");
const ball = new Ball({ x: canvas.width / 2, y: 0 }, 30, "white", {
  x: 0,
  y: 0,
});
const leftGoal = new Goal({ x: 0, y: canvas.height - 300 }, 300, 100, "green", "left");
const rightGoal = new Goal(
  { x: canvas.width - 100, y: canvas.height - 300 },
  300,
  100,
  "green",
  "right"
);
let player1Score = 0
let player2Score = 0
function resetAfterScore() {
  ball.position = { x: canvas.width / 2, y: canvas.height - 30 };
  ball.velocity = { x: 0, y: -20 };
  player1.position = { x: 100, y: 0 };
  player1.velocity = { x: 0, y: 0 };
  player1.lastKey = null;
  player2.position = { x: canvas.width - 175, y: 0 };
  player2.velocity = { x: 0, y: 0 };
  player2.lastKey = null;
}

let gameState;
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  leftGoal.draw();
  rightGoal.draw();
  player1.update();
  player2.update();
  ball.update();
  if (gameState === "play") {
    if (keys.a.pressed && player1.lastKey === "a" && player1.position.x >= 0) {
      player1.velocity.x = -10;
    } else if (
      keys.d.pressed &&
      player1.lastKey === "d" &&
      player1.position.x + player1.width <= canvas.width
    ) {
      player1.velocity.x = 10;
    } else {
      player1.velocity.x = 0;
    }
    if (gameState === "play") {
      if (
        ball.position.x > canvas.width / 2 &&
        ball.position.x < player2.position.x - player2.width
      ) {
        player2.velocity.x = -10;
      } else if (
        ball.position.x >= canvas.width / 2 &&
        ball.position.x > player2.position.x
      ) {
        player2.velocity.x = 10;
      } else {
        player2.velocity.x = 0;
      }
      if (
        ball.position.y <= player2.position.y &&
        ball.velocity.x > 0 &&
        ball.position.x > canvas.width / 2 + player2.width
      ) {
        player2.velocity.y = -20;
      }
    }
    // if (
    //   keys.ArrowLeft.pressed &&
    //   player2.lastKey === "ArrowLeft" &&
    //   player2.position.x >= 0
    // ) {
    //   player2.velocity.x = -10;
    // } else if (
    //   keys.ArrowRight.pressed &&
    //   player2.lastKey === "ArrowRight" &&
    //   player2.position.x + player2.width <= canvas.width
    // ) {
    //   player2.velocity.x = 10;
    // } else {
    //   player2.velocity.x = 0;
    // }
  }

  //Circle collision detection

  //creating randomness in ball movement
  const randomFactor = Math.random();
  const highBall = -(Math.random() * (20 - 12) + 12);
  const lowBall = -(Math.random() * (12 - 5) + 5);
  const fastBall = Math.random() * (20 - 15) + 15;
  const slowBall = Math.random() * (15 - 10) + 10;

  //player 1 circle detection
  if (rectangleCircleCollison({ circle: ball, rectangle: player1 })) {
    //right side
    if (ball.position.x - ball.radius * 2 >= player1.position.x) {
      ball.velocity.x = randomFactor > 0.5 ? fastBall : slowBall;
      ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
      //left side
    } else {
      ball.velocity.x = randomFactor > 0.5 ? -fastBall : -slowBall;
      ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
    }
  }

  //player 2 circle detection
  if (rectangleCircleCollison({ circle: ball, rectangle: player2 })) {
    //right side
    if (ball.position.x - ball.radius * 2 >= player2.position.x) {
      ball.velocity.x = randomFactor > 0.5 ? fastBall : slowBall;
      ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
      //left side
    } else {
      ball.velocity.x = randomFactor > 0.5 ? -fastBall : -slowBall;
      ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
    }
  }

  //Score Detection
  //player 1 goal
  if (
    rectangleCircleCollison({ circle: ball, rectangle: leftGoal }) &&
    ball.position.y <= leftGoal.height
  ) {
    ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
    ball.velocity.x = -ball.velocity.x;
  } else if (
    rectangleCircleCollison({ circle: ball, rectangle: leftGoal }) &&
    ball.position.x - ball.radius * 2 < leftGoal.position.x
  ) {
    player2Score++
    player2ScoreElement.innerHTML = player2Score
    goalNotification.style.display = "flex";
    goalNotification.classList.add("goal");
    resetAfterScore();
  }

  //player 2 goal
  if (
    rectangleCircleCollison({ circle: ball, rectangle: rightGoal }) &&
    ball.position.y <= rightGoal.height
  ) {
    ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
    ball.velocity.x = -ball.velocity.x;
  } else if (
    rectangleCircleCollison({ circle: ball, rectangle: rightGoal }) &&
    ball.position.x > rightGoal.position.x + (ball.radius + 5)
  ) {
    player1Score++
    player1ScoreElement.innerHTML = player1Score
    goalNotification.style.display = "flex";
    goalNotification.classList.add("goal");
    resetAfterScore();
  }

  //player vs player bump collision
  if (
    rectangularCollision({ rectangle1: player1, rectangle2: player2 }) &&
    player1.position.x < player2.position.x
  ) {
    player1.velocity.x = -20;
    player2.velocity.x = 20;
  } else if (
    rectangularCollision({ rectangle1: player1, rectangle2: player2 }) &&
    player2.position.x < player1.position.x
  ) {
    player1.velocity.x = 20;
    player2.velocity.x = -20;
  }

  //out of bounds logic
  if (
    ball.position.x - ball.radius > canvas.width ||
    ball.position.x + ball.radius < 0
  ) {
    resetAfterScore();
  }
}
animate();
startButton.addEventListener("click", () => {
  startModal.style.display = "none";
  gameState = "play";
  ball.velocity.y = -20;
});
restartButton.addEventListener("click", () => {
  location.reload();
});
goalAnimation.addEventListener("animationend", () => {
  goalNotification.style.display = "none";
  goalNotification.classList.remove("goal");
});
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player1.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player1.lastKey = "a";
      break;
    case "w":
      if (player1.position.y > canvas.height / 2) {
        player1.velocity.y = -20;
      }
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      player2.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (player2.position.y > canvas.height / 2) {
        player2.velocity.y = -20;
      }
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});