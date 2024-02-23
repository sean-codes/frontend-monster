var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

canvas.width = 200
canvas.height = 200

var noise = new SimplexNoise()
var time = 0

function draw() {
   ctx.clearRect(0, 0, canvas.width, canvas.height)

   time += 0.01 

   // noise returns -1 - 1
   var n = noise.noise2D(time, 0)
   // convert to 0 - 1
   var nn = (n+1)/2
   var y = nn * canvas.height


   // draw line
   ctx.strokeStyle = '#FFF'
   ctx.beginPath()
   ctx.moveTo(0, y)
   ctx.lineTo(canvas.width, y)
   ctx.stroke()
}
setInterval(draw, 1000/60)