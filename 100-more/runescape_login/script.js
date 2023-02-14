// select the app to use as a parent selector
var app = document.querySelector('.app')
// console.log(app)

// get the input and button
var input = app.querySelector('input')
var button = app.querySelector('button')
// console.log(input, button)


// set a funciton when keyup on inpu
input.onkeyup = inputOnKeyUp

function inputOnKeyUp() {
   // disable the button by default
   button.disabled = true

   // if there is a value length. remove disabled
   if (input.value.length) {
      button.disabled = false
   }
}