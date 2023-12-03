const app = document.querySelector('.app')
const htmlMenu = document.querySelector('.c-menu')
const htmlMenuOptions = app.querySelector('.options-groups')
const htmlMenuCategories = app.querySelector('.categories')
const htmlMenuButton = app.querySelector('.c-toolbar .links .link')
const htmlClose = app.querySelector('.close')

let data = null
init()
async function init() {
   data = await fetch('./bikes-new.json').then(d => d.json())
   // console.log(data)
   renderCatgegories(data)
   listenForEvents()
   setCategory(0)
}

function renderCatgegories(data) {
   console.log(data)
   const templateCategory = app.querySelector('#template-category')

   for (var c in data) {
      var category = data[c]
      const htmlCategory = cloneTemplate(templateCategory)
      htmlCategory.querySelector('.label').innerHTML = category.label
      htmlCategory.dataset.category = c
      htmlMenuCategories.append(htmlCategory)

      // render options
      const templateOptionGroup = app.querySelector('#template-option-group')
      const htmlOptionGroup = cloneTemplate(templateOptionGroup)

      const htmlExplore = cloneTemplate(htmlOptionGroup.querySelector('#template-explore'))
      for (var o in category.items) {
         var option = category.items[o]
         const templateOption = htmlOptionGroup.querySelector('#template-option')
         const htmlOption = cloneTemplate(templateOption)
         htmlOption.querySelector('img').src = option.img
         htmlOption.querySelector('.label').innerHTML = option.label
         htmlOption.querySelector('.spec').innerHTML = option.package || ''
         htmlOptionGroup.dataset.category = c
         // htmlOption.dataset.category = category.label
         htmlOption.dataset.ci = c
         htmlOption.dataset.oi = o
         htmlOptionGroup.append(htmlOption)
      }

      htmlOptionGroup.append(htmlExplore)
      htmlMenuOptions.append(htmlOptionGroup)
   }
}

function listenForEvents() {
   const htmlMenuCategoriesArr = [...htmlMenu.querySelectorAll('.category')]
   const htmlOptions = [...app.querySelectorAll('.options .option')]

   // hovering option
   for (var htmlOption of htmlOptions) {
      htmlOption.addEventListener('mouseenter', onHoverOption)
   }


   // hovering menu
   for (var htmlCategory of htmlMenuCategoriesArr) {
      htmlCategory.addEventListener('mouseenter', onHoverCategory)
   }

   htmlMenuButton.addEventListener('click', onClickOpen)
   htmlClose.addEventListener('click', onClickClose)
}

function onClickOpen() {
   htmlMenuButton.classList.add('active')
   htmlMenu.classList.remove('hide')
}

function onClickClose() {
   htmlMenu.classList.add('hide')
   htmlMenuButton.classList.remove('active')
   setCategory(0)
}

function onHoverCategory(e) {
   const categoryId = e.target.dataset.category
   setCategory(categoryId)
}
function setCategory(categoryId) {
   // remove old
   const htmlOldOptions = htmlMenu.querySelector('.options.show')
   htmlOldOptions?.classList.remove('show') // if
   const htmlOldHover = htmlMenu.querySelector('.category.active')
   htmlOldHover?.classList.remove('active')

   // set new
   const htmlNewHover = document.querySelector(`.category[data-category="${categoryId}"]`)
   htmlNewHover.classList.add('active')

   // find new options
   const htmlOptions = htmlMenu.querySelector(`.options[data-category="${categoryId}"]`)

   // add show
   htmlOptions.classList.add('show')

   // hover first bike
   const firstBike = data[categoryId].items[0]
   const htmlOldHoverOption = htmlMenu.querySelector('.option.active')
   htmlOldHoverOption?.classList.remove('active')
   htmlOptions.querySelector('.option').classList.add('active')

   console.log(firstBike)
   updateDisplay(firstBike)

}


function onHoverOption(e) {
   const htmlOldHoverOption = htmlMenu.querySelector('.option.active')
   htmlOldHoverOption?.classList.remove('active')
   e.target.classList.add('active')

   const ci = Number(e.target.dataset.ci)
   const oi = Number(e.target.dataset.oi)
   const option = data[ci].items[oi]
   updateDisplay(option)
}

function updateDisplay(option) {
   const htmlDisplay = app.querySelector('.c-display')
   htmlDisplay.querySelector('.title').innerHTML = option.label
   htmlDisplay.querySelector('.spec').innerHTML = option.package ?? ''
   htmlDisplay.querySelector('p').innerHTML = option.description ?? ''
   htmlDisplay.querySelector('.image img').src = option.imgHd
   htmlDisplay.querySelector('.price').innerHTML = option.price
}

function cloneTemplate(template) {
   return template.content.cloneNode(true).querySelector('div')
}