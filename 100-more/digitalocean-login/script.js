var app = document.querySelector('.app')
var inputGroupUser = app.querySelector('.input-group#user')
var inputUser = inputGroupUser.querySelector('input')
var inputGroupPass = app.querySelector('.input-group#pass')
var inputPass = inputGroupPass.querySelector('input')
var button = app.querySelector('button')


// console.log(inputGroupUser, inputGroupPass, inputUser, inputPass, button)

button.onclick = onClickButton
inputUser.onkeyup = onKeyupInput
inputPass.onkeyup = onKeyupInput

function onClickButton() {
   // part 1. show not filled
   // if inputUser has no value
   if (!inputUser.value) inputGroupUser.classList.add('error')
   if (!inputPass.value) inputGroupPass.classList.add('error')


   // part 2. add hint if user and pass are not filled out
   if (inputUser.value && inputPass.value) 
      app.classList.add('hint')


   // part 3. switch to success state if user/pass match
   if (inputUser.value === '123' && inputPass.value === '123') 
      app.classList.add('success')
}

function onKeyupInput() {
   // part 2. remove error when type into input
   this.parentElement.classList.remove('error')
}