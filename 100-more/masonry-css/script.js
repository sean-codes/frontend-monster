var htmlImages = document.querySelector('.images')
// generate images
for (var i = 0; i < 100; i++) {
   // create an image
   var htmlImage = document.createElement('div')
   htmlImage.classList.add('image')
   
   // 50% time add landscape
   if (Math.random() < 0.5) {
      htmlImage.classList.add('landscape')
   }
   
   // add text div
   htmlImage.innerHTML = `
      <div class="text">${i}</div>
   `
   
   htmlImages.appendChild(htmlImage)
}


