var app = document.querySelector('.app')
var inputGroupEmail = app.querySelector('#groupEmail')
var inputGroupPass = app.querySelector('#groupPassword')
var inputEmail = inputGroupEmail.querySelector('input')
var inputPassword = inputGroupPass.querySelector('input')
var button = app.querySelector('#buttonLogin')
// console.log(inputGroupEmail)
// console.log(inputGroupPass)
// inputGroupPass.classList.add('error')
// inputGroupEmail.classList.add('error')

inputGroupEmail.oninput = onInput
inputGroupPass.oninput = onInput

function onInput() {
   var valueEmail = inputEmail.value
   var valuePass = inputPassword.value
   // console.log(valueEmail, valuePass)

   button.disabled = true
   if (valueEmail && valuePass) {
      button.disabled = false
   }
}

button.onclick = onClickLogin
function onClickLogin() {
   var valueEmail = inputEmail.value
   var valuePass = inputPassword.value

   inputGroupEmail.classList.add('error')
   inputGroupPass.classList.add('error')
   
   if (valueEmail == 'admin' && valuePass == 'admin') {
      inputGroupEmail.classList.remove('error')
      inputGroupPass.classList.remove('error')
      pageLogin.style.display = 'none'
      pageSuccess.style.display = 'block'
   }
}