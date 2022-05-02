const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const startButton = document.querySelector("#startGame");
const startModal = document.querySelector("#startModal");
const restartButton = document.querySelector("#restartGame");
const controlsElement = document.querySelector(".controls");

const goalNotification = document.querySelector("#goal");
const goalAnimation = document.querySelector(".goal");
const titleElement = document.querySelector("#title");
const mobileTouchToStart = document.querySelector("#mobileStart");

const scoreElement = document.querySelector("#score");
const player1ScoreElement = document.querySelector("#player1Score");
const player2ScoreElement = document.querySelector("#player2Score");
const resultElement = document.querySelector("#result");

let leftJoystickDirection;
let rightJoystickDirection;
const joyParam = {
  width: 105,
  height: 105,
  internalFillColor: "white",
  externalStrokeColor: "rgb(156, 163, 175, 0.5)",
};
const leftJoystick = new JoyStick("joyDiv", joyParam, function (stickData) {
  leftJoystickDirection = stickData.cardinalDirection;
});
const rightJoystick = new JoyStick("joyDiv2", joyParam, function (stickData) {
  rightJoystickDirection = stickData.cardinalDirection;
});
// console.log("xpositions", leftJoystickDirection, rightJoystickDirection);
// console.log("xpositions",rightJoystick.yPosition, leftJoystick.yPosition)
canvas.width = 1200;
canvas.height = 776;

function isMobile() {
  return getComputedStyle(controlsElement).flexDirection === "row";
}
if (isMobile()) {
  mobileTouchToStart.style.display = "flex";
  canvas.height = 390;
  canvas.width = 844;
}
const gravity = 0.8;
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
const background = new Sprite({
  position: { x: 0, y: 0 },
  imgSrc: !isMobile()
    ? "./assets/Background.png"
    : "./assets/mobile-background.png",
});
const player1 = new Player({
  position: { x: 75, y: 0 },
  velocity: { x: 0, y: 0 },
  imgSrc: "./assets/red/red-idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 5,
    y: isMobile() ? 0 : 3,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/red/red-idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./assets/red/red-run.png",
      framesMax: 6,
    },
    kick: {
      imgSrc: "./assets/red/red-kick.png",
      framesMax: 4,
    },
  },
});
const player2 = new Player({
  position: { x: canvas.width - 130, y: 150 },
  velocity: { x: 0, y: 0 },
  imgSrc: "./assets/blue/blue-idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 11,
    y: isMobile() ? 0 : 3,
  },
  sprites: {
    idle: {
      imgSrc: "./assets/blue/blue-idle.png",
      framesMax: 4,
    },
    run: {
      imgSrc: "./assets/blue/blue-run.png",
      framesMax: 6,
    },
    kick: {
      imgSrc: "./assets/blue/blue-kick.png",
      framesMax: 4,
    },
  },
});
const ball = new Ball({
  position: { x: canvas.width / 2, y: 0 },
  radius: 30,
  color: "white",
  imgSrc: isMobile() ? "./assets/futbol-mobile.png" : "./assets/futbol.png",
  velocity: { x: 0, y: 0 },
  offset: {
    x: isMobile() ? 15 : 30,
    y: isMobile() ? 15 : 28,
  },
});
const leftGoal = new Goal(
  { x: 0, y: isMobile() ? canvas.height - 171 : canvas.height - 309 },
  225,
  100,
  "#10B981",
  "left"
);
const rightGoal = new Goal(
  {
    x: isMobile() ? canvas.width - 80 : canvas.width - 100,
    y: isMobile() ? canvas.height - 171 : canvas.height - 309,
  },
  225,
  100,
  "#10B981",
  "right"
);
const rightNet = new Sprite({
  position: {
    x: isMobile() ? canvas.width - 80 : canvas.width - 100,
    y: isMobile() ? canvas.height - 159 : canvas.height - 295,
  },
  imgSrc: !isMobile()
    ? "./assets/nets/mid-res-net.png"
    : "./assets/nets/mid-res-mobile-net.png",
});
const leftNet = new Sprite({
  position: {
    x: 10,
    y: isMobile() ? canvas.height - 159 : canvas.height - 295,
  },
  imgSrc: !isMobile()
    ? "./assets/nets/mid-res-net.png"
    : "./assets/nets/mid-res-mobile-net.png",
});

