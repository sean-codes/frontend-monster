var app = document.querySelector('.app')
var links = app.querySelectorAll('.link')
var linksContainer = app.querySelector('.links')
var highlight = app.querySelector('.highlight')
var range = app.querySelector('input')
// set initial highlight
setHighlightOverElement(links[0])
setActiveElement(links[0])

// set onclick listeners
for (var link of links) {
   link.addEventListener('click', onClickLink)
}

function onClickLink() {
   setHighlightOverElement(this)
   setActiveElement(this)
}

function setHighlightOverElement(clickedLink) {
   var linkPosition = clickedLink.getBoundingClientRect()
   var linksContainerPosition = linksContainer.getBoundingClientRect()

   var x = linkPosition.x - linksContainerPosition.x
   var width = linkPosition.width
   highlight.style.left = x + 'px'
   highlight.style.width = width + 'px'
}

function setActiveElement(clicked) {
   var current = app.querySelector('.active')
   current && current.classList.remove('active')
   clicked.classList.add('active')
}

range.oninput = function() {
   app.setAttribute('style', `--border-radius: ${this.value}rem`)
}