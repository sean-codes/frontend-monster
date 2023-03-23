// Modal toggling
var modalButtons = document.querySelectorAll('button.togglesModal')

for (var modalButton of modalButtons) {
   modalButton.addEventListener('click', onClickToggleModalButton)
}

function onClickToggleModalButton() {
   var modalId = this.getAttribute('modal')
   var modal = document.querySelector('#' + modalId)
   modal.classList.toggle('show')
}

// App Form
var app = document.querySelector('.app')
var buttonSubmit = app.querySelector('button#submit')
var inputGroupName = app.querySelector('#inputGroupName')
var inputName = inputGroupName.querySelector('input')
var inputGroupDescription = app.querySelector('#inputGroupDescription')
var inputDescription = inputGroupDescription.querySelector('input')
var appModal = app.querySelector('#form-modal')
var appPorjects = app.querySelector('.projects')
buttonSubmit.onclick = onClickSubmitForm

function onClickSubmitForm() {
   
   var name = inputName.value
   var desc = inputDescription.value

   inputGroupName.classList.toggle('error', !name)
   inputGroupDescription.classList.toggle('error', !desc)

   if (name && desc) {
      appModal.classList.remove('show')
      appPorjects.innerHTML += `
         <div class="project">
            <div class="info">
               <div class="name">${name}</div>
               <div class="desc">${desc}</div>
            </div>
         </div>
      `

      inputName.value = ''
      inputDescription.value = ''
   }
   // console.log('clicked submit', inputName.value, inputDescription.value)
}