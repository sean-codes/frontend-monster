// initialize data
let data
(async function() {
   data = await fetch('./data-new.json').then(d => d.json())
   render()
}())

// globals
const app = document.querySelector('.app')
const htmlMenuButton = app.querySelector('#menu-btn')
const htmlMenu = document.querySelector('.app > .menu')
const htmlToolbar = app.querySelector('.c-toolbar')
const htmlCategories = app.querySelector('.c-cats')
const htmlSubCats = app.querySelector('.c-subcat')
const htmlDisplay = app.querySelector('.c-display')
const templateCategory = app.querySelector('#template-category')
const templateSubCatLink = app.querySelector('#template-subcat-link')

let curCategory = 0
let curItem = 0
let oldItem = -1
let oldCategory = -1

// ---------------------------------
// app
// ---------------------------------
htmlMenuButton.addEventListener('click', toggleMenu)

function toggleMenu() {
   curItem = 0
   curCategory = 0
   oldItem = -1 
   oldCategory = -1
   this.classList.toggle('active')
   htmlMenu.classList.toggle('close')
   htmlToolbar.classList.toggle('open')


   // reset animations
   render()
   // theres a better way to do this
   var htmlCats = htmlCategories.querySelectorAll('.cat')
   for (var htmlCat of htmlCats) htmlCat.style.animation = 'none'
   htmlToolbar.style.animation = 'none'
   htmlSubCats.style.animation = 'none'
   htmlDisplay.style.animation = 'none'
   setTimeout(() => {
      for (var htmlCat of htmlCats) htmlCat.style.animation = null
      htmlToolbar.style.animation = null
      htmlSubCats.style.animation = null
      htmlDisplay.style.animation = null
   }, 1)
}


function onClickItem() {
   curItem = this.dataset.index
   render()
}

function onClickCategory() {
   curItem = 0
   curCategory = this.dataset.index
   render()
}



// ---------------------------------
// render
// ---------------------------------
function render() {
   // categories
   htmlCategories.innerHTML = ''
   for (var cIndex in data) {
      var category = data[cIndex]

      var htmlCategory = templateCategory.content.cloneNode(true).querySelector('.cat')
      htmlCategory.querySelector('img').src = category.items[0].img
      htmlCategory.querySelector('.label').innerHTML = category.name

      // click
      htmlCategory.dataset.index = cIndex
      htmlCategory.addEventListener('click', onClickCategory)
      var animate = curCategory !== oldCategory
      htmlCategory.style.setProperty('--scale', animate ? 1 : 1.25)
      htmlCategory.style.setProperty('--index', cIndex)

      var animateOncePerMenuOpen = oldCategory == -1
      if (animateOncePerMenuOpen) {
         setTimeout((htmlCategory, cIndex) => {
            htmlCategory.classList.toggle('active', cIndex == curCategory)
         }, 1250, htmlCategory, cIndex)
      } else {
         htmlCategory.style.animation = "none"
         htmlCategory.style.opacity = '0.5'
         htmlCategory.classList.toggle('active', cIndex == curCategory)
      }
      // append
      htmlCategories.appendChild(htmlCategory)
   }


   // items
   htmlSubCats.innerHTML = ''
   var items = data[curCategory].items
   for (itemIndex in items) {
      var item = items[itemIndex]
      const htmlItem = templateSubCatLink.content.cloneNode(true).querySelector('.link')
      htmlItem.querySelector('.text').innerHTML = item.name
      htmlItem.querySelector('.note').innerHTML = item.note || ''
      htmlItem.querySelector('.text').setAttribute('title', item.name)

      // click
      htmlItem.dataset.index = itemIndex
      htmlItem.addEventListener('click', onClickItem)
      htmlItem.classList.toggle('active', itemIndex == curItem)


      // append
      htmlSubCats.appendChild(htmlItem)
   }


   // display
   var item = items[curItem]
   htmlDisplay.querySelector('.image img').src = item.img
   htmlDisplay.querySelector('.details .title').innerHTML = item.name
   htmlDisplay.querySelector('.details .price').innerHTML = item.price
   htmlDisplay.querySelector('.details .attributes').innerHTML = `
      ${item.attributes.reduce((s, n) => s + `
         <div class="att">
            <div class="value">${n.value}</div>
            <div class="key">${n.key}</div>
         </div>
      `, '')}
   `

   oldCategory = curCategory
   oldItem = curItem
}