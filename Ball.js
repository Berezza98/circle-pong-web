import Vector from "./Vector.js";

export default class Ball {
  constructor(game, x, y, radius) {
    this.ctx = game.ctx;
    this.keyboard = game.inputHandler.keyboard;
    this.balls = game.balls;
    this.walls = game.walls;
    this.radius = radius;
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.controllable = false;
  }

  checkCollisions() {
    // FOR BALLS
    const objectsToCheck = this.balls.filter(el => el !== this);

    objectsToCheck.forEach((el, index) => {
      if (this.position.sub(el.position).mag() <= this.radius + el.radius) {
        this.ballPenetrationResolution(el);
      }
    });

    // FOR WALLS
    this.walls.forEach((wall, index) => {
      const closestPointToTheWall = this.getClosestPointToTheWall(wall);
      Vector.draw(this.ctx, this.position, closestPointToTheWall);

      if (closestPointToTheWall.sub(this.position).mag() <= this.radius) {
        this.wallPenetrationResolution(wall, closestPointToTheWall);
      }
    });
  }

  getClosestPointToTheWall(wall) {
    const startWallToEndWallVector = wall.end.sub(wall.start);
    const centerBallToStartWallVector = wall.start.sub(this.position);
    const centerBallToEndWallVector = wall.end.sub(this.position);

    // CHECK IF CLOSEST POINT IS START POINT OF WALL
    if (Vector.dot(startWallToEndWallVector, centerBallToStartWallVector.normalize()) > 0) {
      return wall.start;
    }

    // CHECK IF CLOSEST POINT IS END POINT OF WALL
    if (Vector.dot(startWallToEndWallVector, centerBallToEndWallVector.normalize()) < 0) {
      return wall.end;
    }

    const startWallToCenterBallVector = this.position.sub(wall.start);

    const projectionLength = Vector.dot(startWallToEndWallVector.normalize(), startWallToCenterBallVector);
    const projectionPoint = wall.start.add(startWallToEndWallVector.setMag(projectionLength));
    
    return projectionPoint;
  }

  ballPenetrationResolution(anotherBall) {
    const distance = this.position.sub(anotherBall.position);
    const penetrationDepth = this.radius + anotherBall.radius - distance.mag();
    const penRes = distance.normalize().mult(penetrationDepth / 2);

    this.acceleration = this.acceleration.add(penRes);
    anotherBall.acceleration = anotherBall.acceleration.add(penRes.mult(-1));
  }

  wallPenetrationResolution(wall, closestPointToTheWall) {
    const penetrationVector = this.position.sub(closestPointToTheWall);
    this.position = this.position.add(penetrationVector.setMag(this.radius - penetrationVector.mag()));
  }

  handleControls() {
    if (!this.controllable) return;

    if (this.keyboard.upActive) {
      this.acceleration = this.acceleration.add(new Vector(0, -0.1));
    }

    if (this.keyboard.downActive) {
      this.acceleration = this.acceleration.add(new Vector(0, 0.1));
    }

    if (this.keyboard.leftActive) {
      this.acceleration = this.acceleration.add(new Vector(-0.1, 0));
    }

    if (this.keyboard.rightActive) {
      this.acceleration = this.acceleration.add(new Vector(0.1, 0));
    }
  }

  addFrictionForce() {
    this.velocity = this.velocity.mult(0.95);
  }

  update() {
    this.handleControls();

    this.velocity = this.velocity.add(this.acceleration);
    this.position = this.position.add(this.velocity);

    this.addFrictionForce();
    this.checkCollisions();

    this.acceleration.set(0, 0);

    this.draw();
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = "blue";
    this.ctx.beginPath();
    this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.restore();
  }
}