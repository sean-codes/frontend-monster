// data

var myArray = [
   {
      icon: "/images/icon-mastercard.png",
      expiration: '09/26',
      primary: true
   },
   {
      icon: "/images/icon-visa.png",
      expiration: '08/28'
   }
]


// program
var addPayment = document.querySelector('.addPayment')
addPayment.onclick = onClickAddPayment


function onClickAddPayment() {
   console.log('test')

   var icon = [
      "/images/icon-visa.png",
      "/images/icon-mastercard.png",
   ][Math.floor(Math.random()*2)]

   myArray.push({
      icon: icon,
      expiration: '06/30'
   })

   render()
}

function onClickCardDeleteButton() {
   myArray.splice(this.dataset.index, 1)
   render()
}


// template
var template = document.querySelector('.templateCard')

function render() {
   // select the container
   var container = document.querySelector('.cards')

   // clear
   container.innerHTML = ""


   // create
   var index = 0
   for (var item of myArray) {
      // clone
      var clone = template.content.cloneNode(true)

      // set img and exp
      clone.querySelector('.icon img').src = item.icon
      clone.querySelector('.exp').innerHTML = item.expiration
      clone.querySelector('.number .primary').classList.toggle('hide', !item.primary)
      var button = clone.querySelector('.deleteButton')
      button.dataset.index = index
      button.onclick = onClickCardDeleteButton

      // append
      container.append(clone)
      index++
   }
}

render()

