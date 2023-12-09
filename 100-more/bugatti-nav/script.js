// menu
var icon = document.querySelector('.menu-icon')
var toolbar = document.querySelector('.c-toolbar')
var nav = document.querySelector('.c-nav')
var links = nav.querySelectorAll('.link')
toolbar.querySelector('.content').style.display = 'none'

icon.onclick = function() { 
   toolbar.style.display = null
   var wasOpen = toolbar.classList.contains('open')
   this.classList.toggle('close') 

   toolbar.querySelector('.content').style.display = null
   setTimeout(() => {
   toolbar.classList.toggle('open')

}, 1)
   if (wasOpen) {
      setTimeout(() => {
         toolbar.querySelector('.content').style.display = 'none'
      }, 500)
   }

   for (var link of links) {
      link.classList.remove('open')
   }
}



// link
for (var link of links) {
   link.addEventListener('click', onClickLink)
}




function onClickLink() {
   nav.querySelector('.open')?.classList.remove('open')
   this.classList.toggle('open')
}