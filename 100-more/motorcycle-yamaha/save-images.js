const data = require('./data.json')
const fs = require('fs')

run()
async function run() {

   for (var item of data) {
      await curseItems(item)
   }

   fs.writeFileSync('./data-new.json', JSON.stringify(data, null, 3), 'utf-8')
}

async function curseItems(group) {
   // console.log('hello', group)
   await saveItem(group)

   for (var item of group.items) {
      await saveItem(item)
      if (item.items) await curseItems(item)
   }
}

async function saveItem(item) {
   try {

   const parseUrl = new URL(item.img)
   const urlFile = parseUrl.pathname.split('/').pop()
   const fileType = urlFile.split('.').pop()
   const clearName = item.name.replaceAll(/[^\w\s]/gi, '_').replaceAll(' ', '-').toLowerCase()
   const newPath = './images/' + clearName + '.' + fileType
   await fetchAndSave(item.img, newPath)
   item.img = newPath
   } catch(e) {
      console.log('probably done previous')
   }
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