var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 800
var fps = 0
var lastFps = Date.now()
var eleFps = document.querySelector('.fps')
var noise = new SimplexNoise()

var s = {
   space: 50,
   speed: 0.005,
   scale: 350,
   particleCount: 100000,
   maxSpeed: 10,
   minSpeed: 2,
   pull: 0.9,
   size: 1,
   circle: 1,
   clear: 1,
   iteratorStep: 0.00075,
}

var iterator = 0

var field = generateFlowField()
var particles = generateParticles()
canvas.addEventListener('click', () => {
   iterator += 10
   field = generateFlowField()
   particles = generateParticles()
})
draw()


function generateFlowField() {
   var map = []
   for (var x = -s.space; x < canvas.width + s.space; x += s.space) {
      var row = []
      for (var y = -s.space; y < canvas.height + s.space; y += s.space) {

         var a = noise.noise3D(x/s.scale, y/s.scale, iterator)
         var norm = (a + 1) / 2 // get a number 0-1

         // get x/y direction
         var circle = Math.PI*2 * s.circle
         var dirX = Math.sin(circle * norm)
         var dirY = Math.cos(circle * norm)
         
         // draw line
         // var lx = x + s.space/2
         // var ly = y + s.space/2
         // var lx2 = lx + dirX*(s.space/2)
         // var ly2 = ly + dirY*(s.space/2)
         // ctx.beginPath()
         // ctx.moveTo(lx, ly)
         // ctx.lineTo(lx2, ly2)
         // ctx.stroke()

         row.push({
            dirX,
            dirY
         })
      }
      map.push(row)
   }

   return map
}

function generateParticles() {
   var newParticles = []
   for (var i = 0; i < s.particleCount; i++) {
      var speed = s.minSpeed + ((s.maxSpeed - s.minSpeed) * Math.random())
      var particle = particles?.[i] || {
         x: Math.random() * canvas.width,
         y: Math.random() * canvas.height,
         sx: 0,
         sy: 0,
         maxSpeed: speed
      }
      // particle.sx = Math.random() * particle.sx
      // particle.sy = Math.random() * particle.sy
      newParticles.push(particle)
   }

   return newParticles
}




function draw() {
   iterator += s.iteratorStep
   field = generateFlowField()
   // setTimeout(draw, 1000/60)
   requestAnimationFrame(draw)

   // fps counter
   fps++
   var time = Date.now()
   if (time - lastFps > 1000) {
      eleFps.innerHTML = 'fps ' + fps
      fps = 0
      lastFps = time
   }

   // draw
   // ctx.clearRect(0, 0, canvas.width, canvas.height)
   ctx.fillStyle = `rgba(255, 255, 255, ${s.clear})`
   ctx.fillRect(0, 0, canvas.width, canvas.height)

   var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)


   for (var i = 0; i < particles.length; i++) {
      var particle = particles[i]

      particle.x += particle.sx
      particle.y += particle.sy

      if (particle.x > canvas.width) particle.x = particle.x - canvas.width
      if (particle.x < 0) particle.x = canvas.width + particle.x
      if (particle.y > canvas.height) particle.y = particle.y - canvas.height
      if (particle.y < 0) particle.y = canvas.height + particle.y
      // if (particle.x > canvas.width
      //    || particle.x < 0
      //    || particle.y > canvas.height
      //    || particle.y < 0) {
      //    particle.x = Math.random() * canvas.width
      //    particle.y = Math.random() * canvas.height
      //    particle.sx = 0
      //    particle.sy = 0
      // }


      var x = Math.floor(particle.x / s.space)
      var y = Math.floor(particle.y / s.space)
      
      var flow = field[y][x]

      particle.sx += flow.dirX * s.pull
      particle.sy += flow.dirY * s.pull

      // clamp (not correct...)
      particle.sx = Math.min(Math.abs(particle.sx), particle.maxSpeed) * Math.sign(particle.sx)
      particle.sy = Math.min(Math.abs(particle.sy), particle.maxSpeed) * Math.sign(particle.sy)
      if (Math.random() > 0.95) {
         particle.sx *= 0.9
         particle.sy *= 0.9
      }

      // draw
      // ctx.fillRect(particle.x, particle.y, s.size, s.size)
      var pixelRow = Math.floor(particle.y)
      var pixelCol = Math.floor(particle.x) % canvas.width
      var pixelIndex = (pixelRow * canvas.width + pixelCol) * 4
      // console.log(pixelIndex)
      imageData.data[pixelIndex] = 0
      imageData.data[pixelIndex + 1] = 0
      imageData.data[pixelIndex + 2] = 0
      if (imageData.data[pixelIndex + 3] == 255) imageData.data[pixelIndex + 3] = 0
      imageData.data[pixelIndex + 3] = Math.min(imageData.data[pixelIndex + 3]+100, 254)
   }

   ctx.putImageData(imageData, 0, 0)
}



