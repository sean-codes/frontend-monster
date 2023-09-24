class Vector {
   constructor(x, y) {
      this.x = x
      this.y = y
   }
   
   add(v2) {
      this.x += v2.x
      this.y += v2.y
      
      return this
   }
   
   sub(v2) {
      this.x -= v2.x
      this.y -= v2.y
      
      return this
   }
   
   scale(amount) {
      this.x = this.x*amount
      this.y = this.y*amount
      
      return this
   }
   
   clone() {
      return new Vector(this.x, this.y)
   }
   
   dot(v2) {
      return this.x * v2.x + this.y * v2.y
   }
   
   direction(v2) {
      var dx = v2.x - this.x 
      var dy = v2.y - this.y
      
      return new Vector(dx, dy).unit()
   }
   
   unit() {
      // uhh?
      var len = this.length()
      var ux = this.x/len
      var uy = this.y/len
      return new Vector(ux, uy)
   }
   
   length() {
      return Math.sqrt(this.x*this.x + this.y*this.y)
   }
   
   distance(v2) {
      var cx = this.x - v2.x
      var cy = this.y - v2.y
      return Math.sqrt(cx*cx + cy*cy)
   }
}

var colorLavendar = 'hsla(300deg, 50%, 75%, 1)'
var colorRed = 'hsla(0deg, 70%, 75%, 1)'
var colorLine = 'hsla(0deg, 50%, 70%, 0.5)'


var canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var ctx = canvas.getContext('2d')


var dotsLength = 30
var dots = []
var spaceBetween = Math.PI*2/dotsLength
var radius = 250
var innerRadius = 100
var centerX = canvas.width/2
var centerY = canvas.height/2
var center = new Vector(centerX, centerY)
var accuracy = 0.5
var frames = 0
var fpsCheck = Date.now()
var eleFps = document.querySelector('.fps')

function setup() {
   canvas.width = window.innerWidth
   canvas.height = window.innerHeight
   centerX = canvas.width/2 
   centerY = canvas.height/2
   center = new Vector(centerX, centerY)
   
   // create dots
   dots = []
   for (var i = 0; i < dotsLength; i++) {
      var x = centerX + (Math.sin(i * spaceBetween) * radius)
      var y = centerY + (Math.cos(i * spaceBetween) * radius)
      
      dots.push({ pos: new Vector(x, y), hit: new Vector(x, y) })
   }
}

window.onresize = setup
setup()


window.onload = function() {
   draw()
}

function draw() {
   requestAnimationFrame(draw)
   
   var time = Date.now()
   if (time - fpsCheck > 1000) {
      eleFps.innerText = 'fps: ' + frames
      fpsCheck = time
      frames = 0
   }
   frames += 1
   
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   drawInsideShape()
   var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
   function checkPixel(x, y) {
      var pos = (Math.round(y)*canvas.width + (canvas.width - Math.round(x))) * 4
      var r = imageData.data[pos]
      var g = imageData.data[pos + 1]
      var b = imageData.data[pos + 2]
      var a = imageData.data[pos + 3] 
      // console.log(r, g, b, a)
      return r > 0
   }
   
   ctx.clearRect(0, 0, canvas.width, canvas.height)
   checkPixel(center.x, center.y)
   
   for (var dot of dots) {
      // rotate dot
      // dot.pos.rotateOn(center, Math.PI/10)
      var distance = center.distance(dot.pos)
      var dir = center.direction(dot.pos)
      var curRot = Math.atan2(dir.x, dir.y)
      curRot += 0.015
      dot.pos.x = center.x + Math.sin(curRot) * distance
      dot.pos.y = center.y + Math.cos(curRot) * distance
      
      
      
      var distanceToCenter = dot.pos.distance(center)
      var directionToCenter = dot.pos.direction(center)
      var startCheck = dot.pos.clone()
      
      dot.hit = dot.pos.clone().add(directionToCenter.clone().scale(distanceToCenter/2))
      
      for (var check = 0; check < distanceToCenter; check+=accuracy) {
         var checkPos = dot.pos.clone().add(directionToCenter.clone().scale(check))
         if (checkPixel(checkPos.x, checkPos.y)) {
            dot.hit = checkPos
            break
         }
      }
   }
   
   for (var dot of dots) {
      setColor(colorLine)
      // setColor(colorLavendar)
      drawLine(dot.pos, dot.hit)
      
      setColor(colorLavendar)
      drawCircle(dot.pos, 8)

      setColor(colorLavendar)
      drawCircle(dot.hit, 5)
   }
   
   setColor(colorLavendar)
}

function drawInsideShape(stroke) {
   // var image = document.querySelector('img')
   var size = 225
   // ctx.drawImage(image, center.x - size/2, center.y - size/2, size, size)
   // ctx.fillStyle = 'red'
   ctx.lineWidth = 10
   ctx.beginPath()
   ctx.roundRect(center.x-size/2, center.y-size/2, size, size, 40)
   stroke ? ctx.stroke() : ctx.fill()
}

function setColor(color) {
   ctx.fillStyle = color
   ctx.strokeStyle = color
}

function drawCircle(pos, radius) {
   ctx.beginPath()
   ctx.arc(pos.x, pos.y, radius, 0, Math.PI*2)
   ctx.fill()
}

function drawLine(pos1, pos2) {
   ctx.beginPath()
   ctx.lineWidth = 3
   ctx.moveTo(pos1.x, pos1.y)
   ctx.lineTo(pos2.x, pos2.y)
   ctx.stroke()
}
   
