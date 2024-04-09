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


// setup noise
var noise = new SimplexNoise()
var spaces = 75
var space = width/spaces
var scale = 0.0025
var time = 0
var timeScale = 0.0001
var field = genField()

function genField() {
   time += timeScale
   var fieldArr = []
   for (var x = 0; x < width; x += space) {
      var row = []
      fieldArr.push(row)
      for (var y = 0; y < height; y += space) {
         var a = 0
         // from center adjustment
         // var xdiff = width/2 - (x + space/2)
         // var ydiff = height/2 - (y + space/2)
         // var angleToCenter = Math.atan2(-xdiff, -ydiff)
         // var noiseGen = noise.noise3D(x*scale, y*scale, time)*2
         // angleToCenter += (noiseGen)
         // row.push(angleToCenter)

         // original
         var noiseGen = (noise.noise3D(x*scale, y*scale, time) + 1) / 2
         var angle = noiseGen * Math.PI*10
         row.push(angle)
      }
   }

   return fieldArr
}


// particles
var sides = 3
var emitterSize = 100
var particleSize = 2
var particlePull = 0.275
var particleSpeed = 4
var particleOpacity = 0.155
var particleStartSpeed = 0.5
var particleCount = 1500
var particlePerLine = 150
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
      ctx.strokeStyle = '#FFFFFF40'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(lx, ly)
      ctx.lineTo(nx, ny)
      ctx.stroke()
      ctx.lineWidth = 1

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

   for (var s = 0; s < sides; s++) {
      var line = lines[s]
      var lineParticleSpace = line.len/particlePerLine
      console.log(line)
      for (var i = 0; i < particlePerLine; i++) {
         var linePos = i * lineParticleSpace//line.len

         // pick a point on emitter line
         var lx = line.start[0] + Math.sin(line.dir)*linePos
         var ly = line.start[1] + Math.cos(line.dir)*linePos


         // start outward
         var xdiff = width/2 - (lx + space/2)
         var ydiff = height/2 - (ly + space/2)
         // var angleToCenter = Math.atan2(-xdiff, -ydiff)
         // var noiseGen = noise.noise3D(x*scale, y*scale, time)*2
         // angleToCenter += (noiseGen)
         // row.push(angleToCenter)
         // console.log(xdiff, ydiff)
         var startSpeedRan = Math.random()*4
         var ivx = -xdiff*(particleStartSpeed*startSpeedRan)
         var ivy = -ydiff*(particleStartSpeed*startSpeedRan)
         var particle = {
            x: lx,
            y: ly,
            vx: ivx,
            vy: ivy,
            size: particleSize,
            maxSpeed: particleSpeed// + Math.random(),
         }
         newParticles.push(particle)
      }
   }

   return newParticles
}



// generate flow field
function draw() {
   // field
   for (var x = 0; x < width/space; x += 1) {
      for (var y = 0; y < height/space; y += 1) {
         var half = space/2
         var angle = field[x][y] //* (Math.PI*2)
         var ax = Math.sin(angle)
         var ay = Math.cos(angle)

         ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`
         var cx = x*space + half
         var cy = y*space + half
         var lx = cx + (ax*half)
         var ly = cy + (ay*half)
         // ctx.beginPath()
         // ctx.moveTo(cx, cy)
         // ctx.lineTo(lx, ly)
         // ctx.stroke()
         // ctx.fillStyle = 'green'
         // ctx.fillRect(cx, cy, 2, 2)
         // ctx.fillStyle = 'red'
         // ctx.fillRect(lx, ly, 2, 2)
      }
   }

   // return
   // particles
   ctx.fillStyle = 'rgba(255, 255, 255)'

   for (var particle of particles) {
      // move
      // console.log(field)
      var gridX = Math.floor(particle.x/space)
      var gridY = Math.floor(particle.y/space)
      // console.log(gridX, gridY)
      var grid = field[gridX]?.[gridY]
      if (!grid) {
         continue
      }
      var angle =  grid //* (Math.PI*2)
      // console.log(angle)
      var ax = Math.sin(angle)
      var ay = Math.cos(angle)
      // auto
      // particle.x += ax
      // particle.y += ay
      // momentum
      particle.vx += ax*particlePull
      particle.vy += ay*particlePull
      // limit speed
      particleAngle = Math.atan2(particle.vx, particle.vy)
      //a2 + b2 = c2
      particleSpeed = Math.min(particle.maxSpeed, Math.sqrt(particle.vx*particle.vx + particle.vy*particle.vy))

      particle.vx = Math.sin(particleAngle) * particle.maxSpeed
      particle.vy = Math.cos(particleAngle) * particle.maxSpeed
      particle.maxSpeed = Math.max(0, particle.maxSpeed - 0.0025)
      var ox = particle.x
      var oy = particle.y
      particle.x += particle.vx
      particle.y += particle.vy
      
      // draw
      // ctx.beginPath()
      // ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI*2)
      // ctx.fill()

      ctx.strokeStyle = `rgba(255, 255, 255, ${particleOpacity})`
      ctx.lineWidth = particle.size
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(particle.x, particle.y)
      ctx.stroke()
      // ctx.fillStyle = `rgba(255, 255, 255, ${particleOpacity})`
      // ctx.fillRect(particle.x-particle.size/2, particle.y-particle.size/2, particle.size, particle.size)
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
   // genEmitter()
}

setInterval(render, 1000/60)


