const app = document.querySelector('.app')
const htmlTitlebar = app.querySelector('.component-titlebar')
const htmlMenuBtn = htmlTitlebar.querySelector('.menu')
const htmlLayer1 = app.querySelector('.component-layer.one')
const htmlLayer2 = app.querySelector('.component-layer.two')
const htmlModelsLayer = app.querySelector('#models-menu')
const htmlOptions = htmlLayer1.querySelectorAll('.option')
const htmlHelpContent = app.querySelector('.help')
const templateOption = app.querySelector('#template-option')
const templateGallery = app.querySelector('#template-gallery')
const htmlGalleries = app.querySelector('#galleries')
const htmlOverlay = app.querySelector('.overlay')
const htmlTapeMeasure = app.querySelector('.tape-measure')
let models = null
let groups = null
initialize()


async function initialize() {
   models = await fetch('./bmw_models.json').then(r => r.json())
   groups = models.map(m => m.name)

   renderModelGalleries()
   setupFirstLayerOptions()
   setupMenuBtn()
}

function renderModelGalleries() {
   console.log(models)
   for (var group of models) {

      const newGallery = templateGallery.content.cloneNode(true).querySelector('.component-gallery')
      // newGallery.classList.add('hide')
      const templateGalleryItem = newGallery.querySelector('#template-gallery-item')
      for (var model of group.models) {
         const newItem = templateGalleryItem.content.cloneNode(true).querySelector('.item')
         newItem.querySelector('img').src = model.img
         newItem.querySelector('.year').innerHTML = model.year
         newItem.querySelector('.model').innerHTML = model.name
         newGallery.appendChild(newItem)
      }

      renderModelGroupLink(group, newGallery)
   }
}

fTimeouts = []

function renderModelGroupLink(group, gallery) {
   fTimeouts.map(t => clearTimeout(t))
   fTimeouts = []
   const newOption = templateOption.content.cloneNode(true).querySelector('.option')
   newOption.querySelector('.text').innerHTML = group.name
   htmlLayer2.appendChild(newOption)
   newOption.addEventListener('click', function () {
      // link stuff
      var currentlySelected = htmlLayer2.querySelector('.selected')
      currentlySelected?.classList.remove('selected')
      this.classList.add('selected')
      htmlGalleries.classList.add('show')

      // measure first
      htmlTapeMeasure.appendChild(gallery)

      fTimeouts.push(setTimeout(() => {
         var oldHeight = galleries.getBoundingClientRect().height
         var height = gallery.getBoundingClientRect().height
         console.log('height', height)

         // hide old
         var galleryToHide = [...htmlGalleries.querySelectorAll('.component-gallery')]
         galleryToHide.map(g => g.classList.add('hide'))

         // i want smoother start + transition on simular height
         function showSecond() {
            galleries.appendChild(gallery)
            fTimeouts.push(setTimeout(() => {
               gallery.classList.remove('hide')
            }))
         }

         fTimeouts.push(setTimeout(() => {
            galleries.style.height = height + 50 + 'px'
            if (Math.abs(oldHeight - height) < 50) {
               galleryToHide.map(g => galleries.removeChild(g))
               showSecond()
            } else {
               galleryToHide.map(g => galleries.removeChild(g))
               fTimeouts.push(setTimeout(() => {
                  console.log('adding')
                  showSecond()
               }, 350))
            }
         }, 250))
      }, 1))
   })
}

function setupMenuBtn() {
   htmlMenuBtn.addEventListener('click', () => {
      const wasOpen = htmlTitlebar.classList.contains('open')
      htmlTitlebar.classList.toggle('open')
      htmlOverlay.classList.toggle('show')
      if (wasOpen) {
         resetMenu()
      }
   })
}

function setupFirstLayerOptions() {
   for (var htmlOption of htmlOptions) {
      htmlOption.addEventListener('click', function() {
         document.querySelector('.selected')?.classList.remove('selected')
         this.classList.add('selected')

         htmlLayer2.classList.add('hide')
         htmlHelpContent.classList.remove('hide')
         htmlGalleries.innerHTML = ''
         htmlGalleries.style.height = '0px'
         htmlLayer2.querySelector('.selected')?.classList.remove('selected')
         fTimeouts.map(t => clearTimeout(t))
         fTimeouts = []
         const isModelMenu = this.id == 'option-models'

         if (isModelMenu) {
            htmlLayer2.classList.remove('hide')
            htmlHelpContent.classList.add('hide')
         }
      })
   }
}

function resetMenu() {
   htmlLayer1.querySelector('.selected')?.classList.remove('selected')
   htmlLayer2.querySelector('.selected')?.classList.remove('selected')
   htmlLayer2.classList.add('hide')
   htmlGalleries.querySelector('.show')?.classList.remove('show')
   htmlHelpContent.classList.add('hide')
   htmlGalleries.classList.remove('show')
   htmlGalleries.innerHTML = ''
   htmlOverlay.classList.remove('show')
}

window.addEventListener('resize', handleResize)
function handleResize() {
   // should break / inneficient
   var gallery = htmlGalleries.querySelector('.component-gallery')
   if (gallery) {
      htmlTapeMeasure.appendChild(gallery)
      setTimeout(() => {
         var height = gallery.getBoundingClientRect().height
         htmlGalleries.style.height = height + 50 + 'px'
         htmlGalleries.appendChild(gallery)
      }, 1)
   }
}