// debug
var speed = 0.5
document.body.style.setProperty('--speed', speed)


var app = document.querySelector('.app')
var htmlBack = app.querySelector('.c-menu .back')
var htmlExit = app.querySelector('.c-menu .exit')
var hmtlMenuBtn = app.querySelector('#menu-btn')
var htmlDropdown = app.querySelector('.dropdown')
var htmlDropdownBackground = app.querySelector('.dropdown .background')
var htmlMenuContent = app.querySelector('.c-menu .content')
var templateGroup = app.querySelector('#template-group')
var templateItem = app.querySelector('#template-item')
runApp()

async function runApp() {
   var position = []
   var oldSize = -1
   var fTimeouts = []
   var data = {
      name: 'home',
      items: await fetch('./data-new.json').then(d => d.json())
   }

   renderGroup(data)
   navigateToGroup('group-home', true)


   hmtlMenuBtn.addEventListener('click', onClickMenuBtn)
   hmtlMenuBtn.click()

   function onClickMenuBtn() {
      htmlDropdown.classList.toggle('close')
      hmtlMenuBtn.classList.toggle('active')
   }


   htmlExit.addEventListener('click', onClickExitBtn)
   function onClickExitBtn() {
      htmlDropdown.classList.toggle('close')
      hmtlMenuBtn.classList.toggle('active')
   }

   htmlBack.addEventListener('click', onClickBack)

   function onClickBack() {
      var lastPosition = position[position.length-2]

      navigateToGroup(lastPosition || 'group-home', false)
   }

   function renderGroup(group) {
      var htmlGroup = cloneTemplate(templateGroup)
      group.html = htmlGroup
      var groupId = ('group-' + group.name).toLowerCase().replaceAll(' ', '')
      htmlGroup.id = groupId

      for (var i in group.items) {
         var item = group.items[i]
         var htmlItem = cloneTemplate(templateItem)
         htmlItem.querySelector('img').src = item.img
         htmlItem.querySelector('.text').innerHTML = item.name
         htmlItem.dataset.group = ('group-' + item.name).toLowerCase().replaceAll(' ', '')
         htmlItem.addEventListener('click', onClickItem)
         htmlItem.style.setProperty('--index', i)
         htmlGroup.appendChild(htmlItem)
         if (!item.items) {
            htmlItem.querySelector('.c-item').classList.add('model')
            htmlItem.querySelector('.price').innerHTML = `${item.price}* <span>(MSRP)</span>`
         }

         if (item.items) renderGroup(item)
      }

      htmlMenuContent.append(htmlGroup)
   }

   function onClickItem() {
      var group = this.dataset.group
      navigateToGroup(group, true)
   }

   
   function navigateToGroup(group, forward) {
      fTimeouts.forEach(t => clearTimeout(t))
      var newGroup = app.querySelector('#'+group)
      var oldGroup = htmlMenuContent.querySelector('.c-item-grid:not(.hide)')

      htmlBack.classList.toggle('hide', group === 'group-home')
      // show new
      if (!newGroup) return

      forward ? position.push(group) : position.pop()


      oldGroup?.classList.add('out')
      oldGroup?.classList.remove('in')
      oldGroup?.classList.toggle('forward', forward)

      fTimeouts.push(setTimeout(() => {
         oldGroup?.classList.add('hide')
         newGroup.classList.remove('out')
         newGroup.classList.remove('hide')

         newGroup.classList.add('in')

         // hide old
         fTimeouts.push(setTimeout(() => {
            const size = htmlDropdown.getBoundingClientRect().height
            htmlDropdownBackground.style.height = size + 'px'
            console.log(oldSize, size)
            newGroup.style.animationDelay = null
            if (oldGroup) oldGroup.style.animationDelay = null
            if (oldSize == size) {
               newGroup.style.animationDelay = '0s'
               if (oldGroup) oldGroup.style.animationDelay = '0s'
            }
            oldSize = size
         }, 1))
      }, 500 * speed))


   }

   function cloneTemplate(template) {
      return template.content.cloneNode(true).querySelector('div')
   }
}
