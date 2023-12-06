var app = document.querySelector('.app')
var htmlMenu = app.querySelector('.menu')
var htmlMenuButton = app.querySelector('#menu-btn')
var htmlMenuButtonClose = app.querySelector('#menu-btn-close')
var htmlMenuStart = app.querySelector('.c-menu-start')
var htmlMenuCategory = app.querySelector('.c-menu-cats')
var htmlMenuCategory2 = app.querySelector('.c-menu-cats-2')
var htmlMenuLeft = htmlMenu.querySelector('.left')
var htmlMenuRight = htmlMenu.querySelector('.right')
var htmlMenuLeftInner = htmlMenu.querySelector('.left .inner')
var htmlMenuRightInner = htmlMenu.querySelector('.right .inner')

var htmlMenuBack = htmlMenu.querySelector('#menu-btn-back')
var templateCategory = app.querySelector('#template-cat')
var templateCategory2 = app.querySelector('#template-cat-2')
var templateModels = app.querySelector('#template-models')
var templateModel = app.querySelector('#template-model')

// data
var data = {}
;(async () => {
   data = await fetch('./data-new.json').then(d => d.json())
   runApp()
})()

// app
function runApp() {
   // render elements
   for (var catId in data) {
      var category = data[catId]
      // category 1
      var htmlCategory = templateCategory.content.cloneNode(true).querySelector('.cat')
      htmlCategory.querySelector('img').src = category.catImg
      htmlCategory.title = category.name
      htmlCategory.dataset.cat = catId
      htmlCategory.addEventListener('click', onClickStartCategory)

      htmlMenuCategory.appendChild(htmlCategory)

      // category 2
      var htmlCategory2 = templateCategory2.content.cloneNode(true).querySelector('.cat')
      htmlCategory2.querySelector('img').src = category.img
      htmlCategory2.title = category.name
      htmlCategory2.dataset.cat = catId
      htmlCategory2.addEventListener('click', onClickCategory)
      htmlMenuCategory2.querySelector('.cats').appendChild(htmlCategory2)

      // items
      var htmlModels = templateModels.content.cloneNode(true).querySelector('.c-models')
      htmlModels.id = 'menu-models-' + catId
      // htmlModels.classList.toggle('active', catId == 0)
      htmlModels.querySelector('button .end-btn').innerHTML = category.name + ' Models'
      for (var itemId in category.items) {
         var item = category.items[itemId]
         var htmlModel = templateModel.content.cloneNode(true).querySelector('.model')
         htmlModel.querySelector('img').src = item.img
         htmlModel.querySelector('.text').innerHTML = item.name
         htmlModel.style.setProperty('--index', itemId)
         htmlModels.querySelector('.models').append(htmlModel)
      }
      htmlMenuRightInner.append(htmlModels)

   }

   function onClickStartCategory() {
      var cId = this.dataset.cat
      hideAll(false, () => {
         htmlMenuCategory2.classList.add('active')
         htmlMenuCategory2.querySelectorAll('.cat')[cId].classList.add('active')

         var htmlMenuModelsCId = app.querySelector('.c-models#menu-models-'+cId)
         htmlMenuModelsCId.classList.add('active')
      })
   }

   function onClickCategory() {
      transitionRight(false, () => {
         var newModels = htmlMenuRight.querySelector('#menu-models-'+this.dataset.cat)
         newModels.classList.add('active')

         htmlMenuCategory2.querySelector('.active')?.classList.remove('active')
         this.classList.add('active')
      })
   }

   // switch menus
   var htmlStartMenus = htmlMenuStart.querySelectorAll('.link')
   for (var htmlStartMenu of htmlStartMenus) {
      htmlStartMenu.addEventListener('click', onClickStartMenu)
   }

   function onClickStartMenu() {

      // left
      var oldLink = htmlMenuStart.querySelector('.active')
      oldLink?.classList.remove('active')
      this.classList.add('active')
      var that = this
      // right
      transitionRight(false, () => {
         var oldMenu = htmlMenuRight.querySelector('.active')
         oldMenu?.classList.remove('active')
         var newMenu = htmlMenuRight.querySelector('#menu-' + that.dataset.menu)
         newMenu.classList.add('active')
      })
   }

   // toggle menu
   htmlMenuButton.addEventListener('click', onToggleMenu)
   htmlMenuButtonClose.addEventListener('click', onToggleMenu)

   var menuResetTimeout = null
   function onToggleMenu() {
      htmlMenu.classList.toggle('hide')
      document.body.classList.toggle('lock')

      clearTimeout(menuResetTimeout)
      if (htmlMenu.classList.contains('hide')) {
         menuResetTimeout = setTimeout(returnToStart, 200)
      }
   }

   // back
   htmlMenuBack.addEventListener('click', returnToStart)
   
   function returnToStart() {
      hideAll(true, () => {
         // show
         htmlMenuStart.classList.add('active')
         htmlMenuCategory.classList.add('active')
         htmlMenuStart.querySelector('.link').classList.add('active')
      })
   }

   function transitionRight(forwards = false, then) {
      htmlMenuRightInner.classList.remove('in')
      htmlMenuRightInner.classList.add('out')
      htmlMenuRightInner.classList.toggle('forwards', forwards)
      var htmlActives = [...htmlMenuRightInner.querySelectorAll('.active')]

      setTimeout(() => {
         htmlActives.forEach(a => a.classList.remove('active'))

         htmlMenuRightInner.classList.remove('out')
         setTimeout(() => {
            if (then) then()

            htmlMenuRightInner.classList.add('in')
         })
      }, 500)
   }

   function hideAll(forwards = false, then) {

      // hide 
      var htmlActives = [...htmlMenu.querySelectorAll('.active')]
      transitionRight(forwards)
      htmlMenuLeftInner.classList.remove('in')
      htmlMenuLeftInner.classList.add('out')
      htmlMenuLeftInner.classList.toggle('forwards', forwards)

      // animate out
      setTimeout(() => {
         htmlActives.forEach(a => a.classList.remove('active'))

         htmlMenuLeftInner.classList.remove('out')


         setTimeout(() => {
            if (then) then()

            htmlMenuLeftInner.classList.add('in')
         })
      }, 500)
   }
}
