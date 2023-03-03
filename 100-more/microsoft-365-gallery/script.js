var app = document.querySelector('.app')
var accordians = app.querySelectorAll('.accordian')
var preview = app.querySelector('.preview')
var previewImg = preview.querySelector('img')

for (var acc of accordians) {
   var topElement = acc.querySelector('.top')
   topElement.onclick = onClickTop
}

function onClickTop() {
   // remove old open
   var open = app.querySelector('.open')
   if (open && open !== this.parentElement) open.classList.remove('open')


   // toggle open
   this.parentElement.classList.toggle('open')
   
   // dont show if its the same image
   // we will add dataset.img to the preview image
   var newImage = this.dataset.img
   var oldImage = preview.querySelector('img').dataset.img
   if (oldImage && oldImage.includes(newImage)) return

   // set image
   preview.innerHTML = `
      <img src="${this.dataset.img}" data-img="${this.dataset.img}"/>
   `
}