
// HTML SELECTORS
var htmlApp = document.querySelector('.app')
var htmlLabel = htmlApp.querySelector('.label')
var htmlLabelText = htmlLabel.querySelector('.text')
var htmlBarsContainer = htmlApp.querySelector('.bars')
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

   htmlBar.addEventListener('mouseenter', handleMouseEnter)
   htmlBar.addEventListener('mouseleave', handleMouseLeave)
   htmlBar.addEventListener('click', handleClick)
   
   htmlBarsContainer.appendChild(htmlBar)
   htmlBars.push(htmlBar)
   kStart += kStep
} while (kStart < kEnd)

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


// initial click
generateDemoImages()
htmlBars[0].click()
















/*--------------------------------------------------------------
| Demo pictures (no use!)
--------------------------------------------------------------*/
function generateDemoImages() {
   var htmlImages = document.querySelector('.images')
   
   var k = 1000
   
   for (var i = 0; i < 1000; i++) {
      var htmlExampleImage = document.createElement('div')
      htmlExampleImage.classList.add('image')
   
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
   
      var percent = k/9000
      var colorR = Math.floor(percent * 255)
      var colorH = Math.floor(percent * 360)
      // ctx.fillStyle = `rgb(${colorR/2}, ${colorR/2}, ${colorR})`
      ctx.fillStyle = `hsl(${colorH}, 90%, 90%)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
   
      var img = document.createElement('img')
      var num = Math.floor(Math.random() * 3) + 1
      img.src = `../_assets/images/bg_game_${num}.png`
   
      var htmlExampleImageAspect = document.createElement('div')
      htmlExampleImageAspect.classList.add('aspect')
      htmlExampleImage.appendChild(htmlExampleImageAspect)
      htmlExampleImageAspect.appendChild(img)
      htmlExampleImageAspect.appendChild(canvas)
      htmlExampleImage.setAttribute('k', k)
      htmlImages.appendChild(htmlExampleImage)
   
      
      
      k += 200
      if (k > 10000) k = 1000
   }
}