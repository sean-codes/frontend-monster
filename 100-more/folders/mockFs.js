//---------------------------------------------------------------
// Mock File System
//---------------------------------------------------------------
var mockFiles = {
   name: 'root',
   files: [
      { name: 'folder_a', type: 'folder', files: [
         { name: 'item z.css' },
         { name: 'item x.html' },
         { name: 'folder a 1', type: 'folder', files: [
            { name: 'item a.html' },
            { name: 'item b.css' },
         ]},
         { name: 'folder_a_2', type: 'folder', files: [
            { name: 'item_b.js' },
            { name: 'item_a.js' },
         ]},
      ]},
      { name: 'folder_c', type: 'folder', files: [
         { name: 'item z.js' },
         { name: 'item x.css' },
         { name: 'folder c 1', type: 'folder', files: [
            { name: 'item a.cpp' },
            { name: 'item b.js' },
         ]},
         { name: 'folder c 2', type: 'folder', files: [
            { name: 'item a.scss' },
            { name: 'item b.scss' },
         ]},
      ]},
   ]
}

//---------------------------------------------------------------
// Functions
//---------------------------------------------------------------
export function readDirSync(path) {
   var dir = osTraverseToPath(path)
   if (dir && dir.files) {
      var sorted = [...dir.files]
      sorted
         .sort((a, b) => a.name < b.name ? 1 : -1)
         .sort((a, b) => a.folder && !b.folder ? -1 : 1)

      return sorted.map(f => f.name)
   }
}


export function renameSync(oldPath, newPath) {
   var oldInfo = osPathInfo(oldPath)
   var newInfo = osPathInfo(newPath)
   var oldFile = osTraverseToPath(oldPath)

   var parentPath = oldFile.type === 'folder' ? oldPath : oldInfo.folder // wrong
   if (oldFile.type === 'folder' && newInfo.folder.startsWith(parentPath)) {
      console.error('fs.renameSync: can not more parent into child')
      return false
   }

   var oldFolder = osTraverseToPath(oldInfo.folder)
   var newFolder = osTraverseToPath(newInfo.folder)
   
   var copy = osTraverseToPath(oldPath)

   // remove from old
   oldFolder.files = oldFolder.files.filter(f => {
      return f.name !== oldInfo.name
   })

   newFolder.files.push(copy)
   debug.innerHTML = JSON.stringify(mockFiles, null, 4)
   window.postMessage({ type: 'fs_change', data: {
      old: oldPath,
      new: newPath,
   }})
   return true
}

export function watch(
   path = '', 
   options = {}, 
   callBack = () => {}
) {
   // i wonder how the messaging works in node internally for this
   window.addEventListener('message', (e) => {
      if (e.data && e.data.type == 'fs_change') {
         console.log('fs.watch: file system changed')
         callBack()
      }
   })
}

function osPathInfo(path) {
   var pathSplit = path.split('/')
   var name = pathSplit.pop()
   var folder = pathSplit.join('/')

   return { name, folder, path }
}

function osTraverseToPath(path) {
   var parts = path.split('/')
   var pointer = mockFiles
   var root = mockFiles.files

   try {
      for (var part of parts) {
         var partTrim = part.trim().replaceAll('/', '')
         if (!partTrim) continue

         pointer = root.find(f => {
            return f.name == partTrim
         })

         root = pointer.files
      }

      return pointer
   } catch(e) {
      return undefined
   }
}



//---------------------------------------------------------------
// Tests
//---------------------------------------------------------------
export function tests() {
   var testFunctions = [testReadDirSync, testOsTraverseToPath, testRenameSync]

   for (var test of testFunctions) {
      // setup
      var saveError = console.error
      console.error = () => {}
      var saveMockFiles = mockFiles
      mockFiles = JSON.parse(JSON.stringify(mockFiles))

      test()

      //reset
      mockFiles = saveMockFiles
      console.error = saveError
   }
}

function testOsTraverseToPath() {
   var testCases = [
      { path: '/folder_a', expect: mockFiles.files[0]},
      { path: '/folder_c', expect: mockFiles.files[1]},
   ]

   for (var test of testCases) {
      var receive = JSON.stringify(osTraverseToPath(test.path))
      var expect = JSON.stringify(test.expect)

      console.assert(
         receive === expect, 
         `
         Test fs.osTraverseToPath: ${test.path}
         Received: ${receive} 
         Expected: ${expect}
         `
      )
   }
}

function testReadDirSync() {
   var testCases = [
      { path: '', expect: ['folder_a', 'folder_c'] },
      { path: '/folder_a', expect: ["folder a 1","folder_a_2","item x.html","item z.css"] },
      { path: 'folder_a', expect: ["folder a 1","folder_a_2","item x.html","item z.css"]   },
      { path: 'folder_a/folder a 1', expect: ["item a.html","item b.css"]  },
      { path: '/folder_a/folder a 1', expect: ["item a.html","item b.css"] },
      { path: '/folder_a/folder_a_2', expect: ["item_a.js","item_b.js"]  },
      { path: '/folder_a/item z', expect: undefined },
   ]


   for (var test of testCases) {
      var receivedFiles = JSON.stringify(readDirSync(test.path))
      var expectFiles = JSON.stringify(test.expect)

      console.assert(
         receivedFiles == expectFiles, 
         `
         Test fs.ReadDirSync: ${test.path} 
         Received: ${receivedFiles} 
         Expected: ${expectFiles}
         `
      )
   }
}

function testRenameSync() {
   var beforeRename = JSON.stringify(mockFiles)

   var worked = renameSync('/folder_a', '/folder_a/folder a 1/folder_a')
   console.assert(!worked, 'Test renameSync: can not move parent into child')
   console.assert(
      JSON.stringify(mockFiles) == beforeRename, 
      'Test renameSync: can not move parent into child'
   )
}

