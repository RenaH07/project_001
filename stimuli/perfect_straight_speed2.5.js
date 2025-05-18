
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 30;
let x = Math.random() * (800 - 2 * ballRadius) + ballRadius;
let y = Math.random() * (600 - 2 * ballRadius) + ballRadius;

let goalX = Math.random() * (800 - 100) + 50;
let goalY = Math.random() * (600 - 100) + 50;

function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

while (dist(x, y, goalX, goalY) < 300) {
  goalX = Math.random() * (800 - 100) + 50;
  goalY = Math.random() * (600 - 100) + 50;
}

let baseAngle = Math.atan2(goalY - y, goalX - x);
let dx = Math.cos(baseAngle);
let dy = Math.sin(baseAngle);

let reachedGoal = false;
let frameCount = 0;

const moveSpeed = 2.5;

function generateNewGoal() {
  do {
    goalX = Math.random() * (800 - 100) + 50;
    goalY = Math.random() * (600 - 100) + 50;
  } while (dist(x, y, goalX, goalY) < 300);
}

function updateDirection() {
  let goalAngle = Math.atan2(goalY - y, goalX - x);
  baseAngle = goalAngle;
  dx = Math.cos(baseAngle);
  dy = Math.sin(baseAngle);
}

function bounceAwayFromWall() {
  updateDirection();  // just re-aim directly at goal
}

function move() {
  if (reachedGoal) {
    generateNewGoal();
    updateDirection();
    reachedGoal = false;
    frameCount = 0;
  }

  updateDirection();  // always point directly at goal

  x += dx * moveSpeed;
  y += dy * moveSpeed;

  let bounced = false;
  if (x < ballRadius) { x = ballRadius; bounced = true; }
  if (x > 800 - ballRadius) { x = 800 - ballRadius; bounced = true; }
  if (y < ballRadius) { y = ballRadius; bounced = true; }
  if (y > 600 - ballRadius) { y = 600 - ballRadius; bounced = true; }

  if (bounced) {
    bounceAwayFromWall();
  }

  let distanceToGoal = dist(x, y, goalX, goalY);
  if (distanceToGoal < ballRadius + 10) {
    reachedGoal = true;
  }

  frameCount++;
}

function animate() {
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = "#ff6666";
  ctx.beginPath();
  ctx.arc(goalX, goalY, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#444";
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fill();

  move();
  requestAnimationFrame(animate);
}

animate();