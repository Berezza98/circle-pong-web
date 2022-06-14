import { rectCircleColliding } from "./helpers.js";
import Vector from "./Vector.js";

const HEALTH_COLORS = {
  1: 'rgb(255, 0, 0)',
  2: 'rgb(0, 0, 255)',
  3: 'rgb(0, 255, 0)'
};

export default class Brick {
  constructor(game, x, y) {
    this.ctx = game.ctx;
    this.game = game;
    this.position = new Vector(x, y);
    this.width = 100;
    this.height = 40;
    this.angle = 0;
    this.health = 3;
  }

  penetrationResolution() {

  }

  hit() {
    this.health = this.health > 1 ? this.health - 1 : 1;

    if (this.health === 0) {
      console.log('NEED TO REMOVE');
    }
  }

  checkCollisionWithBall() {
    if (rectCircleColliding(this, this.game.ball)) {
      this.penetrationResolution();
      this.hit();
    }
  }

  update() {
    this.checkCollisionWithBall();
    
    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = HEALTH_COLORS[this.health];
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.angle);
    this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.ctx.restore();
  }
}