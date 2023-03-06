var app = document.querySelector('.app')
var tabs = document.querySelectorAll('.tabs li')

for (var tab of tabs) {
   tab.onclick = onClickTab
}


function onClickTab() {
   // remove current active
   var curr = app.querySelector('.active')
   curr.classList.remove('active')

   // set this to active
   this.classList.add('active')


   // remove current tab
   var currTabShow = app.querySelector('.tab.show')
   currTabShow.classList.remove('show')

   // set next one
   var nextTabClass = this.getAttribute('tab')
   var nextTabShow = app.querySelector('.' + nextTabClass)
   nextTabShow.classList.add('show')
}