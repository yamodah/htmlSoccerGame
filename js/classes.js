class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
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
class Player extends Sprite {
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
    this.height = 50;
    this.width = 45;
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
    this.animateFrames();
    //uncomment to see hit box
    // ctx.fillStyle = "rgba(255,255,255,0.15)"
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    this.position.x += isMobile() ? this.velocity.x / 1.45 : this.velocity.x;
    this.position.y += isMobile() ? this.velocity.y / 1.45 : this.velocity.y;
    
    if(isMobile()){
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 60) {
        this.velocity.y = 0;
        this.position.y = canvas.height - 110;
      } else {
        this.velocity.y += gravity;
      }
    }else{
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 84) {
        this.velocity.y = 0;
        this.position.y = canvas.height - 130;
      } else {
        this.velocity.y += gravity;
      }
    }
  }
  switchSprite(sprite) {
    if (
      this.image === this.sprites.run.image &&
      this.framesCurrent < this.sprites.run.framesMax - 1
    )
      return;

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
class Ball extends Sprite {
  constructor({
    position,
    radius,
    color,
    velocity,
    imgSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    super({
      position,
      imgSrc,
      scale,
      framesMax,
      offset,
    });
    this.position = position;
    this.radius = isMobile() ? radius / 2 : radius;
    this.color = color;
    this.velocity = velocity;
    this.image = new Image();
    this.image.src = `${imgSrc}`;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
  update() {
    this.draw();

    this.position.x += isMobile() ? this.velocity.x / 1.45 : this.velocity.x;
    this.position.y += isMobile() ? this.velocity.y / 1.45 : this.velocity.y;

    if (isMobile()) {
      if (
        this.position.y + this.velocity.y >=
        canvas.height - this.radius - 60
      ) {
        this.velocity.y = -this.velocity.y / 1.75;
        this.velocity.x = this.velocity.x * friction;
      } else {
        this.velocity.y += gravity;
      }
    } else {
      if (
        this.position.y + this.velocity.y >=
        canvas.height - this.radius - 87
      ) {
        this.velocity.y = -this.velocity.y / 1.75;
        this.velocity.x = this.velocity.x * friction;
      } else {
        this.velocity.y += gravity;
      }
    }
  }
}
class Goal {
  constructor(position, height, width, color, side) {
    this.position = position;
    this.height = isMobile() ? height / 2 : height;
    this.width = isMobile() ? width / 1.25 : width;
    this.color = color;
    this.side = side;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillRect(this.position.x, this.position.y - 2, this.width, 15);
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
