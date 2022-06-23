import Ball from "./Ball.js";
import Ball2 from "./Ball2.js";
import InputHandler from "./InputHandler.js";
import Vector from "./Vector.js";
import Wall from "./Wall.js";
import WatchDisplay from "./WatchDisplay.js";
import Platform from "./Platform.js";
import Brick from "./Brick.js";
import levelGeneration from "./levels/index.js";
import Background from "./Background.js";

const canvas = document.getElementById('canvas');

class Game {
  constructor(level) {
    this.level = level;
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
    this.background = new Background(this.ctx);
    this.device = new WatchDisplay(this.ctx);
    this.platform = new Platform(this);
    this.ball = new Ball2(this);
    this.bricks = levelGeneration(this, this.level);

    this.bricks.forEach(brick => {
      brick.on('die', () => {
        this.bricks.splice(this.bricks.indexOf(brick), 1);
      });
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.background.update();
    this.device.update();
    this.platform.update();
    this.ball.update();
    this.bricks.forEach(obj => obj.update());
  }

  render() {
    this.draw();

    requestAnimationFrame(this.render.bind(this));
  }
}

new Game(5);
