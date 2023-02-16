//---------------------------------------------------------
// Login Page
//---------------------------------------------------------
var appLogin = document.querySelector('#page-login.app')
var inputGroupUser = appLogin.querySelector('#username')
var inputGroupPassword = appLogin.querySelector('#password')
var button = appLogin.querySelector('button')
// console.log(appLogin, inputGroupUser, inputGroupPassword, button)

// get the input
var inputUser = inputGroupUser.querySelector('input')
var inputPass = inputGroupPassword.querySelector('input')


button.onclick = buttonOnClick
inputUser.onkeyup = inputUserOnKeyup
inputPass.onkeyup = inputPassOnKeyup

function buttonOnClick() {
   if (!inputUser.value) {
      inputGroupUser.classList.add('error')
   }
   
   if (!inputPass.value) {
      inputGroupPassword.classList.add('error')
   }
}

function inputUserOnKeyup() {
   inputGroupUser.classList.remove('error')
}

function inputPassOnKeyup() {
   inputGroupPassword.classList.remove('error')
}



//---------------------------------------------------------
// Register Page
//---------------------------------------------------------
var appRegister = document.querySelector('#page-register.app')
var rInputGroupUser = appRegister.querySelector('#username')
var rInputGroupPassword1 = appRegister.querySelector('#password')
var rInputGroupPassword2 = appRegister.querySelector('#password2')
var rInputUser = rInputGroupUser.querySelector('input')
var rInputPw1 = rInputGroupPassword1.querySelector('input')
var rInputPw2 = rInputGroupPassword2.querySelector('input')
var rButton = appRegister.querySelector('button')

// console.log(
//    rInputGroupUser, 
//    rInputGroupPassword1, 
//    rInputGroupPassword2, 
//    rButton,
//    rInputUser,
//    rInputPw1,
//    rInputPw2,
// )

rButton.onclick = updateAllErrors
rInputUser.oninput = () => updateErrorInputGroup(rInputGroupUser)
rInputPw1.oninput = () => updateErrorInputGroup(rInputGroupPassword1)
rInputPw2.oninput = () => updateErrorInputGroup(rInputGroupPassword2)


function updateAllErrors() {
   updateErrorInputGroup(rInputGroupUser)
   updateErrorInputGroup(rInputGroupPassword1)
   updateErrorInputGroup(rInputGroupPassword2)
}

function updateErrorInputGroup(inputGroup) {
   var toggle = !inputGroup.querySelector('input').value
   inputGroup.classList.toggle('error', toggle)
}


