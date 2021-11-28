const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// const speed = 0.2
const speed = 0.01 + rnd(0.3)
// const viscosity = 0.03 //угасание
const viscosity = 0.01 + rnd(0.3)//угасание
// const fluidity = 0.05 //
const fluidity = 0.005 + rnd(0.2)//


let splashes = []


{
  document.body.style.margin = 0;
  canvas.style.display = "block";
  canvas.style.background = "lightBlue"
  resize();
  document.body.append(canvas);

  onresize = resize

  canvas.onmousedown = e => {
    canvas.onmousemove = handleTrigger
    handleTrigger(e)
  }
  canvas.onmouseup = e => {
    canvas.onmousemove = null    
    handleTrigger(e)
  }
  canvas.ontouchstart = canvas.ontouchmove = canvas.ontouchend = handleTrigger
  
  requestAnimationFrame(animate)
  
  makeSplash(100, 200, 0, 300)
}


function handleTrigger({ x, y, timeStamp }) {
  makeSplash(x, y, timeStamp, rnd(300))
}

function drawCircle(x, y, r, lineWidth, color) {
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color
  ctx.arc(x, y, r, 0, 7);
  ctx.stroke();
}

function processSplash(splash, now) {
  const { x, y, ts, power, color } = splash
  const span = now - ts
  const r = span * speed
  const powerLeft = power - span * viscosity
  if (r < 0 || powerLeft < 0) return splash.faded = true

  const lineWidth = powerLeft * fluidity + 1
  const opacity = powerLeft / 100
  drawCircle(x, y, r, lineWidth, `${color}${opacity})`)

  if (!splash.north && r > y && y > 0) {
    makeSplash(x, -y, ts, power)
    splash.north = true
  }
  if (!splash.east && r > innerWidth - x && x < innerWidth) {
    makeSplash(innerWidth * 2 - x, y, ts, power)
    splash.east = true
  }
  if (!splash.south && r > innerHeight - y && y < innerHeight) {
    makeSplash(x, innerHeight * 2 - y, ts, power)
    splash.south = true
  }
  if (!splash.west && r > x && x > 0) {
    makeSplash(-x, y, ts, power)
    splash.west = true
  }
}

function makeSplash(x, y, ts, power) {
  splashes.push({ x, y, ts, power, color: generateColor() })
}

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  ctx.strokeStyle = "#398fab"
}

function animate(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  splashes.forEach(splash => processSplash(splash, now))
  splashes = splashes.filter(splash => !splash.faded)

  requestAnimationFrame(animate)
}

function rnd(max) {
  return Math.random() * max
}

function generateColor() {
  return `rgba(${55+rnd(5)},${140+rnd(10)},${160+rnd(20)},`
}
