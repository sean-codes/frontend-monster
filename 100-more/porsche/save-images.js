const data = require('./data.json')
const fs = require('fs')

run()
async function run() {

   for (var cat of data) {
      // category images
      var catImageSavePath = './images/cat_text_'+cat.name+'.svg'
      await fetchAndSave(cat.img, catImageSavePath)
      cat.img = catImageSavePath
      var catCarAndTextSavePath = './images/cat_text_and_car_'+cat.name+'.webp'
      await fetchAndSave(cat.catimg, catCarAndTextSavePath)
      cat.catImg = catCarAndTextSavePath


      for (var bike of cat.items) {
         const parseUrl = new URL(bike.img)
         const urlFile = parseUrl.pathname.split('/').pop()
         const fileType = urlFile.split('.').pop()
         const clearName = bike.name.replaceAll(/[^\w\s]/gi, '_').replaceAll(' ', '-').toLowerCase()
         const newPath = './images/' + clearName + '.' + fileType
         await fetchAndSave(bike.img, newPath)
         bike.img = newPath
      }
   }

   fs.writeFileSync('./data-new.json', JSON.stringify(data, null, 3), 'utf-8')
}


async function fetchAndSave(url, filePath) {
   console.log(url, filePath)
   try {

      const data = await fetch(url).then(d => d.arrayBuffer())
      const buffer = Buffer.from(data)
      fs.writeFileSync(filePath, buffer, 'utf-8')
   } catch(e) {
      console.log('failed?')
   }
}