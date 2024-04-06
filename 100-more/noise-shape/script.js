var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
var width = 0
var height = 0

function resize() {
   width = window.innerWidth
   height = window.innerHeight
   canvas.width = window.innerWidth
   canvas.height = window.innerHeight
}

window.onresize = resize
resize()


// particles
var sides = 3
var emitterSize = 150

var particleCount = 1000
var lines = genEmitter()
var particles = genParticles()

function genEmitter() {
   // help
   // calc rotation
   var circle = Math.PI*2
   var rot = circle / sides

   // start somewhere
   var cx = width/2
   var cy = height/2

   // loop over rest?
   var lines = []
   var lx = cx
   var ly = cy + emitterSize
   for (var i = 1; i <= sides; i++) {
      var rx = Math.sin(rot*i)
      var ry = Math.cos(rot*i)
      var nx = cx + rx*emitterSize
      var ny = cy + ry*emitterSize

      ctx.strokeStyle = '#FFFFFF05'
      ctx.beginPath()
      ctx.moveTo(lx, ly)
      ctx.lineTo(nx, ny)
      ctx.stroke()

      // c2 = a2 + b2
      var dx = nx-lx
      var dy = ny-ly
      var b2 = (dx)*(dx)
      var a2 = (dy)*(dy)
      var len = Math.sqrt(b2 + a2)
      lines.push({
         start: [lx, ly],
         dir: Math.atan2(dx, dy),
         len: len
      })
      lx = nx
      ly = ny
   }
   return lines
}

function genParticles() {
   var newParticles = []


   for (var i = 0; i < particleCount; i++) {
      // pick a point on emitter line
      var line = lines[Math.floor(Math.random()*lines.length)]
      var linePos = line.len * Math.random()
      var lx = line.start[0] + Math.sin(line.dir)*linePos
      var ly = line.start[1] + Math.cos(line.dir)*linePos


      var particle = {
         x: lx,
         y: ly,
         vx: 0,
         vy: 0,
         size: 1,
         maxSpeed: 1 + Math.random(),
      }
      newParticles.push(particle)
   }

   return newParticles
}

// setup noise
var noise = new SimplexNoise()
var space = 8
var scale = 0.0025
var time = 0
var timeScale = 0.0001
var field = genField()
// console.log(field)

function genField() {
   time += timeScale
   var fieldArr = []
   for (var x = 0; x < width; x += space) {
      var row = []
      fieldArr.push(row)
      for (var y = 0; y < height; y += space) {
         var noiseGen = noise.noise3D(x*scale, y*scale, time)
         var a = (noiseGen + 1) 
         row.push(a)
      }
   }

   return fieldArr
}


// generate flow field
function draw() {
   // field
   for (var x = 0; x < width/space; x += 1) {
      for (var y = 0; y < height/space; y += 1) {
         var half = space/2
         var angle = field[x][y] * (Math.PI*2)
         var ax = Math.sin(angle)
         var ay = Math.cos(angle)

         ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`
         var cx = x*space+half
         var cy = y*space+half
         var lx = cx + (ax*half)
         var ly = cy + (ay*half)
         ctx.beginPath()
         ctx.moveTo(cx, cy)
         ctx.lineTo(lx, ly)
         // ctx.stroke()
         ctx.strokeStyle = 1
      }
   }

   // particles
   ctx.fillStyle = 'rgba(255, 255, 255)'

   for (var particle of particles) {
      // move
      // console.log(field)
      var gridX = Math.round(particle.x/space)
      var gridY = Math.round(particle.y/space)
      // console.log(gridX, gridY)
      var grid = field[gridX]?.[gridY]
      if (!grid) {
         continue
      }
      var angle =  grid * (Math.PI*2)
      // console.log(angle)
      var ax = Math.sin(angle)
      var ay = Math.cos(angle)
      particle.vx += ax*0.1
      particle.vy += ay*0.1
      // limit speed
      particleAngle = Math.atan2(particle.vx, particle.vy)
      //a2 + b2 = c2
      particleSpeed = Math.min(particle.maxSpeed, Math.sqrt(particle.vx*particle.vx + particle.vy*particle.vy))
      particle.vx = Math.sin(particleAngle) * particle.maxSpeed
      particle.vy = Math.cos(particleAngle) * particle.maxSpeed
      particle.maxSpeed = Math.max(0, particle.maxSpeed - 0.0025)
      particle.x += particle.vx
      particle.y += particle.vy
      
      // draw
      // ctx.beginPath()
      // ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI*2)
      // ctx.fill()
      ctx.fillStyle = `rgba(255, 255, 255, 0.025)`
      ctx.fillRect(particle.x, particle.y, 2, 2)
   }
}

// loop
function render() {
   // field = genField()
   // ctx.clearRect(0, 0, width, height)
   // ctx.globalAlpha = 0.01
   // ctx.fillStyle = `rgb(0, 0, 0)`
   // ctx.fillRect(0, 0, width, height)
   // ctx.globalAlpha = 1
   draw()
   genEmitter()
}

setInterval(render, 1000/60)


