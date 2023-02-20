var container = document.querySelector('.container')

var mockData = {
   headers: [
      'Header 1',
      "Header 2",
      "Header 3",
      "Header 4",
   ],
   rows: [
      ['row 1', 'data 1 - 2', 'data 1 - 3', 'data 1 - 4'],
      ['row 2', 'data 2 - 2', 'data 2 - 3', 'data 2 - 4'],
      ['row 3', 'data 3 - 2', 'data 3 - 3', 'data 3 - 4'],
      ['row 4', 'data 4 - 2', 'data 4 - 3', 'data 4 - 4'],
      ['row 5', 'data 5 - 2', 'data 5 - 3', 'data 5 - 4'],
      ['row 6', 'data 6 - 2', 'data 6 - 3', 'data 6 - 4'],
      ['row 7', 'data 7 - 2', 'data 7 - 3', 'data 7 - 4'],
      ['row 8', 'data 8 - 2', 'data 8 - 3', 'data 8 - 4'],
      ['row 9', 'data 9 - 2', 'data 9 - 3', 'data 9 - 4'],
      ['row 10', 'data 10 - 2', 'data 10 - 3', 'data 10 - 4'],
      ['row 11', 'data 11 - 2', 'data 11 - 3', 'data 11 - 4'],
      ['row 12', 'data 12 - 2', 'data 12 - 3', 'data 12 - 4'],
      ['row 13', 'data 13 - 2', 'data 13 - 3', 'data 13 - 4'],
      ['row 14', 'data 14 - 2', 'data 14 - 3', 'data 14 - 4'],
      ['row 15', 'data 15 - 2', 'data 15 - 3', 'data 15 - 4'],
      ['row 16', 'data 16 - 2', 'data 16 - 3', 'data 16 - 4'],
      ['row 17', 'data 17 - 2', 'data 17 - 3', 'data 17 - 4'],
      ['row 18', 'data 18 - 2', 'data 18 - 3', 'data 18 - 4'],
   ],
   actions: [
      { name: 'del', onClick: 'onClickDelete'}
   ]
}


var page = 0
var rowPerPage = 5
var renderTimeout = undefined

function onClickDelete(rowId) {
   // update data
   mockData.rows = mockData.rows.filter((row, i) => i !== rowId)
   page = Math.min(page, getMaxPage())
   console.log(page)

   var eleRow = document.querySelector('.row-' + rowId)
   if (eleRow) {
      eleRow.classList.add('delete')
   }

   clearTimeout(renderTimeout) 
   renderTimeout = setTimeout(() => {
      render()
   }, 500)
}

function onClickChangePage(amount) {
   page = Math.max(0, Math.min(page + amount, getMaxPage()))
   render()
}

function getMaxPage() {
   var rows = mockData.rows.length
   var max = Math.floor((rows-1) / rowPerPage)
   return max
}

function render() {
   var { headers, rows, actions } = mockData

   var rowStart = page * rowPerPage
   var rowEnd = Math.min(rowStart + rowPerPage, mockData.rows.length)


   // Headers
   //-----------------------------------------------
   var htmlHeaders = ''
   for (var header of headers) {
      htmlHeaders += `<th>${header}</th>`
   }
   // actions
   htmlHeaders += `<th>actions</th>`


   // Rows
   //-----------------------------------------------
   var htmlRows = ''
   for (var i = rowStart; i < rowEnd; i++) {
      var row = rows[i]
      var htmlRow = ''
      for (var cell of row) {
         htmlRow += `<td><div>${cell}</div></td>`
      }

      // action
      for (var action of actions) {
         htmlRow += `<td><div>
            <button class="del" onclick="${action.onClick}(${i})">
                  ${action.name}
            </button>
         </div></td>`
      }

      htmlRows += `<tr class="row-${i}">${htmlRow}</tr>`
   }

   // Table
   //-----------------------------------------------
   var html = `
      <h1>Table Delete Action</h1>
      <div class="table-wrapper">
         <table>
            <tr>
               ${htmlHeaders}
            </tr>
            ${htmlRows}
         </table>
      </div>
      <div class="actions">
         <button onclick="onClickChangePage(-1)">Back</button>
         <button onclick="onClickChangePage(1)">Forward</button>
         <div class="page">Page: ${page}</div>
      </div>
   `

   container.innerHTML = html
}

// initial render
render()