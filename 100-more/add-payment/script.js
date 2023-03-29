// Data
var cards = [
   {
      icon: '../_assets/images/icon-mastercard.png',
      number: '4444444444444444',
      exp: '09/26'
   },
   {
      icon: '../_assets/images/icon-visa.png',
      number: '4444444444444444',
      exp: '09/26'
   },
   {
      icon: '../_assets/images/icon-amex.svg',
      number: '4444444444444444',
      exp: '09/26'
   }
]


// App
var app = document.querySelector('.app')
var buttonAddNew = app.querySelector('#buttonAddNew')
var modalEdit = app.querySelector('.modal')
var modalButtonCancal = modalEdit.querySelector('#buttonCancel')
buttonAddNew.onclick = onClickAddNewButton
modalButtonCancal.onclick = onClickModalCancelButton

function onClickAddNewButton() {
   modalEdit.classList.add('show')
}

function onClickModalCancelButton() {
   modalEdit.classList.remove('show')
}


function render() {
   
}