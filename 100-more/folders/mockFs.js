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

export function fsMoveFile(from, to) {
   console.log('move: '+ from)
   console.log('to: ' + to)
   
}

export function readDir() {
   return mockFiles
}
