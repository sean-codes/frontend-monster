var app = document.querySelector('.app')
var htmlNav = app.querySelector('.nav')
var htmlLinks = htmlNav.querySelectorAll('.link')
var htmlContents = app.querySelector('.contents')
var htmlContentItems = [...htmlContents.querySelectorAll('.content')]
// setup
document.body.style.setProperty('--link-count', htmlLinks.length)


for (var htmlLink of htmlLinks) {
   htmlLink.addEventListener('click', onClickLink)
}

function onClickLink() {
   // setActiveLink(this)
   var htmlContent = htmlContents.querySelector('#' + this.dataset.to)
   var rect1 = htmlContents.getBoundingClientRect()
   var rect2 = htmlContent.getBoundingClientRect()

   htmlContents.scrollBy({
      top: rect2.top - rect1.top,
      left: 0,
      behavior: 'smooth'
   })
}


function setActiveLink(htmlLink) {
   htmlNav.querySelector('.active').classList.remove('active')
   htmlLink.classList.add('active')
}


// content scrolling
setInterval(() => {
   var sorted = htmlContentItems.sort((a, b) => {
      var aC = calcPercentInView(a)
      var bC = calcPercentInView(b)
      if (aC.inside == bC.inside) {
         return aC.toCenter < bC.toCenter ? -1 : 1
      }
      return aC.inside > bC.inside ? -1 : 1
   })

   var mostVisible = sorted[0]
   var link = app.querySelector('[data-to=' + mostVisible.id.replace('#', '') + ']')
   setActiveLink(link)
}, 100)


function calcPercentInView(element) {
   var parent = element.parentElement
   var pR = parent.getBoundingClientRect()
   var eR = element.getBoundingClientRect()

   var height = pR.height

   var top = Math.max(pR.y, Math.min(eR.y, pR.bottom))
   var bottom = Math.min(eR.bottom, pR.bottom)
   var inside = Math.max(0, (bottom - top) / height)
   if (eR.y > pR.top && eR.bottom < pR.bottom) {
    inside = 1  
   }

   var eC = eR.y + eR.height/2
   var pC = pR.y + pR.height/2
   var toCenter = Math.abs(eC - pC)

   element.innerHTML = `
      <div style="font-family: monospace">
         <h2>IN VIEW: ${Math.round(inside*100)}%</h2>
         <h2>TO CENTER: ${Math.round(toCenter)}px</h2>
      </div>
   `

   return {
      inside,
      toCenter,
   }
}