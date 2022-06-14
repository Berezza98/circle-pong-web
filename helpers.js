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

export function rectCircleColliding(rect, circle) {
  let dx = Math.abs(circle.position.x - rect.position.x);
  let dy = Math.abs(circle.position.y - rect.position.y);

  if (dx > circle.radius + rect.width / 2) return false;
  if (dy > circle.radius + rect.height / 2) return false;

  if (dx <= rect.width) return true;
  if (dy <= rect.height) return true;

  dx = dx - rect.width;
  dy = dy - rect.height
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}
