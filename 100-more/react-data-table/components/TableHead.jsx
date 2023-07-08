window.TableHead = function({
   columns,
   onClickHeader,
   sortedColumn,
   sortedDirection
}) {
   const icon = {
      'asc': <i className="fa-solid fa-caret-down"></i>,
      'dsc': <i className="fa-solid fa-caret-up"></i>,
      'none': '',
   }[sortedDirection]

   return (
      <thead>
         <tr>
            {columns.map((column, i) => {
               const isSortedColumn = i === sortedColumn
               return (
                  <th key={i}>
                     {isSortedColumn && icon}
                     <button onClick={() => onClickHeader(i)}>{column.label}</button>
                  </th>
               )
            })}
         </tr>
      </thead>
   )
}