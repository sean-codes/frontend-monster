var mockFiles = [
   { name: 'folder a', type: 'folder', files: [
      { name: 'item z' },
      { name: 'item x' },
      { name: 'folder a 1', type: 'folder', files: [
         { name: 'item a' },
         { name: 'item b' },
      ]},
      { name: 'folder a 2', type: 'folder', files: [
         { name: 'item a' },
         { name: 'item b' },
      ]},
   ]},
   { name: 'folder c', type: 'folder', files: [
      { name: 'item z' },
      { name: 'item x' },
      { name: 'folder c 1', type: 'folder', files: [
         { name: 'item a' },
         { name: 'item b' },
      ]},
      { name: 'folder c 2', type: 'folder', files: [
         { name: 'item a' },
         { name: 'item b' },
      ]},
   ]},
]

var mockFiles2 = [
   { name: 'folder_a', type: 'folder', path: '/' },
   { name: 'file_a', type: 'file', path: '/folder_a/', },
   { name: 'file_b', type: 'file', path: '/folder_a/' },
   { name: 'folder_b', type: 'folder', path: '/folder_a/'},
   { name: 'file_c', type: 'file', path: '/folder_a/folder_b/'},
]



var htmlEvents = document.querySelector('.events')
var htmlFolders = document.querySelector('.folders')
var htmlHeld = htmlFolders.querySelector('.held')
document.body.addEventListener('mousemove', onMouseMove)
document.body.addEventListener('mouseup', onMouseUp)


var state = {
   held: undefined,
   heldX: 0,
   heldY: 0,
   events: [],
   flatFiles: mockFiles2//flatFiles(mockFiles)
}

setInterval(processEvents, 1000/120)

var events = []
renderFiles(mockFiles)


function moveFile(file, to) {
   console.log('moving', file, to)
}


function eventMouseUp() {
   state.held = false
   htmlHeld.style.display = 'none'
}

function eventFileMouseDown(event) {
   var file = state.flatFiles[event.data.index]
   state.held = event.data.index
}

function eventFileMouseUp(event) {
   var file = state.flatFiles[event.data.index]
   if (file && state.held) {
      // console.log('switch', state.held, 'with', event.data.index)
      var file1 = state.flatFiles[state.held]
      var file2 = state.flatFiles[event.data.index]

      var to = file2.path + (file2.type === 'folder' ? file2.name : '')
      moveFile(file1, to)

      renderFiles()
   }
}

function evenMouseMove(event) {
   if (state.held) {
      htmlHeld.style.display = 'block'
      htmlHeld.innerHTML = state.held.name
      htmlHeld.style.top = event.data.y + 'px'
      htmlHeld.style.left = event.data.x + 'px'
   }
}

function processEvents() {
   for (var event of state.events) {
      htmlEvents.innerHTML = JSON.stringify(event, null, 3) + htmlEvents.innerHTML

      var fire = {
         'mouseup': eventMouseUp,
         'mousemove': evenMouseMove,
         'files_mousedown': eventFileMouseDown,
         'files_mouseup': eventFileMouseUp,
      }[event.type]

      fire && fire(event)
   }

   state.events = []
}


function addEvent(event) {
   state.events.push(event)
}

function onMouseMove(e) {
   addEvent({
      type: 'mousemove',
      data: {
         x: e.clientX,
         y: e.clientY
      }
   })
}

function onMouseUp(e) {
   addEvent({
      type: 'mouseup',
   })
}

function onFileMouseUp(e) {
   addEvent({
      type: 'files_mouseup',
      data: {
         index: Number(this.dataset.fileId),
         x: e.clientX,
         y: e.clientY,
      }
   })
}

function onFileMouseDown(e) {
   addEvent({
      type: 'files_mousedown',
      data: {
         index: Number(this.dataset.fileId),
         x: e.clientX,
         y: e.clientY,
      }
   })
}

function renderFiles(files) {
   // var flattened = flatFiles(files)
   htmlFolders.innerHTML = ''

   var flattened = state.flatFiles
   for (var i in flattened) {
      var flat = flattened[i]
      var depth = flat.path.split('/').length - 2
      htmlFile = document.createElement('div')
      htmlFile.classList.add('file')
      htmlFile.setAttribute('style', `--depth: ${depth}`)
      htmlFile.innerText = flat.name
      htmlFile.dataset.fileId = i
      htmlFolders.appendChild(htmlFile)
      htmlFile.addEventListener('mousedown', onFileMouseDown)
      htmlFile.addEventListener('mouseup', onFileMouseUp)
   }
}



function flatFiles(files) {
   var flat = []
   curseFiles(files, (file) => flat.push(file))
   return flat
}

function curseFiles(files, callback, path = '', depth = 0) {
   for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var filePath = path
      callback({
         name: file.name,
         depth: depth,
         files: files,
         path: filePath,
      })


      if (file.type === 'folder') {
         path += file.name + '/'
         curseFiles(file.files, callback, path, depth + 1)
      }
   }
}

