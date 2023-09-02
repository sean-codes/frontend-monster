/*--------------------------------------------------------------
| Demo pictures
--------------------------------------------------------------*/
var images = document.querySelector('.images')

var k = 1000
for (var i = 0; i < 100; i++) {
   // create new
   var image = document.createElement('div')   
   image.classList.add('image')
   var img = document.createElement('img')
   image.appendChild(img)

   var number = 300 + i
   img.src = 'https://placekitten.com/' + number

   image.setAttribute('k', k)
   images.appendChild(image)
   k += 200
   if (k > 10000) k = 1000
}

// actual stuffs


// elements
var middle = document.querySelector('.middle')
var label = document.querySelector('.label')
var labelText = label.querySelector('.text')
var savedX = 0
var linePadding = 6.5
var lineWidth = 1

function positionLabel(x) {
   var labelBox = label.getBoundingClientRect()
   var middleBox = middle.getBoundingClientRect()
   label.style.left = (x - labelBox.width/2) - middleBox.left + linePadding + lineWidth + 'px'
}

/*--------------------------------------------------------------
| Handle Mousing
--------------------------------------------------------------*/
middle.addEventListener('mousemove', handleMouseMove)
middle.addEventListener('mouseout', handleMouseOut)

function handleMouseMove(e) {
   var padding = 6.5
   positionLabel(e.clientX - padding)
}
function handleMouseOut(e) {
   positionLabel(savedX)
}
/*--------------------------------------------------------------
| Handle Clicking
--------------------------------------------------------------*/
var start = 800 // 1000
var incriment = 200
var lines = []
while (start < 10000) {
   start += incriment
   var line = document.createElement('div')
   line.dataset.k = start
   line.classList.add('line')
   line.addEventListener('click', handleClickLine)
   line.addEventListener('mouseenter', handleHoverLine)
   
   middle.appendChild(line)
   lines.push(line)
}


function handleHoverLine(e) {
   var lineThatGotHovered = e.target
   // update the label
   labelText.innerHTML = lineThatGotHovered.dataset.k + 'k'
}

function handleClickLine(e) {
   var lineThatGotClicked = e.target

   // remove from the old
   var currentlySelector = middle.querySelector('.selected')
   if (currentlySelector) currentlySelector.classList.remove('selected')

   // add to the new
   lineThatGotClicked.classList.add('selected')
   
   // position code
   var lineBox = lineThatGotClicked.getBoundingClientRect()
   

   var x = lineBox.x
   savedX = x
   positionLabel(x)


   // update the label
   var k = lineThatGotClicked.dataset.k
   labelText.innerHTML = k + 'k'

   var imagesThatMatchK = document.querySelectorAll(`[k="${k}"]`)
   
   transitionImages(imagesThatMatchK)
}

var debounce;
function transitionImages(imagesThatMatchK) {
   images.classList.add('fade')
   clearTimeout(debounce)
   debounce = setTimeout(() => {
      hideAllImages()
      showImages(imagesThatMatchK)   
      images.classList.remove('fade')
   }, 500)
}

function hideAllImages() {
   var images = document.querySelectorAll('.images .image')
   for (var image of images) {
      image.classList.add('hide')
   }
}

function showImages(images) {
   for (var image of images) {
      image.classList.remove('hide')
   }
}


// click the first one
lines[0].click()
// var middleBox = middle.getBoundingClientRect()
// savedX = middleBox.left
// positionLabel(middleBox.left)