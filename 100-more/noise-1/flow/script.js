var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

canvas.width = 300
canvas.height = 300

var noise = new SimplexNoise()

var space = 20
var speed = 0.005
var scale = 150
var iterator = 0

function draw() {
   iterator += speed
   ctx.clearRect(0, 0, canvas.width, canvas.height)

   for (var x = 0; x < canvas.width; x += space) {
      for (var y = 0; y < canvas.height; y += space) {

         var a = noise.noise3D(x/scale, y/scale, iterator)
         var norm = (a + 1) / 2 // get a number 0-1

         // get x/y direction
         var circle = Math.PI*2
         var dirX = Math.cos(circle * norm)
         var dirY = Math.sin(circle * norm)
         
         // draw line
         var lx = x + space/2
         var ly = y + space/2
         var lx2 = lx + dirX*(space/2)
         var ly2 = ly + dirY*(space/2)
         ctx.beginPath()
         ctx.moveTo(lx, ly)
         ctx.lineTo(lx2, ly2)
         ctx.stroke()
      }
   }
}

setInterval(draw, 1000/60)
