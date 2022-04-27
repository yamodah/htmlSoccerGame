const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
const gravity = 0.7;
class Player {
  constructor(position, width, height, color) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.color = color;
    this.velocity = { x: 0, y: 0 };
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fill();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.position.y = canvas.height - 150;
    } else {
      this.velocity.y += gravity;
    }
  }
}

const player1 = new Player({ x: 0, y: 0 }, 75, 150, "blue");
const player2 = new Player({ x: canvas.width - 75, y: 0 }, 75, 150, "red");

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player1.update();
    player2.update();
}
animate()