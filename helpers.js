import Vector from "./Vector.js";

export function getCoorditatesAfterRotation({ x, y, angle, origin }) {
  return new Vector(
    (x - origin.x) * Math.cos(angle) - (y - origin.y) * Math.sin(angle) + origin.x,
    (x - origin.x) * Math.sin(angle) + (y - origin.y) * Math.cos(angle) + origin.y
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
    return line.start;
  }

  // CHECK IF CLOSEST POINT IS END POINT OF LINE
  if (Vector.dot(startLineToEndLineVector, centerBallToEndLineVector.normalize()) < 0) {
    return line.end;
  }

  const startPlatformToCenterBallVector = circle.position.sub(line.start);

  const projectionLength = Vector.dot(startLineToEndLineVector.normalize(), startPlatformToCenterBallVector);
  const projectionPoint = line.start.add(startLineToEndLineVector.setMag(projectionLength));
  
  return {
    result: projectionPoint.sub(circle.position).mag() < circle.radius / 2,
    projectionPoint
  }
}
