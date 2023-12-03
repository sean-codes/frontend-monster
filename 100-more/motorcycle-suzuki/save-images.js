const data = require('./bikes.json')
const fs = require('fs')

run()
async function run() {

   for (var cat of data) {
      for (var bike of cat.items) {
         var {
            newPath,
            newPathLarge,
         } = await dlImage(bike.label + bike.package, bike.img)
         bike.img = newPath
         bike.imgHd = newPathLarge
      }
   }

   fs.writeFileSync('./bikes-new.json', JSON.stringify(data, null, 3), 'utf-8')
}

async function dlImage(name, url) {
   const parseUrl = new URL(url)
   const urlFile = parseUrl.pathname.split('/').pop()
   const fileType = urlFile.split('.').pop()
   const clearName = name.replaceAll(/[^\w\s]/gi, '_').replaceAll(' ', '-').toLowerCase()

   // small
   const data = await fetch(url).then(d => d.arrayBuffer())
   const buffer = Buffer.from(data)
   fs.writeFileSync('./images/' + clearName + '.' + fileType, buffer, 'utf-8')

   // large
   const largeUrl = url.replace('mw=400&w=400', 'mw=800&w=800')
   const dataLarge = await fetch(largeUrl).then(d => d.arrayBuffer())
   const bufferLarge = Buffer.from(dataLarge)
   fs.writeFileSync('./images/' + clearName + '_hd' + '.' + fileType, bufferLarge, 'utf-8')

   return {
      newPath: './images/' + clearName + '.' + fileType,
      newPathLarge: './images/' + clearName + '_hd' + '.' + fileType
   }
}