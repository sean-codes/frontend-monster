
// HTML SELECTORS
var ready = false
var htmlApp = document.querySelector('.app')
var htmlLabel = htmlApp.querySelector('.label')
var htmlLabelText = htmlLabel.querySelector('.text')
var htmlBarsContainer = htmlApp.querySelector('.bars')
var htmlRange = htmlApp.querySelector('.range')
var htmlBars = []

// State
var htmlBarSelected = null

// Generate Bars
var kStart = 1000
var kEnd = 10000
var kStep = 200

htmlBarsContainer.innerHTML = ''
do {
   var htmlBar = document.createElement('div')
   htmlBar.setAttribute('k', kStart)
   htmlBar.classList.add('bar')
   htmlBar.classList.add('hide')

   htmlBar.addEventListener('pointerdown', e => {
      e.target.releasePointerCapture(e.pointerId)
   })
   htmlBar.addEventListener('pointerenter', handleMouseEnter)
   htmlBar.addEventListener('pointerleave', handleMouseLeave)
   htmlBar.addEventListener('pointerup', handleClick)
   htmlBar.addEventListener('click', handleClick)
   
   htmlBarsContainer.appendChild(htmlBar)
   htmlBars.push(htmlBar)
   kStart += kStep
} while (kStart <= kEnd)

function handleMouseEnter(e) {
   var htmlBar = e.target
   htmlBar.classList.add('hover')
   htmlLabel.classList.add('hover')
   setLabelPosition(htmlBar)
   setTimeout(() => { htmlBar.classList.remove('hover') }, 250)

}

function handleMouseLeave(e) {
   setLabelPosition(htmlBarSelected)
   htmlLabel.classList.remove('hover')
}

function handleClick(e) {
   var htmlBar = e.target
   htmlLabel.classList.add('click')
   setTimeout(() => { htmlLabel.classList.remove('click')}, 250)
   if (htmlBarSelected) htmlBarSelected.classList.remove('selected')
   htmlBar.classList.add('selected')
   htmlBarSelected = htmlBar

   var k = htmlBar.getAttribute('k')
   toggleImages(k)

   setLabelPosition(htmlBar)
}

function setLabelPosition(htmlBar) {
   // set text
   var k = htmlBar.getAttribute('k')
   htmlLabelText.innerHTML = k + 'k'
   
   // set position
   var boxBar = htmlBar.getBoundingClientRect()
   var boxLabel = htmlLabel.getBoundingClientRect()
   htmlLabel.style.left = boxBar.x + Math.max(boxBar.width/2) - boxLabel.width/2 + 'px'
}


window.addEventListener('resize', handleResize)
function handleResize() {
   setLabelPosition(htmlBarSelected)
}

function toggleImages(k) {
   var htmlImagesContainer = document.querySelector('.images')
   htmlImagesContainer.classList.add('fade')
   setTimeout(() => {
      hideAllImages()
      showImages(k)
      htmlImagesContainer.classList.remove('fade')

   }, 500)
}

function hideAllImages() {
   var htmlImages = document.querySelectorAll('.images .image')
   for (var htmlImage of htmlImages) {
      htmlImage.classList.add('hide')
   }
}

function showImages(k) {
   var htmlImages = document.querySelectorAll(`.images .image[k="${k}"]`)
   for (var htmlImage of htmlImages) {
      htmlImage.classList.remove('hide')
   }
}


generateDemoImages()

// bars in
var barInTimeout = 0

htmlBars.forEach((htmlBar, i) => {
   var min = htmlBars.length/2
   // closer to min = faster?
   var distance = Math.abs(min - i)
   var percent = distance / min
   setTimeout(() => {
      htmlBar.classList.add('show')
      htmlBar.classList.remove('hide')
   }, percent*1000)
})

setTimeout(() => {
   // label/range in  
   htmlLabel.classList.add('show')
   htmlRange.classList.add('show')

   // initial click
   htmlBars[0].click()

}, 2000)
















/*--------------------------------------------------------------
| Demo pictures (no use!)
--------------------------------------------------------------*/
function generateDemoImages() {
   var htmlImages = document.querySelector('.images')
   
   var k = 1000
   
   for (var i = 0; i < 500; i++) {
      var htmlExampleImage = document.createElement('div')
      htmlExampleImage.classList.add('image')
      htmlExampleImage.classList.add('hide')
   
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
   
      var percent = k/9000
      var colorR = Math.floor(percent * 255)
      var colorH = Math.floor(percent * 360)
      // ctx.fillStyle = `rgb(${colorR/2}, ${colorR/2}, ${colorR})`
      ctx.fillStyle = `hsl(${colorH}, 90%, 90%)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

   
      var htmlExampleImageAspect = document.createElement('div')
      htmlExampleImageAspect.classList.add('aspect')
      htmlExampleImage.appendChild(htmlExampleImageAspect)
      htmlExampleImageAspect.appendChild(canvas)
      htmlExampleImage.setAttribute('k', k)
      htmlImages.appendChild(htmlExampleImage)
   
      
      
      k += 200
      if (k > 10000) k = 1000
   }

   htmlApp.classList.add('ready')
   document.querySelector('.loader').style.display = 'none'
}