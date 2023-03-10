// App
var accounts = [
   { user: 'admin', pass: 'admin' }
]

var app = document.querySelector('.app')
var formLogin = app.querySelector('#formLogin')
var formCreate = app.querySelector('#formCreate')
var formLoginSuccess = app.querySelector('#formLoginSuccess')
var formCreateSuccess = app.querySelector('#formCreateSuccess')

function switchToForm(formElement) {
   app.querySelector('.show').classList.remove('show')
   formElement.classList.add('show')
   clearErrors()
}

function clearErrors() {
   // remove input errors
   var inputGroups = document.querySelectorAll('.input-group')
   inputGroups.forEach(e => e.classList.remove('error'))
   // form form errors
   var forms = document.querySelectorAll('.form')
   forms.forEach(e => e.classList.remove('error'))
}

//-------------------------------------------------
// Form Login
//-------------------------------------------------
var loginInputGroupUser = formLogin.querySelector('#groupUser')
var loginInputUser = loginInputGroupUser.querySelector('input')
var loginInputGroupPass = formLogin.querySelector('#groupPass')
var loginInputPass = loginInputGroupPass.querySelector('input')
var loginButton = formLogin.querySelector('button')
var loginSignUp = formLogin.querySelector('a')

loginSignUp.onclick = () => switchToForm(formCreate)
loginButton.onclick = onClickLoginButton
loginInputUser.oninput = () => clearError(loginInputGroupUser)
loginInputPass.oninput = () => clearError(loginInputGroupPass)

function onClickLoginButton() {
   var user = loginInputUser.value
   var pass = loginInputPass.value

   if (!user) loginInputGroupUser.classList.add('error')
   if (!pass) loginInputGroupPass.classList.add('error')

   if (user && pass) {
      formLogin.classList.add('error')
      var match = accounts.find(a => a.user == user && a.pass == pass)
      if (match) switchToForm(formLoginSuccess)
   }
}

function clearError(inputGroup) {
   inputGroup.classList.remove('error')
}

//-------------------------------------------------
// Form Create
//-------------------------------------------------
var createInputGroupUser = formCreate.querySelector('#groupUser')
var createInputUser = createInputGroupUser.querySelector('input')
var createInputGroupPass = formCreate.querySelector('#groupPass')
var createInputPass = createInputGroupPass.querySelector('input')
var createButton = formCreate.querySelector('button')
var createSignUp = formCreate.querySelector('a')


createSignUp.onclick = () => switchToForm(formLogin)
createButton.onclick = onClickCreateButton
createInputUser.oninput = () => clearError(createInputGroupUser)
createInputPass.oninput = () => clearError(createInputGroupPass)

function onClickCreateButton() {
   var user = createInputUser.value
   var pass = createInputPass.value

   if (!user) createInputGroupUser.classList.add('error')
   if (!pass) createInputGroupPass.classList.add('error')

   if (user && pass) {
      accounts.push({ user, pass })
      switchToForm(formCreateSuccess)
   }
}

function clearError(inputGroup) {
   inputGroup.classList.remove('error')
}
//-------------------------------------------------
// Form Create Success
//-------------------------------------------------
var createSuccessGotoLoginButton = formCreateSuccess.querySelector('button')
createSuccessGotoLoginButton.onclick = () => switchToForm(formLogin)