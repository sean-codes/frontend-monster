var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

var size = 400
canvas.width = size
canvas.height = size

var noise = new SimplexNoise()

// controls
// var c = {
//    time: 0,
//    timeSpeed: 0.0014,
//    scale: 0.0035,
//    space: 30,
//    pull: 0.24,
//    maxSpeed: 2.5,
//    particleCount: 120000,
//    blending: 0.1,
//    circleScale: 2,
//    lineAlpha: 0,
//    particleColor: 255,
//    clearAmount: 1,
// }
// small
var c = {
   time: 0,
   timeSpeed: 0.0016,
   scale: 0.00884,
   space: 10,
   pull: 0.36,
   maxSpeed: 2.1,
   particleCount: 120000,
   blending: 0.08,
   circleScale: 2,
   lineAlpha: 0,
   particleColor: 255,
   clearAmount: 1,
}

var gui = new dat.GUI()
gui.add(c, 'timeSpeed', 0.0001, 0.01, 0.0001)
gui.add(c, 'scale', 0.00001, 0.01, 0.00001)
gui.add(c, 'space', 1, size, 10)
gui.add(c, 'pull', 0, 1, 0.01)
gui.add(c, 'maxSpeed', 0, 10, 0.1, () => {
   console.log('meow')
})
gui.add(c, 'blending', 0, 1, 0.01)
gui.add(c, 'circleScale', 1, 4, 1)
gui.add(c, 'lineAlpha', 0, 1, 0.01)
gui.add(c, 'particleColor', 1, 255, 1)
gui.add(c, 'clearAmount', 0.01, 1, 0.01)
gui.close()


// particles
var particles = []

for (var i = 0; i < c.particleCount; i++) {
   var newParticle = {
      x: Math.random() * size,
      y: Math.random() * size,
      ax: 0, // accelleration
      ay: 0,
      maxSpeed: c.maxSpeed + Math.random()
   }
   particles.push(newParticle)
}


function draw() {
   c.time += c.timeSpeed

   // clear
   // ctx.clearRect(0, 0, size, size)
   ctx.fillStyle = `rgba(0, 0, 0, ${c.clearAmount})`
   ctx.fillRect(0, 0, size, size)

   var imageData = ctx.getImageData(0, 0, size, size)

   // generate flow field
   var field = []
   for (var x = 0; x < size; x += c.space) {
      var fieldX = []
      for (var y = 0; y < size; y += c.space) {
         var n = noise.noise3D(x*c.scale, y*c.scale, c.time)
         var nn = (n+1)/2
         var circle = Math.PI*2
         var angle = nn * (circle*c.circleScale)
         var nx = Math.sin(angle)
         var ny = Math.cos(angle)

         var lx = x + c.space/2
         var ly = y + c.space/2
         var lx2 = lx + nx*(c.space/2)
         var ly2 = ly + ny*(c.space/2)
         
         ctx.strokeStyle = `rgba(100, 100, 200, ${c.lineAlpha})`
         ctx.beginPath()
         ctx.moveTo(lx, ly)
         ctx.lineTo(lx2, ly2)
         ctx.stroke()

         fieldX.push({ nx, ny, })
      }

      field.push(fieldX)
   }

   // move particles
   var spaces = size/c.space
   for (var particle of particles) {
      var gx = Math.floor(particle.x / size * spaces)
      var gy = Math.floor(particle.y / size * spaces)

      var flow = field[gx][gy]
      particle.ax += flow.nx * c.pull
      particle.ay += flow.ny * c.pull
      particle.x += particle.ax
      particle.y += particle.ay

      if (particle.x > size || particle.x < 0 || particle.y > size || particle.y < 0) {
         particle.x = Math.random()*size
         particle.y = Math.random()*size
         particle.ax = 0
         particle.ay = 0
         particle.maxSpeed = c.maxSpeed + Math.random()
      }
      // constrain speed
      var speed = Math.sqrt(particle.ax*particle.ax + particle.ay*particle.ay)
      if (speed > particle.maxSpeed) {
         // slow down
         var angle = Math.atan2(particle.ax, particle.ay)
         particle.ax = Math.sin(angle) * particle.maxSpeed
         particle.ay = Math.cos(angle) * particle.maxSpeed
      }

      // draw particle
      var alphaBlend = speed/particle.maxSpeed * c.blending
      var alpha = Math.min(alphaBlend, 0.5) * 255
      // ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
      // ctx.fillRect(particle.x, particle.y, c.particleSize, c.particleSize)

      //
      var pixelRow = Math.floor(particle.y)
      var pixelCol = Math.floor(particle.x) % size
      var pixelIndex = (pixelRow * size + pixelCol) * 4

      imageData.data[pixelIndex] = c.particleColor
      imageData.data[pixelIndex + 1] = c.particleColor
      imageData.data[pixelIndex + 2] = c.particleColor
      if (imageData.data[pixelIndex + 3] == 255) imageData.data[pixelIndex + 3] = 0
      imageData.data[pixelIndex + 3] = Math.min(imageData.data[pixelIndex + 3]+alpha, 254)
   }

   ctx.putImageData(imageData, 0, 0)
}

setInterval(draw, 1000/60)