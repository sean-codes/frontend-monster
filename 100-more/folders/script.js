import * as fs from "./mockFs.js"



fs.tests()

var htmlDebug = document.querySelector('#debug')
htmlDebug.value = ''
window.debug = function(text) {
   htmlDebug.value = Date.now().toString().slice(-5) + ': ' + text + "\r\n" + htmlDebug.value
}



var htmlFolders = document.querySelector('.folders')
var openFolders = []

var root = undefined
function update() {
   debug('update: rendering')
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
         draggable="true"
         style="--depth: ${depth}"
         data-folder="${file.folder}"
         data-path="${file.path}"
      >
         <div class="icon ${iconClass}"></div>
         <div class="text">${file.name}</div>
      </div>
   `
}

function getIconClass(file) {
   var fileSplit = file.name.split('.')
   var ext = fileSplit.length > 1 ? fileSplit.pop() : ''

   return ext ? 'ext-' + ext : '' 
}


var down = undefined
var over = undefined
var holding = false
var htmlHeld = document.querySelector('.held')


function setupListeners() {
   var files = htmlFolders.querySelectorAll('.file')
   for (var file of files) {
      // file.addEventListener('mousemove', onMouseMove)  
      file.addEventListener('mousedown', onMousedownFile)
      file.addEventListener('mouseup', onMouseupFile)
      file.addEventListener('dragstart', onDragstartFile)
   }

   var folders = htmlFolders.querySelectorAll('.folder')
   for (var folder of folders) {
      folder.addEventListener('mousemove', onMousemoveFolder)
   }

   var folderTitles = htmlFolders.querySelectorAll('.folder > .file')
   for (var folderTitle of folderTitles) {
      // should use dragstart or some sort of offset/timer around here
      // this style will cause the folder clicks need to be perfect
      folderTitle.addEventListener('mouseup', onMouseclickFolder)
   }
}

// Listeners / Drag and drop
document.body.addEventListener('mousemove', onMousemove)
document.body.addEventListener('mouseup', onMouseup)
document.body.addEventListener('mouseleave', onMouseup)

function onMousemoveFolder(e) {
   e.stopPropagation()
   // remove old over. add over to this
   var oldOver = document.querySelector('.over')
   oldOver && oldOver.classList.remove('over')
   this.classList.add('over')

   over = this.dataset.path

   updateHeld(e.clientX, e.clientY)
}

function onMouseclickFolder(e) {
   if (!holding) {
      var untoggled = this.parentElement.classList.toggle('closed')
      var folderPath = this.dataset.path
      openFolders.push(folderPath)
      if (untoggled) {
         openFolders = openFolders.filter(f => f !== folderPath)
      }

      debug('onMouseclickFolder: "' + folderPath + '"')
   }
}

function onMouseupFile(e) {
   console.log('up?')
   if (down && over && (down !== over)) {
      debug('onMouseupFile: attempting move "' + down + '" -> "' + over + '"')
      // move file
      var downName = down.split('/').pop()
      var newPath =  over + '/' + downName

      var success = fs.renameSync(down, newPath)

      // switch open
      if (success) {
         debug('onMouseupFile: move success')
         var wasOpen = openFolders.some(f => f == down)
         if (wasOpen) {
            openFolders = openFolders.filter(f => f !== down)
            openFolders.push(newPath)
         }
      }
   }
}

function onDragstartFile(e) {
   e.preventDefault()
   document.body.classList.add('holding')
   holding = true
}

function onMousedownFile(e) {
   down = this.dataset.path
   debug('onMousedownFile: "' + down + '"')
}

function onMousemove(e) {
   updateHeld(e.clientX, e.clientY)
}

function onMouseup(e) {
   debug('onMouseup: dropping')
   drop()
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
      holding = false
      return
   }

   if (holding) {
      var name = down.split('/').pop()
      if (!document.body.classList.contains('holding')) {
         debug('updateHeld: lifted "' + name + '"')
      }
      htmlHeld.style.display = 'block'
      htmlHeld.innerHTML = name
      htmlHeld.style.left = x + 'px'
      htmlHeld.style.top = y + 'px'
   }
}