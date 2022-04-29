class Player {
  constructor(position, width, height, color) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.color = color;
    this.velocity = { x: 0, y: 0 };
    this.lastKey;
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
class Ball {
  constructor(position, radius, color, velocity) {
    this.position = position;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.velocity.y >= canvas.height - this.radius) {
      this.velocity.y = -this.velocity.y / 1.75;
      this.velocity.x = this.velocity.x * friction;
    } else {
      this.velocity.y += gravity;
      //   console.log("fall")
    }
  }
}
class Goal {
  constructor(position, height, width, color, side) {
    this.position = position;
    this.height = height;
    this.width = width;
    this.color = color;
    this.side = side;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y-2, this.width, 15);
    this.side === "left"
      ? ctx.fillRect(this.position.x, this.position.y, 10, this.height)
      : ctx.fillRect(
          this.position.x + this.width - 10,
          this.position.y,
          10,
          this.height
        );

    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 3;
    // if (this.side === "left") {
    //   for (let i = 1; i < 20; i++) {
    //     ctx.moveTo(this.position.x + this.width - i * 20, this.position.y);
    //     ctx.lineTo(this.position.x + this.width, this.position.y + i * 20);
        
    //   }
    // }
    

    
    // ctx.stroke();

  }
}
