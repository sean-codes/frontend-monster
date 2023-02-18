import * as fs from "./mockFs.js"

console.log(fs)

fs.tests()

var htmlFolders = document.querySelector('.folders')
var openFolders = []

var root = undefined
function update() {
   root = curseReadDir('')
   render()
}

fs.watch('', {}, update)
update()

function curseReadDir(path) {
   var readDir = fs.readDirSync(path)

   return !readDir
      ? new File(path)
      : new Folder(path, readDir)
}

function File(path) {
   this.path = path
   var pathSplit = path.split('/')
   this.name = pathSplit.pop()
   this.folder = pathSplit.join('/')
   this.type = 'file'

   return this
}

function Folder(path, files) {
   this.type = 'folder' // lots of duplicates..
   this.files = []
   this.path = path
   var pathSplit = path.split('/')
   this.name = pathSplit.pop()
   this.folder = pathSplit.join('/')

   for (var file of files) {
      this.files.push(curseReadDir(path + '/' + file))
   }

   return this
}



function render() {
   var html = renderFolder(root)
   htmlFolders.innerHTML = html
   setupListeners()
}

function renderFolder(folder, depth = -1) {
   var html = ''
   for (var file of folder.files) {
      html += file.type === 'folder'
         ? renderFolder(file, depth + 1)
         : renderFile(file, depth + 1)
   }

      // ${renderFile(folder, depth)}
   var opened = openFolders.some(f => f === folder.path) || folder.path == ''

   return `
      <div class="folder ${opened ? '' : 'closed'}" data-path="${folder.path}">
         ${depth > -1 ? renderFile(folder, depth, true) : ""}
         <div class="files">${html}</div>
      </div>
   `  
}

function renderFile(file, depth, isFolder = false) {
   var iconClass = getIconClass(file)

   return `
      <div 
         class="file" 
         style="--depth: ${depth}"
         data-folder="${file.folder}"
         data-path="${file.path}"
      >
         <div class="icon">
            ${isFolder
               ? `<i class="fa-solid fa-folder"></i><i class="fa-regular fa-folder-open"></i>`
               : `<i class="${iconClass}"></i>`
            }
         </div>
         <div class="text">${file.name}</div>
      </div>
   `
}

function getIconClass(file) {
   // console.log('meow', file.name)
   var fileSplit = file.name.split('.')
   var ext = fileSplit.length > 0 ? fileSplit.pop() : ''

   if (file.type == 'folder') {
      return 'fa-regular fa-folder-open'
   }
   return {
      'html': 'fa-brands fa-html5',
      'js': 'fa-brands fa-js',
      'css': 'fa-brands fa-css3',
      'scss': 'fa-brands fa-sass',
   }[ext] || 'fa-solid fa-file-code'
}


var down = undefined
var over = undefined
var htmlHeld = document.querySelector('.held')

function setupListeners() {
   var files = htmlFolders.querySelectorAll('.file')
   for (var file of files) {
      // file.addEventListener('mousemove', onMouseMove)  
      file.addEventListener('mousedown', onMousedownFile)
      file.addEventListener('mouseup', onMouseupFile)
   }

   var folders = htmlFolders.querySelectorAll('.folder')
   for (var folder of folders) {
      folder.addEventListener('mousemove', onMousemoveFolder)
   }

   var folderTitles = htmlFolders.querySelectorAll('.folder > .file')
   for (var folderTitle of folderTitles) {
      folderTitle.addEventListener('click', onMouseclickFolder)
   }
}

// Listeners / Drag and drop
document.body.addEventListener('mousemove', onMousemove)
document.body.addEventListener('mouseup', onMouseup)
document.body.addEventListener('mouseleave', onMouseup)

function onMousemoveFolder(e) {
   e.stopPropagation()
   lift()
   // remove old over. add over to this
   var oldOver = document.querySelector('.over')
   oldOver && oldOver.classList.remove('over')
   this.classList.add('over')

   over = this.dataset.path

   updateHeld(e.clientX, e.clientY)
}

function onMouseclickFolder(e) {
   e.stopPropagation()
   var untoggled = this.parentElement.classList.toggle('closed')
   var folderPath = this.dataset.path
   openFolders.push(folderPath)
   if (untoggled) {
      openFolders = openFolders.filter(f => f !== folderPath)
   }
}

function onMouseupFile(e) {
   if (down && over) {
      if (down == over) {
         // expand folder
         console.log(down, over)
      } else {
         // move file
         var downName = down.split('/').pop()
         var newPath =  over + '/' + downName
         var success = fs.renameSync(down, newPath)

         // switch open
         if (success) {
            var wasOpen = openFolders.some(f => f == down)
            if (wasOpen) {
               openFolders = openFolders.filter(f => f !== down)
               openFolders.push(newPath)
            }
         }
      }
   }

   drop()
}

function onMousedownFile(ele) {
   down = this.dataset.path
}

function onMousemove(e) {
   updateHeld(e.clientX, e.clientY)
}

function onMouseup(e) {
   drop()
}

function lift() {
   document.body.classList.add('holding')
}
function drop() {
   over = undefined
   down = undefined
   updateHeld()
}

function updateHeld(x, y) {
   if (!down) {
      document.body.classList.remove('holding')
      htmlHeld.style.display = 'none'
      return
   }

   htmlHeld.style.display = 'block'
   var name = down.split('/').pop()
   htmlHeld.innerHTML = name
   htmlHeld.style.left = x + 'px'
   htmlHeld.style.top = y + 'px'
}