const crossbarOffset = isMobile() ? 135 : 300;
let player1Score = 0;
let player2Score = 0;

function resetAfterScore() {
  ball.position = { x: canvas.width / 2, y: canvas.height - 117 };
  ball.velocity = { x: 0, y: -20 };
  player1.position = { x: 100, y: 0 };
  player1.velocity = { x: 0, y: 0 };
  player1.lastKey = null;
  player2.position = { x: canvas.width - 175, y: 0 };
  player2.velocity = { x: 0, y: 0 };
  player2.lastKey = null;
}
function resetGame() {
  player1Score = 0;
  player2Score = 0;
  player1ScoreElement.innerHTML = player1Score;
  player2ScoreElement.innerHTML = player2Score;
  restartButton.style.display = "none";
  resultElement.style.display = "none";
  gameState = "play";
  resetAfterScore();
}
let gameState = "start";
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.width);
  background.update();

  leftGoal.draw();
  rightGoal.draw();
  rightNet.update();
  leftNet.update();
  player1.update();
  player2.update();
  ball.update();
  if (gameState === "play") {
    if (!isMobile()) {
      if (
        keys.a.pressed &&
        player1.lastKey === "a" &&
        player1.position.x >= 0
      ) {
        player1.velocity.x = -10;
        player1.switchSprite("run");
      } else if (
        keys.d.pressed &&
        player1.lastKey === "d" &&
        player1.position.x + player1.width <= canvas.width
      ) {
        player1.velocity.x = 10;
        player1.switchSprite("run");
      } else {
        player1.velocity.x = 0;
        player1.switchSprite("idle");
      }
    } else {
      if (
        (/W/g.test(leftJoystickDirection) ||
          /W/g.test(rightJoystickDirection)) &&
        player1.position.x >= 0
      ) {
        player1.velocity.x = -10;
        player1.switchSprite("run");
      } else if (
        (/E/g.test(leftJoystickDirection) ||
          /E/g.test(rightJoystickDirection)) &&
        player1.position.x + player1.width <= canvas.width
      ) {
        player1.velocity.x = 10;
        player1.switchSprite("run");
      } else {
        player1.velocity.x = 0;
        player1.switchSprite("idle");
      }
      if (
        (/N/g.test(leftJoystickDirection) ||
          /N/g.test(rightJoystickDirection)) &&
        player1.position.y > canvas.height / 2
      ) {
        player1.velocity.y = -15;
      }
    }
  }

  if (player1.velocity.x === 0) {
    player1.switchSprite("idle");
  }
  //player2 (cpu) movement
  if (!isMobile()) {
    if (
      ball.position.x > canvas.width / 2 &&
      ball.position.x < player2.position.x - player2.width
    ) {
      player2.velocity.x = -10;
      player2.switchSprite("run");
    } else if (
      ball.position.x >= canvas.width / 2 &&
      ball.position.x > player2.position.x &&
      player2.position.x < canvas.width - rightGoal.width - ball.radius * 2
    ) {
      player2.velocity.x = 10;
      player2.switchSprite("run");
    } else {
      player2.velocity.x = 0;
      player2.switchSprite("idle");
    }
    if (
      ball.position.y <= player2.position.y &&
      ball.velocity.x > 0 &&
      ball.position.x > canvas.width / 2 + player2.width
    ) {
      player2.velocity.y = -15;
    }
  } else {
    if (
      ball.position.x > canvas.width / 1.75 &&
      ball.position.x < player2.position.x - player2.width
    ) {
      player2.velocity.x = -10;
    } else if (
      ball.position.x >= canvas.width / 1.75 &&
      ball.position.x > player2.position.x &&
      player2.position.x < canvas.width - rightGoal.width - ball.radius * 4
    ) {
      player2.velocity.x = 10;
      player2.switchSprite("run");
    } else {
      player2.velocity.x = 0;
      player2.switchSprite("idle");
    }
    if (
      ball.position.y <= player2.position.y &&
      ball.velocity.x > 0 &&
      ball.position.x > canvas.width / 1.75 + player2.width &&
      player2.position.y > canvas.height / 2
    ) {
      player2.velocity.y = -10;
    }
  }

  // uncomment to test player 2 physics/animation manually

  /* if (
      keys.ArrowLeft.pressed &&
      player2.lastKey === "ArrowLeft" &&
      player2.position.x >= 0
    ) {
      player2.velocity.x = -10;
    } else if (
      keys.ArrowRight.pressed &&
      player2.lastKey === "ArrowRight" &&
      player2.position.x + player2.width <= canvas.width
    ) {
      player2.velocity.x = 10;
    } else {
      player2.velocity.x = 0;
    }
  */

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
    if (
      ball.position.x - ball.radius * 2 >=
      player1.position.x - player1.width / 2
    ) {
      ball.velocity.x = randomFactor > 0.5 ? fastBall : slowBall;
      ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;

      //left side
    } else {
      ball.velocity.x = randomFactor > 0.5 ? -fastBall : -slowBall;
      ball.velocity.y = highBall;
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
    ball.position.y + ball.radius <= leftGoal.height + crossbarOffset
  ) {
    ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
    ball.velocity.x = -ball.velocity.x;
  } else if (
    rectangleCircleCollison({ circle: ball, rectangle: leftGoal }) &&
    ball.position.x - ball.radius * 2 < leftGoal.position.x + ball.radius
  ) {
    player2Score++;
    player2ScoreElement.innerHTML = player2Score;
    goalNotification.style.display = "flex";
    goalNotification.classList.add("goal");
    resetAfterScore();
    if (player2Score >= 5) {
      gameState = "gameOver";
      setTimeout(() => {
        resultElement.style.display = "flex";
        resultElement.innerHTML = "<h1>YOU LOSE<h1>";
      }, 1000);
      setTimeout(() => {
        restartButton.style.display = "flex";
      }, 2000);
    }
  }

  //player 2 goal
  if (
    rectangleCircleCollison({ circle: ball, rectangle: rightGoal }) &&
    ball.position.y + ball.radius <= rightGoal.height + crossbarOffset
  ) {
    ball.velocity.y = randomFactor > 0.5 ? highBall : lowBall;
    ball.velocity.x = -ball.velocity.x;
  } else if (
    rectangleCircleCollison({ circle: ball, rectangle: rightGoal }) &&
    ball.position.x > rightGoal.position.x + (ball.radius + 5)
  ) {
    player1Score++;
    player1ScoreElement.innerHTML = player1Score;
    goalNotification.style.display = "flex";
    goalNotification.classList.add("goal");
    if (player1Score >= 5) {
      gameState = "gameOver";
      setTimeout(() => {
        resultElement.style.display = "flex";
        resultElement.innerHTML = "<h1>YOU WIN<h1>";
      }, 1000);
      setTimeout(() => {
        restartButton.style.display = "flex";
      }, 2000);
    }
    resetAfterScore();
  }

  //out of bounds logic
  if (
    ball.position.x - ball.radius > canvas.width ||
    ball.position.x + ball.radius < 0
  ) {
    ball.velocity.x = -ball.velocity.x;
  } else if (ball.position.y + ball.velocity.y < 0) {
    ball.velocity.y = -ball.velocity.y;
  }
}

animate();

startButton.addEventListener("click", () => {
  scoreElement.style.display = "flex";
  startModal.style.display = "none";
  titleElement.classList.add("title");
  gameState = "play";
  ball.velocity.y = -20;
});
window.addEventListener("touchstart", () => {
  if (gameState === "start") {
    scoreElement.style.display = "flex";
    mobileTouchToStart.style.display = "none";
    titleElement.classList.add("title");
    gameState = "play";
    ball.velocity.y = -20;
  }
});
restartButton.addEventListener("click", () => {
  resetGame();
});
goalAnimation.addEventListener("animationend", () => {
  goalNotification.style.display = "none";
  goalNotification.classList.remove("goal");
});
titleElement.addEventListener("animationend", () => {
  titleElement.style.display = "none";
  titleElement.classList.remove("title");
  scoreElement.classList.add("score");
  //   scoreElement.style.display = "flex"
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

  //uncomment for player 2 testing purposes
  /*
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
   */
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

    //uncomment for player 2 testing purposes
    /*
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
      */
  }
});

