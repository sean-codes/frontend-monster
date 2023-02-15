
var mockFiles = [
   { name: 'folder_a', type: 'folder', files: [
      { name: 'item_z' },
      { name: 'item_x' },
      { name: 'folder_a 1', type: 'folder', files: [
         { name: 'item_a' },
         { name: 'item_b' },
      ]},
      { name: 'folder_a 2', type: 'folder', files: [
         { name: 'item_a' },
         { name: 'item_b' },
      ]},
   ]},
   { name: 'folder_c', type: 'folder', files: [
      { name: 'item_z' },
      { name: 'item_x' },
      { name: 'folder_c_1', type: 'folder', files: [
         { name: 'item_a' },
         { name: 'item_b' },
      ]},
      { name: 'folder_c_2', type: 'folder', files: [
         { name: 'item_a' },
         { name: 'item_b' },
      ]},
   ]},
]

// this operation is not really this complex. could send these references in
// the flat files or on the up/down events. was sort of curious what might
// the inside of a bash mv command look like. which i still sort of cheated
// and reused the curseFiles function. the fsGetFile would likely split on /
// then navigate in one at a time.
function fsMoveFile(from, to) {
   // console.log('move: '+ from)
   // console.log('to: ' + to)

   var fromFile = fsGetFile(from)
   var fromDir = fromFile.dir
   var toFile = fsGetFile(to)
   var toDir = toFile.type === 'folder' ? toFile : toFile.dir

   // console.log(fromFile, fromDir)
   // console.log(toFile, toDir)
   if (fromDir && toDir) {
      // split out the file
      var fromIndex = fromDir.files.findIndex(f => f.name === from.split('/').pop())
      var moved = fromDir.files.splice(fromIndex, 1).pop()


      toDir.files.push(moved)
   }

   // console.log(mockFiles)

   renderFiles()
}


function fsGetFile(path) {
   var dir = undefined
   var dirPath = path.slice(0, path.lastIndexOf('/'))

   // it really would not work this way
   curseFiles(mockFiles, f => {
      var pathPlusName = f.path + f.name
      if (pathPlusName === path) 
         fromDir = f
   })

   return fromDir
}


var htmlEvents = document.querySelector('.events')
var htmlFolders = document.querySelector('.folders')
var htmlHeld = document.querySelector('.held')
document.body.addEventListener('mousemove', onMouseMove)
document.body.addEventListener('mouseup', onMouseUp)
document.body.addEventListener('mouseleave', onMouseUp)


var state = {
   held: undefined,
   heldX: 0,
   heldY: 0,
   events: []
}


var events = []
renderFiles(mockFiles)


function onMouseMove(e) {
   htmlHeld.style.display = state.held ? 'block' : 'none'

   if (state.held) {
      htmlHeld.innerHTML = state.held.name
      htmlHeld.style.top = e.clientY + 'px'
      htmlHeld.style.left = e.clientX + 'px'
   }
}

function onMouseUp(e) {
   htmlHeld.style.display = 'none'
   state.held = undefined
}


function onFileMouseUp(e) {
   var fileUp = flatFiles(mockFiles)[this.dataset.flatId]
   var fileDown = state.held

   var fileFrom = fileDown.path + fileDown.name
   var fileTo = fileUp.path + fileUp.name

   if (fileFrom !== fileTo && !fileTo.startsWith(fileFrom)) {
      fsMoveFile(fileFrom, fileTo)
   }

   state.held = undefined
}


function onFileMouseDown(e) {
   var file = flatFiles(mockFiles)[this.dataset.flatId]
   state.held = file

   // console.log('mousedown', file)
}


function renderFiles(files) {
   // var flattened = flatFiles(files)
   htmlFolders.innerHTML = ''

   var flattened = flatFiles(mockFiles)
   for (var i in flattened) {
      var flat = flattened[i]
      htmlFile = document.createElement('div')
      htmlFile.classList.add('file')
      htmlFile.setAttribute('style', `--depth: ${flat.depth}`)
      htmlFile.innerText = flat.name
      htmlFile.dataset.flatId = i
      htmlFolders.appendChild(htmlFile)
      htmlFile.addEventListener('mousedown', onFileMouseDown)
      htmlFile.addEventListener('mouseup', onFileMouseUp)
   }
}


function flatFiles(files) {
   var flat = []
   curseFiles(files, (file) => flat.push(file))
   // console.log(flat)
   return flat
}


function curseFiles(files, callback, dir, path = '', depth = 0) {
   for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var filePath = path
      callback({ // ./
         ...file, // ./info
         depth: depth, // for display
         path: filePath, // ..
         dir: dir || { files } // ..info
      })


      if (file.type === 'folder') {
         folderPath = path + file.name + '/'
         curseFiles(file.files, callback, file, folderPath, depth + 1)
      }
   }
}


