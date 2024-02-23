var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 800

var noise = new SimplexNoise()

var iterator = 0
var speed = 0.05
var scale = 300
var changeTime = 4
var maxSpeed = 3
var pull = 0.9

var s = {
   scale: 1000,
   flowSize: 200,
   maxSpeed: 9,
   minSpeed: 3,
   pull: 0.7,
   clear: 0.2
}
var gui = new dat.GUI()
gui.add(s, 'scale', 100, 2000)
gui.add(s, 'pull', 0, 1, 0.01)
gui.add(s, 'flowSize', 10, canvas.width, 10)
gui.add(s, 'maxSpeed', 0.1, 20)
gui.add(s, 'minSpeed', 0, 20)
gui.add(s, 'clear', 0, 1, 0.01)

var particles = []
for (var i = 0; i < 20000; i++) {
   var maxSpeed = s.minSpeed + ((s.maxSpeed - s.minSpeed) * Math.random())
   particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      sx: Math.random()*5 - 2.5,
      sy: Math.random()*5 - 2.5,
      maxSpeed: maxSpeed
   })
}

setInterval(() => {
   console.log('help')
   iterator += 1000
   for (var particle of particles) {
      var maxSpeed = s.minSpeed + ((s.maxSpeed - s.minSpeed) * Math.random())
      particles.sx = Math.random()*5 - 2.5
      particles.sy = Math.random()*5 - 2.5
      particle.maxSpeed = maxSpeed
   }
}, 1000*changeTime)
function draw() {
   // ctx.clearRect(0, 0, canvas.width, canvas.height)
   ctx.fillStyle = `rgba(255, 255, 255, ${s.clear})`
   ctx.fillRect(0, 0, canvas.width, canvas.height)

   // iterator += speed
   // ix += speed
   // iy += speed

   var xSpace = s.flowSize
   var ySpace = s.flowSize
   // for (var x = 0; x < canvas.width; x+= xSpace) {
   //    for (var y = 0; y < canvas.height; y+= ySpace) {
   //       var n = noise.noise2D((x+iterator)/scale, (y+iterator)/scale)
   //       var alpha = (n+1)/2

   //       // flow line
   //       var circle = Math.PI*2
   //       var v = new Vec().fromAngle(circle*alpha)

   //       // console.log(alpha)
   //       // ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
   //       // ctx.fillRect(x, y, xSpace, ySpace)

   //       ctx.strokeStyle = 'red'
   //       var lx = x+xSpace/2
   //       var ly = y+ySpace/2
   //       var lx2 = lx + v.x*(xSpace/2)
   //       var ly2 = ly + v.y*(ySpace/2)
   //       ctx.beginPath()
   //       ctx.moveTo(lx, ly)
   //       ctx.lineTo(lx2, ly2)
   //       ctx.stroke()
   //    }
   // }

   for (var particle of particles) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'
      ctx.fillRect(particle.x, particle.y, 1, 1)
      // console.log(particle.y)
      var xGrid = Math.floor(particle.x / xSpace) * xSpace
      var yGrid = Math.floor(particle.y / ySpace) * ySpace
      var n = noise.noise2D((xGrid+iterator)/s.scale, (yGrid+iterator)/s.scale)
      var alpha = (n+1)/2
      // console.log(alpha)
      var circle = Math.PI*2 * 3
      var v = new Vec().fromAngle(circle*alpha)
      // console.log(v.x)
      // var max = 3
      // var pull = 0.095
      particle.sx += v.y*s.pull 
      particle.sy += v.x*s.pull
      particle.sx = Math.min(particle.maxSpeed, Math.abs(particle.sx)) * Math.sign(particle.sx)
      particle.sy = Math.min(particle.maxSpeed, Math.abs(particle.sy)) * Math.sign(particle.sy)
      particle.x += particle.sx
      particle.y += particle.sy
      // particle.brakes = Math.max(0.5, Math.min(particle.brakes + Math.random() * 0.1, 1))
      // particle.x += v.x
      // particle.y += v.y

      if (particle.x < 0) { particle.x = canvas.width }
      if (particle.x > canvas.width) { particle.x = 0 }
      if (particle.y < 0) { particle.y = canvas.height }
      if (particle.y > canvas.height) { particle.y = 0 }
   }
}

setInterval(draw, 1000/60)

class Vec {
   constructor(x = 0, y = 0) {
      this.x = x
      this.y = y
   } 

   fromAngle(angle) {
      this.x = Math.cos(angle)
      this.y = Math.sin(angle)

      return this
   }
}