// select the menu button
var menuButton = document.querySelector('.menu-button')
// console.log(menuButton)
// set an on click
menuButton.onclick = onClickMenu

function onClickMenu() {
   // console.log('test', this)
   this.classList.toggle('is-opened')

   console.log('we are in the javascript again. im scared')
   // add show class to dropdown
   var dropdown = document.querySelector('.dropdown')
   // console.log(dropdown)
   dropdown.classList.toggle('show')
}