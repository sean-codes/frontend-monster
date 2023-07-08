window.TableBody = function({ rows }) {
   return (
      <tbody>
         {rows.map((row, i) => {
            return (
               <tr key={i}>
                  {row.map((data, i) => {
                     return (
                        <td key={i}>
                           {data}
                        </td>
                     )
                  })}
               </tr>
            )
         })}
      </tbody>
   )
}
