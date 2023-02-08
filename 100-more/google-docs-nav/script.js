var htmlSidebar = document.querySelector('.app .sidebar')
var htmlMenuButton = document.querySelector('.app #menu-btn')

htmlMenuButton.onclick = function(event) {
   event.stopPropagation()
   htmlSidebar.classList.remove('hide')
}
htmlSidebar.onclick = function(event) {
   event.stopPropagation()
}
document.onclick = function(event) {
   htmlSidebar.classList.add('hide')
}