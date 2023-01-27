var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

// run
setInterval(loop, 1000/60)
window.onresize = resize
resize()

// data
var eRotation = 0
var eColor = 0
var particles = []

// controls
var spread = 90
var speedR = 0.05
var speedC = 0.5
var emmit = 1
var eSize = 10
var fade = 0.01
var shrink = 0.1
var accel = 0.03

function loop() {
   var cx = canvas.width/2
   var cy = canvas.height/2

   var rx = Math.cos(eRotation)
   var ry = Math.sin(eRotation)

   var ex = cx + rx*spread
   var ey = cy + ry*spread

   // rotate pointer + color
   eRotation += speedR
   eColor += speedC
   if (eColor > 360) eColor = 0

   // add particles
   for (var i = 0; i < emmit; i++) {
      var ran = (Math.random() - 0.5)
      particles.push(Particle(ex, ey, rx*ran, ry*ran, eColor, eSize))
   }

   // draw
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   drawCircle(ex, ey, eSize, eColor, 1)

   for (var p of particles) {
      p.x += p.rx * p.s
      p.y += p.ry * p.s
      p.r -= shrink
      p.a -= fade
      p.s += accel
      drawCircle(p.x, p.y, p.r, p.c, p.a)
   }

   // clean parts / bad perform :(
   particles = particles.filter(p => p.a > 0)
}

function Particle(x, y, rx, ry, c, r) {
   return { x, y, r, c, rx, ry, a: 1, s: 0, ac: 0}
}

function drawCircle(x, y, r, c, a) {
   ctx.fillStyle = `hsla(${c}, 70%, 50%, ${a}`
   ctx.beginPath()
   ctx.arc(x, y, r, 0, Math.PI*2)
   ctx.fill()
}

function resize() {
   canvas.width = window.innerWidth
   canvas.height = window.innerHeight
}