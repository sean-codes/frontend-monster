//-------------------------------------------------------------------
// Login Page
//-------------------------------------------------------------------
var app = document.querySelector('.app')
var form = app.querySelector('.form#page-login')
var button = form.querySelector('button')
var inputGroupEmail = form.querySelector('#input-group-email')
var inputEmail = inputGroupEmail.querySelector('input')
var inputGroupPass = form.querySelector('#input-group-pass')
var inputPassword = inputGroupPass.querySelector('input')

button.onclick = onclickButton

function onclickButton() {
   // part 1. show errors when you click the button
   // only add the class if the input value is empty
   if (inputEmail.value == false) {
      inputGroupEmail.classList.add('error')
   }
   if (!inputPassword.value) {
      inputGroupPass.classList.add('error')
   }


   // part 3. show form error
   // only show if email and password are empty
   if (inputEmail.value && inputPassword.value) {
      form.classList.add('error')
   }


   // part 4. show success page
   // if email value is "123" and password value is "123"
   if (inputEmail.value == '123' && inputPassword.value == '123') {
      app.classList.add('success')
   }
}


// part 2. when you type into the input. remove error from its group
inputEmail.onkeyup = onkeyupEmail
inputPassword.onkeyup = onkeyupPass

function onkeyupEmail() {
   inputGroupEmail.classList.remove('error')
}

function onkeyupPass() {
   inputGroupPass.classList.remove('error')
}