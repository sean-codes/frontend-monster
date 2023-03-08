// this for storing created accounts!
var accounts = []


var app = document.querySelector('.app')
var formLogin = app.querySelector('#formLogin')
var formCreate = app.querySelector('#formCreate')
var formSuccess = app.querySelector('#formSuccess')
var formCreateSuccess = app.querySelector('#formCreateSuccess')

//-------------------------------------------------------------
// Create Success Page
//-------------------------------------------------------------
var buttonReturnToSignIn = formCreateSuccess.querySelector('button')
buttonReturnToSignIn.onclick = onClickReturnToSignIn

function onClickReturnToSignIn() {
   formCreateSuccess.classList.remove('show')
   formLogin.classList.add('show')
}

//-------------------------------------------------------------
// Create Page
//-------------------------------------------------------------
// 1. When you click on create account. If the username is empty show
// an error. If the password is empty show an error.

// 2. When you type into the username input clear its error. When you type 
// into the password input clear its error.

// 3. If the username and password are not empty. Show the create account
// success page

// 4. Add username and password to the accounts array.


var linkSignIn = formCreate.querySelector('#sign-in')
var createInputGroupUser = formCreate.querySelector('#groupUser')
var createInputUser = createInputGroupUser.querySelector('input')
var createInputGroupPass = formCreate.querySelector('#groupPass')
var createInputPass = createInputGroupPass.querySelector('input')
var buttonCreateAccount = formCreate.querySelector('button')

linkSignIn.onclick = onClickSignInLink
buttonCreateAccount.onclick = onClickButtonCreateAccount
createInputUser.oninput = onInputCreateUserInput
createInputPass.oninput = onInputCreateUserInput

function onClickSignInLink() {
   formCreate.classList.remove('show')
   formLogin.classList.add('show')
}

function onClickButtonCreateAccount() {
   var user = createInputUser.value
   var pass = createInputPass.value
   if (!user) createInputGroupUser.classList.add('error')
   if (!pass) createInputGroupPass.classList.add('error')


   if (user && pass) {
      formCreate.classList.remove('show')
      formCreateSuccess.classList.add('show')

      // add account to accounts array
      accounts.push({
         username: user,
         password: pass
      })
   }
}

function onInputCreateUserInput() {
   var user = createInputUser.value
   var pass = createInputPass.value
   if (user) createInputGroupUser.classList.remove('error')
   if (pass) createInputGroupPass.classList.remove('error')
}

//-------------------------------------------------------------
// Login Page
//-------------------------------------------------------------
// 1. When you click the login button
// if the username is empty show an error for username
// if the password is empty show an error for password

// 2. When you type into the inputs. Clear out the error

// 3. When you click the login button
// if the username and password is filled out
// show login failed under the login button

// 4. If the username is admin and the password is admin
// show the success page

// 5. When you click on Join Now. Show the create page.
var inputGroupUser = formLogin.querySelector('#groupUser')
var inputUser = inputGroupUser.querySelector('input')
var inputGroupPass = formLogin.querySelector('#groupPass')
var inputPass = inputGroupPass.querySelector('input')
var button = formLogin.querySelector('button')
var buttonJoinNow = formLogin.querySelector('#join-now')

button.onclick = onClickButton
buttonJoinNow.onclick = onClickJoinNow

inputUser.oninput = () => onInput(inputGroupUser)
inputPass.oninput = () => onInput(inputGroupPass)


function onClickButton() {
   var user = inputUser.value
   var pass = inputPass.value

   if (!user) inputGroupUser.classList.add('error')
   if (!pass) inputGroupPass.classList.add('error')

   formLogin.classList.remove('error')
   if (user && pass) {
      formLogin.classList.add('error')
   }


   // static login.
   if (user === 'admin' && pass === 'admin') {
      clearErrorsAndInputs()
      formLogin.classList.remove('show')
      formSuccess.classList.add('show')
   }

   // dynamic log
   // loop over the accounts.
   console.log('Available Accounts: ', accounts)
   for (var account of accounts) {
      // if user equals account.user and password equals account.password
      if (account.username == user && account.password == pass) {
         clearErrorsAndInputs()
         formLogin.classList.remove('show')
         formSuccess.classList.add('show')     
      }
   }
}

function onClickJoinNow(e) {
   clearErrorsAndInputs()
   formLogin.classList.remove('show')
   formCreate.classList.add('show')
}

function onInput(group) {
   group.classList.remove('error')
}


function clearErrorsAndInputs() {
   formLogin.classList.remove('error')
   inputGroupUser.classList.remove('error')
   inputGroupPass.classList.remove('error')
   createInputGroupUser.classList.remove('error')
   createInputGroupPass.classList.remove('error')

   inputUser.value = ''
   inputPass.value = ''
   createInputUser.value = ''
   createInputPass.value = ''
}