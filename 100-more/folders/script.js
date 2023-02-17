import * as fs from "./mockFs.js"

console.log(fs)

fs.tests()

var root = curseReadDir('')
render()

function update() {
   root = curseReadDir('')
   render()
}

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
   var htmlFolders = document.querySelector('.folders')
   htmlFolders.innerHTML = html
}

function renderFolder(folder, depth = -1) {
   var html = ''
   for (var file of folder.files) {
      html += file.type === 'folder'
         ? renderFolder(file, depth + 1)
         : renderFile(file, depth + 1)
   }

   return `
      ${renderFile(folder, depth)}
      ${html}
   `  
}

function renderFile(file, depth) {
   return `
      <div 
         class="file" 
         style="--depth: ${depth}"
         data-folder="${file.folder}"
         data-path="${file.path}"
      >
         ${file.name}
      </div>
   `
}


// Listeners / Drag and drop
document.body.addEventListener('mousedown', e => {
   if (e.target.classList.contains('folder')) {
      // onMousedownFolder(e.target)
      onMousedownFile(e.target)
   }

   if (e.target.classList.contains('file')) {
      onMousedownFile(e.target)
   }
})
document.body.addEventListener('mousemove', onMousemove)
document.body.addEventListener('mouseup', onMouseup)



var down = undefined
var over = undefined


function onMousemove(e) {
   // console.log(e)
   var eleOver = e.target
   var overFile = eleOver.classList.contains('file')
   var overFolder = eleOver.classList.contains('folder')

   // remove old over
   var oldOver = document.querySelector('.over')
   oldOver && oldOver.classList.remove('over')
   over = undefined
   if (overFile || overFolder) {
      var folder = overFile
         ? document.querySelector(`[data-path="${eleOver.dataset.folder}"]`)
         : eleOver

      folder.classList.add('over')
      over = overFile 
         ? eleOver.dataset.folder 
         : eleOver.dataset.path
   }

}

function onMousedownFolder(ele) {
   console.log('clicked folder', ele)
}

function onMouseup(ele) {
   if (down && over) {      
      var downName = down.split('/').pop()
      fs.renameSync(down, over + '/' + downName)
      update()
   }
}

function onMousedownFile(ele) {
   down = ele.dataset.path
   console.log(down)
}

// var mockFiles = [
//    { name: 'folder_a', type: 'folder', files: [
//       { name: 'item_z' },
//       { name: 'item_x' },
//       { name: 'folder_a 1', type: 'folder', files: [
//          { name: 'item_a' },
//          { name: 'item_b' },
//       ]},
//       { name: 'folder_a 2', type: 'folder', files: [
//          { name: 'item_a' },
//          { name: 'item_b' },
//       ]},
//    ]},
//    { name: 'folder_c', type: 'folder', files: [
//       { name: 'item_z' },
//       { name: 'item_x' },
//       { name: 'atem_x' },
//       { name: 'folder_c_2', type: 'folder', files: [
//          { name: 'item_a' },
//          { name: 'item_b' },
//       ]},
//       { name: 'a_folder_c_1', type: 'folder', files: [
//          { name: 'item_a' },
//          { name: 'item_b' },
//       ]},
//       { name: 'folder_aaa', type: 'folder', files: [
//          { name: 'item_a' },
//          { name: 'item_b' },
//       ]},
//    ]},
// ]

// // this operation is not really this complex. could send these references in
// // the flat files or on the up/down events. was sort of curious what might
// // the inside of a bash mv command look like. which i still sort of cheated
// // and reused the curseFiles function. the fsGetFile would likely split on /
// // then navigate in one at a time.
// function fsMoveFile(from, to) {
//    // console.log('move: '+ from)
//    // console.log('to: ' + to)

//    var fromFile = fsGetFile(from)
//    var fromDir = fromFile.dir
//    var toFile = fsGetFile(to)
//    var toDir = toFile.type === 'folder' ? toFile : toFile.dir

//    // console.log(fromFile, fromDir)
//    // console.log(toFile, toDir)
//    if (fromDir && toDir) {
//       // split out the file
//       var fromIndex = fromDir.files.findIndex(f => f.name === from.split('/').pop())
//       var moved = fromDir.files.splice(fromIndex, 1).pop()


//       toDir.files.push(moved)
//    }

//    // sort
//    curseFsSort(mockFiles)
//    console.log(mockFiles)

//    renderFiles()
// }

// function curseFsSort(files) {
//    for (var file of files) {
//       if (file.type == 'folder') {
//          curseFsSort(file.files)
//          console.log('sort', file.name)
//          file.files.sort((a, b) => {
//             var testString = a.name < b.name
//             return testString ? -1 : 1
//          })
//          file.files.sort((a, b) => {
//             return a.type === 'folder' && b.type !== 'folder' ? -1 : 1
//          })
//       }
//    }
// }


