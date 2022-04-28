const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
const friction = 0.89
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
const ball = new Ball(
  { x: canvas.width / 2, y: canvas.height - 30 },
  30,
  "white",
  { x: 0, y: 0 }
);
const leftGoal = new Goal({x:0,y:canvas.height-300}, 300, 100, "green")
const rightGoal = new Goal({ x: canvas.width - 100, y: canvas.height-300}, 300, 100, "green")
function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  leftGoal.draw()
  rightGoal.draw()
  player1.update();
  player2.update();
  ball.update();

  if (keys.a.pressed && player1.lastKey === "a" && player1.position.x >= 0) {
    player1.velocity.x = -8;
  } else if (keys.d.pressed && player1.lastKey === "d") {
    player1.velocity.x = 8;
  } else {
    player1.velocity.x = 0;
  }
  if (
    keys.ArrowLeft.pressed &&
    player2.lastKey === "ArrowLeft" &&
    player2.position.x >= 0
  ) {
    player2.velocity.x = -8;
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 8;
  } else {
    player2.velocity.x = 0;
  }
  //Circle collision detection
  //player 1 circle detection
  if (rectangleCircleCollison({ circle: ball, rectangle: player1 })) {
    //right side
    if (ball.position.x - ball.radius * 2 >= player1.position.x) {
      ball.velocity.x = 12;
      ball.velocity.y = -10;
      //left side
    } else if (ball.position.x <= player1.position.x) {
      ball.velocity.x = -12;
      ball.velocity.y = -10;
    }
  }

  //player 2 circle detection
  if (rectangleCircleCollison({ circle: ball, rectangle: player2 })) {
    //right side
    if (ball.position.x - ball.radius * 2 >= player2.position.x) {
      ball.velocity.x = 12;
      ball.velocity.y = -10;
      //left side
    } else if (ball.position.x <= player2.position.x) {
      ball.velocity.x = -12;
      ball.velocity.y = -10;
    }
  }
}
animate();
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
