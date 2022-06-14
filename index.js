import Ball from "./Ball.js";
import Ball2 from "./Ball2.js";
import InputHandler from "./InputHandler.js";
import Vector from "./Vector.js";
import Wall from "./Wall.js";
import WatchDisplay from "./WatchDisplay.js";
import Platform from "./Platform.js";
import Brick from "./Brick.js";

const canvas = document.getElementById('canvas');

class Game {
  constructor() {
    this.balls = [];
    this.walls = [];
    this.ctx = canvas.getContext('2d');
    this.inputHandler = new InputHandler();

    this.init();
    this.render();
  }

  getCoorditatesAfterRotation({ x, y, angle, width, height }) {
    const center = new Vector(x + width / 2, y + height / 2);

    return new Vector(
      (x - center.x) * Math.cos(angle) - (y - center.y) * Math.sin(angle) + center.x,
      (x - center.x) * Math.sin(angle) + (y - center.y) * Math.cos(angle) + center.y
    );
  }

  init() {
    this.device = new WatchDisplay(this.ctx);
    this.platform = new Platform(this);
    this.ball = new Ball2(this);
    this.brick = new Brick(this, this.device.center.x, this.device.center.y);
    // new Array(5).fill(null).forEach((el, index) => {
    //   const ball = new Ball(this, index * 50 + 50, index * 50 + 50, 20);

    //   if (index === 0) ball.controllable = true;

    //   this.balls.push(ball);
    // });

    // const walls = [
    //   new Wall(this, new Vector(300, 150), new Vector(400, 400)),
    //   new Wall(this, new Vector(0, 0), new Vector(canvas.width, 0)),
    //   new Wall(this, new Vector(0, 0), new Vector(0, canvas.height)),
    //   new Wall(this, new Vector(0, canvas.height), new Vector(canvas.width, canvas.height)),
    //   new Wall(this, new Vector(canvas.width, 0), new Vector(canvas.width, canvas.height)),
    // ];

    // walls.forEach(el => this.walls.push(el));
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.device.update();
    this.platform.update();
    this.ball.update();
    this.brick.update();

    // this.balls.forEach(obj => obj.update());
    // this.walls.forEach(obj => obj.update());
  }

  render() {
    this.draw();

    requestAnimationFrame(this.render.bind(this));
  }
}

new Game();
