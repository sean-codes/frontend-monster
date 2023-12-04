init()

var app = document.querySelector('.app')
var templateBike = app.querySelector('#template-bike')
var htmlMenuBtn = app.querySelector('#menu-btn')
var oldCategoryIndex = -1
var currentCategory = 0
var currentBike = 0
var data

async function init() {
   data = await fetch('./data-new.json').then(d => d.json())
   htmlMenuBtn.addEventListener('click', toggleMenu)
   render()
}

function toggleMenu() {
   oldCategoryIndex = -1
   currentCategory = 0
   currentBike = 0
   render()
   document.querySelector('.app .menu').classList.toggle('close')
   htmlMenuBtn.classList.toggle('active')
}

function setCategory(i) {
   currentBike = 0
   currentCategory = i
   render()
}

function setBike(i) {
   currentBike = i

   //fade out
   app.querySelector('.c-display').classList.add('out')
   setTimeout(render, 200)
}

function render() {
   // render categories
   var htmlCategories = app.querySelector('.categories')
   htmlCategories.innerHTML = ''

   for (var categoryIndex in data) {
      var category = data[categoryIndex]
      var htmlCategory = document.createElement('div')
      htmlCategory.classList.add('category')
      if (currentCategory == categoryIndex) htmlCategory.classList.add('active')
      htmlCategory.innerHTML = category.label
      htmlCategory.dataset.category = categoryIndex
      htmlCategory.addEventListener('click', e => setCategory(e.target.dataset.category))

      htmlCategories.appendChild(htmlCategory)
   }

   // render bikes
   app.querySelector('.c-bikes .header .text').innerHTML = data[currentCategory].label
   var htmlBikes = app.querySelector('.c-bikes .bikes')
   htmlBikes.innerHTML = ''

   var bikes = data[currentCategory].items
   for (var bikeIndex in bikes) {
      var bike = bikes[bikeIndex]
      var htmlBike = templateBike.content.cloneNode(true).querySelector('.bike')
      htmlBike.dataset.bike = bikeIndex
      htmlBike.addEventListener('click', function(e) { setBike(this.dataset.bike) })
      htmlBike.classList.toggle('active', bikeIndex == currentBike)
      const shouldAnimate = currentCategory !== oldCategoryIndex || bikes.length == 1
      htmlBike.setAttribute('style', `--opacity: ${currentCategory !== oldCategoryIndex ? '0' : '1'}; --index: ${bikeIndex}s`)
      htmlBike.querySelector('img').src = bike.img
      htmlBike.querySelector('.title').innerHTML = bike.name
      htmlBike.querySelector('.note').innerHTML = bike.note || ''
      htmlBike.querySelector('.price').innerHTML = 'Price from ' + bike.price

      htmlBikes.appendChild(htmlBike)
   }


   // render display
   var bike = data[currentCategory].items[currentBike]

   var htmlDisplay = app.querySelector('.c-display')
   htmlDisplay.classList.remove('out')
   htmlDisplay.style.animation = 'none'
   setTimeout(() => htmlDisplay.style.animation = null, 1)
   htmlDisplay.querySelector('.title').innerHTML = bike.name
   htmlDisplay.querySelector('.title').offsetHeight
   htmlDisplay.querySelector('.price .dollars').innerHTML = bike.price
   htmlDisplay.querySelector('.image').innerHTML = `<img src="${bike.img}" />`

   // table
   htmlDisplay.querySelector('.specs table').innerHTML = bike.attributes.reduce((s, n) => s + `
      <tr>
         <td>${n.value}</td>
         <td>${n.key}</td>
      </tr>
   `, '')


   // reset
   oldCategoryIndex = currentCategory
}

