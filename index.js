import Ball from "./Ball.js";
import InputHandler from "./InputHandler.js";
import Vector from "./Vector.js";
import WatchDisplay from "./WatchDisplay.js";
import Background from "./Background.js";
import Walls from "./Walls.js";

const canvas = document.getElementById('canvas');

class Game {
  constructor() {
    this.balls = [];
    this.walls = [];
    this.score = 0;
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
    this.ball = new Ball(this);
    this.walls = new Walls(this);
  }

  increaseScore() {
    this.score += 1;
    console.log('SCORE: ', this.score);
  }

  draw() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.background.update();
    this.device.update();
    this.walls.update();
    this.ball.update();
  }

  render() {
    this.draw();

    if (this.isStopped) return;

    this.timer = requestAnimationFrame(this.render.bind(this));
  }

  stop() {
    this.isStopped = true;
  }
}

new Game(5);
