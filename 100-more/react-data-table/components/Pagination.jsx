window.Pagination = function({
   onPageBack,
   onPageForward,
   page,
   maxPages,
   start,
   end,
}) {
   
   return (
      <div className="pagination">
         {page > 0 && <button onClick={onPageBack}>Previous</button>}
         <div><b>Page</b> {page+1} of {maxPages+1} <b>Rows</b> {start+1} - {end}</div>
         {page < maxPages && <button onClick={onPageForward}>Next</button>}
      </div>
   )
}