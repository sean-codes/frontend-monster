var template = document.querySelector('template')
var container = document.querySelector('.song-grid.js')


for (var i = 0; i < 12; i++) {
   var clone = template.content.cloneNode(true)

   var randomWidth = Math.floor(Math.random()*100+100)
   clone.querySelector('.song-image .image img').src = 'https://placekitten.com/' + randomWidth
   container.append(clone)
}