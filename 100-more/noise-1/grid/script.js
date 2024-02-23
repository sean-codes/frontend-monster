var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

canvas.width = 300
canvas.height = 300

var noise = new SimplexNoise()

var space = 20
var iterator = 0
var speed = 0.005
var scale = 150

function draw() {
   iterator += speed
   ctx.clearRect(0, 0, canvas.width, canvas.height)

   for (var x = 0; x < canvas.width; x += space) {
      for (var y = 0; y < canvas.height; y += space) {

         var a = noise.noise3D(x/scale, y/scale, iterator)
         // console.log(a)
         ctx.fillStyle = `rgba(0, 0, 0, ${a})`
         ctx.fillRect(x, y, space, space)
      }
   }
}

setInterval(draw, 1000/60)
