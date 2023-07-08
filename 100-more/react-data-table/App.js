import { mockRows, getMaxPages, basicSort, nextSort } from "./util.js"


function App() {
   const [page, setPage] = React.useState(0)
   const [rows, setRows] = React.useState(mockRows())
   const columns = [
      { label: 'qty', sort: basicSort },
      { label: 'price', sort: basicSort },
      { label: 'fruit', sort: basicSort },
      { label: 'date', sort: basicSort},
   ]
   
   const [filter, setFilter] = React.useState('')
   const [sortedColumn, setSortedColumn] = React.useState(0)
   const [sortedDirection, setSortedDirection] = React.useState('none') // 'asc', 'dsc', 'none'
   
   // ----------------------
   // sorting
   const sortedRows = [...rows].sort((a, b) => {
      return columns[sortedColumn].sort(sortedColumn, sortedDirection, a, b)
   })
   
   // ----------------------
   // filtering
   const filterRows = [...sortedRows].filter(row => {
      return row.some(cell => cell.toString().includes(filter))
   })
   
   // ----------------------
   // pagination
   const rowsPerPage = 10
   const maxPages = getMaxPages(filterRows.length, rowsPerPage)
   const startRow = page*rowsPerPage
   const endRow = Math.min(startRow + rowsPerPage, filterRows.length)
   const paginatedRows = [...filterRows].slice(startRow, endRow)
   
   function handleClickHeader(column) {
      if (sortedColumn != column) {
         setSortedDirection('asc') // default
      } else {
         setSortedDirection(nextSort(sortedDirection))
      }
      
      setSortedColumn(column)
      setPage(0) // reset page
   }
   
   function handlePageForward() {
      const maxPages = getMaxPages(filterRows.length, rowsPerPage)
      setPage(Math.min(maxPages, page+1))
   }
   
   function handlePageBack() {
      setPage(Math.max(0, page-1))
   }

   function handleChangeFilter(value) {
      setFilter(value)
      setPage(0)
   }
   
   return (
      <div className="app">
         <div className="filter">
            <input 
               type="text" 
               placeholder="Text filter" 
               value={filter} 
               onChange={(e) => handleChangeFilter(e.target.value)} 
            />
         </div>
         <div>{filterRows.length} results</div>

         <table>
            <TableHead 
               columns={columns} 
               onClickHeader={handleClickHeader}
               sortedColumn={sortedColumn}
               sortedDirection={sortedDirection}
            />
            <TableBody rows={paginatedRows} />
         </table>
         <Pagination 
            onPageBack={handlePageBack} 
            onPageForward={handlePageForward} 
            start={startRow}
            end={endRow}
            page={page}
            maxPages={maxPages}
         />
      </div>
   )
}


// render
const root = ReactDOM.createRoot(app)
root.render(<App />);