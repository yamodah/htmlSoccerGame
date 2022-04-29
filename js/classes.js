class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = `${imgSrc}`;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }
  update() {
    this.draw();
    this.animateFrames();
  }
  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }
}
class Player extends Sprite{
  constructor({
    position,
    velocity,
    color = "red",
    imgSrc,
    scale = 1,
    framesMax = 1,
    sprites,
    offset = { x: 0, y: 0 },
  }) {
    super({
      position,
      imgSrc,
      scale,
      framesMax,
      offset,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.color = color;

    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;

    for (let sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }
  }
  
  update() {
    this.draw();
    this.animateFrames()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.position.y = canvas.height - 150;
    } else {
      this.velocity.y += gravity;
    }
  }
  switchSprite(sprite) {

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "kick":
        if (this.image !== this.sprites.kick.image) {
          this.image = this.sprites.kick.image;
          this.framesMax = this.sprites.kick.framesMax;
          this.framesCurrent = 0;
          // this.position.y = Math.max(this.position.y, 0);
        }
        break;
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
    if (this.position.y + this.velocity.y >= canvas.height - this.radius - 87) {
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
