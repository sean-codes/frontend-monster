const data = require('./bikes.json')
const fs = require('fs')

run()
async function run() {

for (var cat of data) {
   for (var bike of cat.items) {
      var {
         newPath,
      } = await dlImage(bike.label, bike.img)
      bike.img = newPath
   }
}

fs.writeFileSync('./bikes-new.json', JSON.stringify(data, null, 3), 'utf-8')
}
async function dlImage(name, url) {
   const parseUrl = new URL(url)
   const urlFile = parseUrl.pathname.split('/').pop()
   const fileType = urlFile.split('.').pop()
   const clearName = name.replaceAll(/[^\w\s]/gi, '').replaceAll(' ', '-').toLowerCase()

   const data = await fetch(url).then(d => d.arrayBuffer())
   const buffer = Buffer.from(data)
   fs.writeFileSync('./images/' + clearName + '.' + fileType, buffer, 'utf-8')

   return {
      newPath: './images/' + clearName + '.' + fileType
   }
}