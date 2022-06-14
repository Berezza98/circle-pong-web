import { getCoorditatesAfterRotation } from "./helpers.js";
import Vector from "./Vector.js";

export default class Platform {
  constructor(game) {
    this.width = 100;
    this.height = 20;
    this.ctx = game.ctx;
    this.device = game.device;
    this.inputHandler = game.inputHandler;
    this.angle = Math.PI / 2;
  }

  get position() {
    return Vector.fromAngle(this.angle).mult(this.device.width / 2 - this.height).add(this.device.center);
  }

  get coorditates() {
    const originalTopLeft = new Vector(this.position.x - this.width / 2, this.position.y - this.height / 2);
    const originalTopRight = new Vector(this.position.x + this.width / 2, this.position.y - this.height / 2);

    const start = getCoorditatesAfterRotation({
      x: originalTopLeft.x,
      y: originalTopLeft.y,
      origin: this.position,
      angle: this.angle - Math.PI / 2,
    });
    const end = getCoorditatesAfterRotation({
      x: originalTopRight.x,
      y: originalTopRight.y,
      origin: this.position,
      angle: this.angle - Math.PI / 2,
    });

    return { start, end };
  }

  update() {
    if (this.inputHandler.keyboard.leftActive) {
      this.angle += Math.PI / 180 * 3;
    }

    if (this.inputHandler.keyboard.rightActive) {
      this.angle -= Math.PI / 180 * 3;
    }

    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = 'yellow';
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.angle + Math.PI / 2);
    this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.ctx.restore();
  }
}