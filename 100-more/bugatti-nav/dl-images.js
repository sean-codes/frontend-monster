var images = [
   '/media/s14bj3ml/image-container-lifestyle-universe-bugatti.jpg',
   '/media/345jidoy/image-container-lifestyle-news-zeitgeist.jpg',
   '/media/q53ccyzm/image-container-heritage-chronic.jpg',
   '/media/5sxjkxmq/image-container-heritage-myths.jpg',
   '/media/b1uovbfe/image-container-heritage-vintage-icons.jpg',
   '/media/cltib1mx/image-container-heritage-modern-classics.jpg',
   '/media/zywe2ljb/image-container-heritage-racing.jpg',
   '/media/bjcicpy0/image-container-heritage-heritage.jpg',
   '/media/iljaznus/image-container-models-w16.jpg',
   '/media/3r2fkcwt/image-container-models-chiron.jpg',
   '/media/o0eg0zsn/image-container-models-chiron-special-editions.jpg',
   '/media/x5rkzuru/image-container-models-coachbuilding.jpg',
   '/media/gzadujju/image-container-models-track-only.jpg',
   '/media/4rzdqo4v/image-container-customization-sur-mesure.jpg',
   '/media/baqfrwwr/image-container-customization-accessories.jpg',
   '/media/colaxnqh/image-container-ownership-customer-journey.jpg',
   '/media/qexfi1bs/image-container-ownership-driving-your-bugatti.jpg'
]
const fs = require('fs')

run()
async function run() {


   for (var i in images) {
      var image = images[i]
      var name = i
      await dlImage(image, i + '.jpg')
   }
}

async function dlImage(url, name) {
   // small
   const data = await fetch('https://www.bugatti.com/' + url).then(d => d.arrayBuffer())
   const buffer = Buffer.from(data)
   fs.writeFileSync('./images/' + name, buffer, 'utf-8')
}