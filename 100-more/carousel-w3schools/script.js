var app = document.querySelector('.slider')
var btnLeft = app.querySelector('.button.left')
var btnRight = app.querySelector('.button.right')

// dots
var dots = app.querySelectorAll('.dot')
for (var dot of dots) dot.onclick = onDotClick

// buttons
btnLeft.onclick = onBtnLeftClick
btnRight.onclick = onBtnRightClick

var currentSlide = 1
render()

function onBtnLeftClick() {
   currentSlide = Math.max(1, currentSlide - 1)
   render()
}
function onBtnRightClick() {
   currentSlide = Math.min(3, currentSlide + 1)
   render()
}

function onDotClick() {
   var slide = Number(this.getAttribute('slide'))
   currentSlide = slide
   render()
}

function render() {
   // remove dots
   var currentDot = app.querySelector('.dot.active')
   currentDot.classList.remove('active')

   // add dot to current
   var nextDot = app.querySelector('.dot:nth-of-type(' + currentSlide + ')')
   nextDot.classList.add('active')

   // remove show-x class
   app.classList.remove('show-1')
   app.classList.remove('show-2')
   app.classList.remove('show-3')

   // add show-current class
   app.classList.add('show-' + currentSlide)
}