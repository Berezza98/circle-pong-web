import { COLORS } from "./consts.js";
import { getMinMax, getRandomInt, radiansToDegrees } from "./helpers.js";
import Vector from "./Vector.js";
import WatchDisplay from "./WatchDisplay.js";

const COLOR_MAP = {
  [COLORS.BLUE]: 'blue',
  [COLORS.YELLOW]: 'yellow',
  [COLORS.RED]: 'red',
  [COLORS.GREEN]: 'green'
};

export default class Ball {
  constructor(game) {
    this.ctx = game.ctx;
    this.game = game;
    this.inputHandler = game.inputHandler;
    this.width = 20;
    this.height = 20;
    this.maxSpeed = 3;

    this.acceleration = new Vector(0, 0);
    this.velocity = Vector.random().setMag(this.maxSpeed);
    this.position = WatchDisplay.center;

    this.setOrChangeColor();
  }

  get radius() {
    return this.width / 2;
  }

  increaseSpeed() {
    this.maxSpeed += 0.1;
  }

  setOrChangeColor() {
    this.color = Object.values(COLORS)[getRandomInt(0, Object.values(COLORS).length - 1)];
  }

  checkDeviceBorders() {
    const { width, center: SCREEN_CENTER } = this.game.device;

    if (this.position.sub(SCREEN_CENTER).mag() > width / 2 + this.width / 2) {
      // console.log('END GAME');
    }
  }

  wallPenetrationResolution() {
    const currentPenetration = (this.position.sub(WatchDisplay.center).mag() + this.radius) - (WatchDisplay.width / 2 - this.game.walls.height);
    this.position = this.position.add(WatchDisplay.center.sub(this.position).setMag(currentPenetration));
  }

  changeVelocityAfterCollision(collidedWall) {
    const collidedWallStart = WatchDisplay.center.add(Vector.fromAngle(collidedWall.start + this.game.walls.currentAngle).setMag(WatchDisplay.width / 2 - this.game.walls.height / 2));
    const collidedWallEnd = WatchDisplay.center.add(Vector.fromAngle(collidedWall.end + this.game.walls.currentAngle).setMag(WatchDisplay.width / 2 - this.game.walls.height / 2));
    const startToEndVector = collidedWallEnd.sub(collidedWallStart);
    Vector.draw(this.ctx, collidedWallStart, collidedWallEnd, 'red');
    const startToCenterBallVector = this.position.sub(collidedWallStart);
    Vector.draw(this.ctx, this.position, collidedWallStart, 'green');
    const projectionLength = Vector.dot(startToEndVector.normalize(), startToCenterBallVector);
    const projectionPoint = collidedWallStart.add(startToEndVector.setMag(projectionLength));
    Vector.draw(this.ctx, this.position, projectionPoint, 'yellow');

    // WE NEED TO FIND ANGLE BETWEEN PLATFORM AND BALL VELOCITY VECTOR
    const v1 = this.velocity.mult(-1);
    const v2 = collidedWallStart.sub(projectionPoint);

    const wallAngle = collidedWallEnd.sub(collidedWallStart).heading();
    const angle = Vector.angleBetween(v1, v2);
    // console.log('WALL ANGLE: ', radiansToDegrees(wallAngle));
    // console.log('ANGLE: ', radiansToDegrees(angle));
    const newAngle = wallAngle + Math.PI / 2 //angle;
    this.velocity = Vector.fromAngle(newAngle).setMag(this.maxSpeed);
  }

  checkWallCollision() {
    if (WatchDisplay.center.sub(this.position).mag() + this.radius < WatchDisplay.width / 2 - this.game.walls.height) return;

    this.wallPenetrationResolution();

    const angle = this.position.sub(WatchDisplay.center).heading();
    const collidedWall = this.game.walls.checkCollision(angle);

    if (!collidedWall || this.color !== collidedWall.id) return this.game.stop();

    this.changeVelocityAfterCollision(collidedWall);
    this.setOrChangeColor();
    this.increaseSpeed();
    this.game.increaseScore();
    // this.game.stop();
  }

  start() {
    this.acceleration = this.game.device.center.sub(this.position).setMag(this.maxSpeed);
  }

  update() {
    this.velocity = this.velocity.add(this.acceleration);
    this.position = this.position.add(this.velocity);

    this.checkDeviceBorders();
    this.checkWallCollision();

    this.acceleration.set(0, 0);

    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = COLOR_MAP[this.color];
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.width / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}