// function fsGetFile(path) {
//    var dir = undefined
//    var dirPath = path.slice(0, path.lastIndexOf('/'))

//    // it really would not work this way
//    curseFiles(mockFiles, f => {
//       var pathPlusName = f.path + f.name
//       if (pathPlusName === path) 
//          fromDir = f
//    })

//    return fromDir
// }


// var htmlEvents = document.querySelector('.events')
// var htmlFolders = document.querySelector('.folders')
// var htmlHeld = document.querySelector('.held')
// document.body.addEventListener('mousemove', onMouseMove)
// document.body.addEventListener('mouseup', onMouseUp)
// document.body.addEventListener('mouseleave', onMouseUp)


// var state = {
//    held: undefined,
//    heldX: 0,
//    heldY: 0,
//    events: []
// }

// curseFsSort(mockFiles)
// renderFiles(mockFiles)


// function onMouseMove(e) {
//    htmlHeld.style.display = state.held ? 'block' : 'none'
//    htmlFolders.classList.toggle('grabbing', state.held ? true : false)

//    if (state.held) {
//       htmlHeld.innerHTML = state.held.name
//       htmlHeld.style.top = e.clientY + 'px'
//       htmlHeld.style.left = e.clientX + 'px'
//    }
// }

// function onMouseUp(e) {
//    htmlHeld.style.display = 'none'
//    state.held = undefined
// }


// function onFileMouseUp(e) {
//    var fileUp = flatFiles(mockFiles)[this.dataset.flatId]
//    var fileDown = state.held

//    var fileFrom = fileDown.path + fileDown.name
//    var fileTo = fileUp.path + fileUp.name

//    if (fileFrom !== fileTo && !fileTo.startsWith(fileFrom)) {
//       fsMoveFile(fileFrom, fileTo)
//    }

//    state.held = undefined
// }


// function onFileMouseOver(e) {
//    if (state.held) {
//       var flattenedFiles = flatFiles(mockFiles)
//       var file = flattenedFiles[this.dataset.flatId]
//       // var folder = file.dir
//       // console.log(file.dir)
//       var i = this.dataset.flatId // ok
//       if (file.type !== 'folder') {
//          for (i = this.dataset.flatId; i > 0; i--) {
//             var folder = flattenedFiles[i]
//             var isFolder = folder.type === 'folder'
//             var hasFile = isFolder && folder.files.some(f => file.path + f.name === file.full)
//             if (isFolder && hasFile) {
//                file = folder
//                break
//             }
//          }
//       }

//       // remove / add
//       var htmlCurrentlyOver = document.querySelector('.over')
//       htmlCurrentlyOver && htmlCurrentlyOver.classList.remove('over')

//       var newOver = document.querySelector(`[data-flat-id="${i}"`)
//       newOver.classList.add('over')
//    }
// }

// function onFileMouseDown(e) {
//    var file = flatFiles(mockFiles)[this.dataset.flatId]
//    state.held = file
//    htmlFolders.classList.toggle('grabbing', state.held ? true : false)
// }


// function renderFiles(files) {
//    htmlFolders.innerHTML = ''

//    var flattened = flatFiles(mockFiles)
//    for (var i in flattened) {
//       var flat = flattened[i]
//       htmlFile = document.createElement('button')
//       htmlFile.classList.add('file')
//       htmlFile.setAttribute('style', `--depth: ${flat.depth}`)
//       htmlFile.innerText = flat.name
//       htmlFile.tabIndex = 1
//       htmlFile.dataset.flatId = i
//       htmlFolders.appendChild(htmlFile)
//       htmlFile.addEventListener('mousedown', onFileMouseDown)
//       htmlFile.addEventListener('mouseup', onFileMouseUp)
//       htmlFile.addEventListener('mouseover', onFileMouseOver)
//    }
// }


// function flatFiles(files) {
//    var flat = []
//    curseFiles(files, (file) => flat.push(file))
//    return flat
// }


// function curseFiles(files, callback, dir, path = '', depth = 0) {
//    for (var i = 0; i < files.length; i++) {
//       var file = files[i]
//       var filePath = path
//       callback({ // ./
//          ...file, // ./info
//          depth: depth, // for display
//          full: filePath + file.name,
//          path: filePath, // ..
//          dir: dir || { files }, // ..info
//       })


//       if (file.type === 'folder') {
//          folderPath = path + file.name + '/'
//          curseFiles(file.files, callback, file, folderPath, depth + 1)
//       }
//    }
// }


