import { getMinMax, lineCircleCollision } from "./helpers.js";
import Vector from "./Vector.js";

export default class Ball {
  constructor(game) {
    this.ctx = game.ctx;
    this.game = game;
    this.inputHandler = game.inputHandler;
    this.isFlying = false;
    this.width = 32;
    this.height = 32;
    this.maxSpeed = 4;

    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.position = this.positionOnThePlatform;
  }

  get positionOnThePlatform() {
    return this.game.platform.position.add(this.game.device.center.sub(this.game.platform.position).setMag(this.game.platform.height / 2 + this.height / 2));
  }

  get radius() {
    return this.width / 2;
  }

  checkDeviceBorders() {
    const { width, center: SCREEN_CENTER } = this.game.device;

    if (this.position.sub(SCREEN_CENTER).mag() > width / 2 + this.width / 2) {
      this.isFlying = false;
      this.velocity.set(0, 0);
      this.position = this.positionOnThePlatform;
    }
  }

  platformPenetrationResolution(closestPointToThePlatform) {
    const penetrationVector = this.position.sub(closestPointToThePlatform);
    this.position = this.position.add(penetrationVector.setMag(this.width / 2 - penetrationVector.mag()));
  }

  checkPlatformCollision() {
    if (!this.isFlying) return;
    
    const { result, projectionPoint } = lineCircleCollision(this.game.platform.coorditates, this);

    if (result) {
      this.platformPenetrationResolution(projectionPoint);

      const projectionLength = this.game.platform.coorditates.start.sub(projectionPoint).mag();
      const newAngle = getMinMax(0, this.game.platform.width, -10, 10, projectionLength);
      // // console.log('New ANGLE: ', this.velocity.mult(-1).heading());
      this.velocity = Vector.fromAngle(this.velocity.mult(-1).heading() + Math.PI / 180 * newAngle).setMag(this.maxSpeed);
    }
  }

  start() {
    this.isFlying = true;
    this.acceleration = this.game.device.center.sub(this.position).setMag(this.maxSpeed);
  }

  update() {
    if (this.inputHandler.keyboard.spaceActive && !this.isFlying) {
      this.start();
    }

    if (this.isFlying) {
      this.velocity = this.velocity.add(this.acceleration);
      this.position = this.position.add(this.velocity);

      this.checkDeviceBorders();
      this.checkPlatformCollision();
  
      this.acceleration.set(0, 0);
    } else {
      this.position = this.positionOnThePlatform;
    }

    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}