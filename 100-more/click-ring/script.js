var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

var cx = canvas.width/2
var cy = canvas.height/2

var radius = 50
var width = 20






var pointerAngle = 0
var zoneAngle = Math.PI*2 - 1
var zoneSize = Math.PI/2 //25%
var aCircle = Math.PI*2

canvas.addEventListener('click', handleClick)
setInterval(render, 1000/60)

function render() {
   pointerAngle += Math.PI/100
   if (pointerAngle > Math.PI*2) {
      pointerAngle = pointerAngle - Math.PI*2
   }

   ctx.clearRect(0, 0, canvas.width, canvas.height)

   drawZone()
   drawPointer()
   drawOutside()
}

function handleClick() {
   var check = pointerAngle
   var start = zoneAngle
   var end = zoneAngle + zoneSize


   // its less but more complicated :(
   var backflow = zoneSize - (end - Math.PI*2) 
   if (end > aCircle && check < aCircle - backflow) {
      check += aCircle
   } 

   if (check > start && check < end) {
      moveZone()
   }
}

function moveZone() {
   zoneAngle = Math.random() * (Math.PI*2)
   zoneSize = Math.PI/2
}

function drawPointer() {
   // pointer
   ctx.strokeStyle = '#F22';
   ctx.beginPath()
   ctx.lineWidth = width
   ctx.arc(cx, cy, radius+width/2, pointerAngle, pointerAngle+Math.PI/10)
   ctx.stroke()
}

function drawZone() {
   // zone
   ctx.strokeStyle = '#000'
   ctx.beginPath()
   ctx.lineWidth = width
   ctx.arc(cx, cy, radius+width/2, zoneAngle, zoneAngle + zoneSize)
   ctx.stroke()

}

function drawOutside() {
   // outside
   ctx.strokeStyle = '#000'
   ctx.lineWidth = 1
   ctx.beginPath()
   ctx.arc(cx, cy, radius, 0, Math.PI*2)
   ctx.stroke()
   ctx.beginPath()
   ctx.arc(cx, cy, radius+width, 0, Math.PI*2)
   ctx.stroke()
}