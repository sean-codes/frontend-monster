const app = document.querySelector('.app')
const htmlMenu = document.querySelector('.c-menu')
const htmlMenuCategories = app.querySelector('.categories')
const htmlMenuCategoriesArr = [...htmlMenu.querySelectorAll('.category')]
const htmlOptions = [...app.querySelectorAll('.options .option')]
const htmlMenuOptions = app.querySelector('.options-groups')
console.log('test')

init()
async function init() {
   const data = await fetch('./bikes-new.json').then(d => d.json())
   // console.log(data)
   renderCatgegories(data)
}

function renderCatgegories(data) {
   console.log(data)
   const templateCategory = app.querySelector('#template-category')

   for (var category of data) {
      const htmlCategory = cloneTemplate(templateCategory)
      htmlCategory.querySelector('.label').innerHTML = category.label
      htmlCategory.dataset.category = category.label
      htmlMenuCategories.append(htmlCategory)

      // render options
      const templateOptionGroup = app.querySelector('#template-option-group')
      const htmlOptionGroup = cloneTemplate(templateOptionGroup)
      console.log(htmlOptionGroup)
      const htmlExplore = cloneTemplate(htmlOptionGroup.querySelector('#template-explore'))
      for (var option of category.items) {
         const templateOption = htmlOptionGroup.querySelector('#template-option')
         const htmlOption = cloneTemplate(templateOption)
         htmlOption.querySelector('img').src = option.img
         htmlOption.querySelector('.label').innerHTML = option.label
         htmlOption.querySelector('.spec').innerHTML = option.package || ''
         htmlOptionGroup.append(htmlOption)
      }

      htmlOptionGroup.append(htmlExplore)
      htmlMenuOptions.append(htmlOptionGroup)
   }
}


// hovering option
for (var htmlOption of htmlOptions) {
   htmlOption.addEventListener('mouseenter', onHoverOption)
}

function onHoverOption(e) {
   console.log('e', e.target)
}

// hovering menu
for (var htmlCategory of htmlMenuCategoriesArr) {
   console.log(htmlCategory)
   htmlCategory.addEventListener('mouseenter', onHoverCategory)
}

function onHoverCategory(e) {
   // remove old
   const htmlOldOptions = htmlMenu.querySelector('.options.show')
   htmlOldOptions?.classList.remove('show') // if

   // find new options
   const category = e.target.dataset.category
   const htmlOptions = htmlMenu.querySelector(`.options[data-category="${category}"]`)

   // add show
   htmlOptions.classList.add('show')
}

function cloneTemplate(template) {
   return template.content.cloneNode(true).querySelector('div')
}