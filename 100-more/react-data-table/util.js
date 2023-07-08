export function mockRows() {
   function randomRange(a, b) { return Math.floor(Math.random()*(b-a)+a) }
   function randomFruit() { return ['apple', 'orange', 'peach', 'grape'][Math.floor(Math.random()*4)] }
   function randomDate() { return randomRange(1,12) + '-' + randomRange(1,30) + '-' + randomRange(2013,2023)} 

   const rows = []
   for (var i = 0; i < 50; i++) {
      rows.push([randomRange(100, 500), randomRange(10, 50), randomFruit(), randomDate() ])
   }
   
   return rows
}

export function getMaxPages(rowCount, rowsPerPage) {
   let maxPages = Math.floor(rowCount / rowsPerPage)
   if (rowCount % rowsPerPage === 0) maxPages -= 1
   return Math.max(maxPages, 0)
}

export function basicSort(col, dir, a, b) {
   var aCol = a[col]
   var bCol = b[col]

   if (dir == 'none') return 0
   return aCol > bCol 
      ? dir === 'asc' ? 1 : -1 
      : dir === 'asc' ? -1 : 1
}

export function nextSort(currentSort) {
   if (currentSort === 'none') return 'asc'
   if (currentSort === 'asc') return 'dsc'
   if (currentSort === 'dsc') return 'none'
}
