// data
var cards = [
   {
      number: '4444444444444444',
      exp: '2025-03',
      type: '../_assets/images/icon-visa.png'
   },
   {
      number: '555555555555',
      exp: '2025-06',
      type: '../_assets/images/icon-amex.svg'
   },
   {
      number: '333333333333',
      exp: '2025-11',
      type: '../_assets/images/icon-mastercard.png'
   },
]

var currentEditIndex = 0

// control
var app = document.querySelector('.app')
var htmlCards = app.querySelector('.cards')
var modal = app.querySelector('.modal')
var buttonCancel = modal.querySelector('#buttonCancel')
var buttonSave = modal.querySelector('#buttonSave')
var buttonAddPayment = app.querySelector('#buttonAddPayment')
var inputGroupCardNumber = modal.querySelector('.input-group#card-num')
var inputCardNumber = inputGroupCardNumber.querySelector('input')
var inputGroupCardExp = modal.querySelector('.input-group#card-exp')
var inputCardExp = inputGroupCardExp.querySelector('input')
var inputGroupType = modal.querySelector('.input-group#card-type')
var inputCardType = inputGroupType.querySelector('select')

buttonCancel.onclick = onClickButtonCancel
buttonSave.onclick = onClickButtonSave

function onClickButtonCancel() {
   modal.classList.add('hide')
}

function onClickButtonSave() {
   cards[currentEditIndex].number = inputCardNumber.value
   cards[currentEditIndex].exp = inputCardExp.value
   cards[currentEditIndex].type = inputCardType.value

   modal.classList.add('hide')
   render()
}

function onClickButtonDelete() {
   var clickedIndex = Number(this.getAttribute('index'))
   cards.splice(clickedIndex, 1)
   render()
   
}

function onClickButtonEdit() {
   currentEditIndex = Number(this.getAttribute('index'))

   var editingCard = cards[currentEditIndex]
   modal.classList.remove('hide')

   inputCardNumber.value = editingCard.number
   inputCardExp.value = editingCard.exp
   inputCardType.value = editingCard.type
}

render()
function render() {
   // clear
   htmlCards.innerHTML = ''

   // create
   var i = 0
   for (var card of cards) {
      var maskedCardNumber = '**** **** **** ' + card.number.slice(-4)
      
      var htmlCard = document.createElement('div')
      htmlCard.classList.add('card')
      htmlCard.innerHTML = `
         <div class="image">
            <img src="${card.type}" alt="">
         </div>
         <div class="text">
            <p class="card-num">${maskedCardNumber}</p>
            <p class="card-exp">Expiration ${card.exp}</p>
         </div>
         <div class="actions">
            <button id="buttonEdit" index="${i}">
               <i class="fa-solid fa-pen-to-square"></i>
               Edit
            </button>
            <button class="red" id="buttonDel" index="${i}">
               <i class="fa-solid fa-trash"></i>
               Delete
            </button>
         </div>
      `

      var buttonDelete = htmlCard.querySelector('#buttonDel')
      var buttonEdit = htmlCard.querySelector('#buttonEdit')
      buttonDelete.onclick = onClickButtonDelete
      buttonEdit.onclick = onClickButtonEdit

      htmlCards.append(htmlCard)

      i += 1
   }
}