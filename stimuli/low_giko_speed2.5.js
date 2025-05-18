
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
const wobbleburst = 35;
const tracking = 0.09;
const interval = 12;

function generateNewGoal() {
  do {
    goalX = Math.random() * (800 - 100) + 50;
    goalY = Math.random() * (600 - 100) + 50;
  } while (dist(x, y, goalX, goalY) < 300);
}

function updateDirection() {
  let goalAngle = Math.atan2(goalY - y, goalX - x);
  let distanceToGoal = dist(x, y, goalX, goalY);
  let localTracking = tracking;
  if (distanceToGoal < 100) {
    localTracking = 0.5;
  }

  baseAngle = (1 - localTracking * 0.5) * baseAngle + (localTracking * 0.5) * goalAngle;

  if (frameCount % interval === 0) {
    baseAngle += (wobbleburst) * (Math.random() - 0.5) * Math.PI / 180;
  }

  baseAngle += Math.sin(frameCount / 10) * 0.02;

  if (Math.random() < 0.05) {
    baseAngle += (10 * Math.PI / 180) * (Math.random() < 0.5 ? 1 : -1);
  }

  dx = Math.cos(baseAngle);
  dy = Math.sin(baseAngle);
}

function bounceAwayFromWall() {
  let goalAngle = Math.atan2(goalY - y, goalX - x);
  baseAngle = goalAngle + (Math.random() - 0.5) * (20 * Math.PI / 180);
  dx = Math.cos(baseAngle);
  dy = Math.sin(baseAngle);
}

function move() {
  if (Math.random() < 0.01) return;

  if (reachedGoal) {
    generateNewGoal();
    baseAngle = Math.atan2(goalY - y, goalX - x);
    dx = Math.cos(baseAngle);
    dy = Math.sin(baseAngle);
    reachedGoal = false;
    frameCount = 0;
  }

  updateDirection();

  let speedNoise = 1 + 0.05 * Math.sin(frameCount / 20 + Math.random());
  x += dx * moveSpeed * speedNoise;
  y += dy * moveSpeed * speedNoise;

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