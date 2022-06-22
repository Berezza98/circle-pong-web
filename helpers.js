import Vector from "./Vector.js";

export function getCoorditatesAfterRotation({ position, angle, origin }) {
  return new Vector(
    (position.x - origin.x) * Math.cos(angle) - (position.y - origin.y) * Math.sin(angle) + origin.x,
    (position.x - origin.x) * Math.sin(angle) + (position.y - origin.y) * Math.cos(angle) + origin.y
  );
}

export function getMinMax(min, max, origMin, origMax, value) {
  const stepsCount = max - min; // 100 - 0 = 100
  const origStep = (origMax - origMin) / stepsCount; // 10 - (-10) / 100 = 20 / 100 = 0.2

  return origStep * value + origMin; // 0.2 * 0 + (-10) = -10
}

export function lineCircleCollision(line, circle) {
  // LINE IS AN OBJECT WITH TWO PROPS: "start" - Vector and "end" - Vector
  const startLineToEndLineVector = line.end.sub(line.start);
  const centerBallToStartLineVector = line.start.sub(circle.position);
  const centerBallToEndLineVector = line.end.sub(circle.position);

  // CHECK IF CLOSEST POINT IS START POINT OF LINE
  if (Vector.dot(startLineToEndLineVector, centerBallToStartLineVector.normalize()) > 0) {
    return {
      result: line.start.sub(circle.position).mag() + 0.01 < circle.radius,
      projectionPoint: line.start
    }
  }

  // CHECK IF CLOSEST POINT IS END POINT OF LINE
  if (Vector.dot(startLineToEndLineVector, centerBallToEndLineVector.normalize()) < 0) {
    return {
      result: line.end.sub(circle.position).mag() + 0.01 < circle.radius,
      projectionPoint: line.end
    }
  }

  const startLineToCenterBallVector = circle.position.sub(line.start);

  const projectionLength = Vector.dot(startLineToEndLineVector.normalize(), startLineToCenterBallVector);
  const projectionPoint = line.start.add(startLineToEndLineVector.setMag(projectionLength));

  return {
    result: projectionPoint.sub(circle.position).mag() < circle.radius,
    projectionPoint
  }
}

export function radiansToDegrees(radiansValue) {
  return radiansValue * (180 / Math.PI);
}