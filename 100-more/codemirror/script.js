console.log('meow')


var htmlEditors = document.querySelector('.editors')
var editorHTML = htmlEditors.querySelector('#editor-html')
var editorCSS = htmlEditors.querySelector('#editor-css')
var editorJS = htmlEditors.querySelector('#editor-js')
var editors = [editorHTML, editorCSS, editorJS]
console.log(editors)


var grabbed = undefined
var grabbedPos = { x: 0, y: 0 }
var grabbers = [...document.querySelectorAll('.grabber')].map((html, i) => {
   var size = html.getBoundingClientRect()
   var editor = editors[i]
   var editorSize = editor.getBoundingClientRect()
   console.log(editorSize)
   html.onmousedown = onEditorMouseDown

   return {
      html: html,
      editor: editors[i],
      width: editorSize.width,
      widthPercent: 1/3,
      x: size.x
   }
})

htmlEditors.addEventListener('mousemove', onEditorsMouseMove)
htmlEditors.addEventListener('mouseup', onEditorsMouseUp)



function onEditorsMouseUp(e) {
   grabbed = undefined
}
function onEditorsMouseMove(e) {
   // console.log('moved', e.clientX, e.clientY)
   e.preventDefault()

   if (grabbed) {
      var index = grabbers.indexOf(grabbed)
      if (index <= 0) return

      var grabbedBefore = grabbers[index - 1]
      var grabbedAfter = grabbers[index + 1]
      var totalWidth = htmlEditors.getBoundingClientRect().width//grabbedBefore.width + grabbed.width
      var totalWidthPercent = grabbedBefore.widthPercent + grabbed.widthPercent

      var change = e.clientX - grabbedPos.x
      var changePercent = change / totalWidth
      console.log(changePercent)
      // console.log(totalWidthPercent)

      grabbedBefore.widthPercent += changePercent
      grabbed.widthPercent -= changePercent

      if (grabbed.widthPercent < 0) {
         if (change > 0 && grabbedAfter) {
            console.log('move over')
            grabbedAfter.widthPercent += grabbed.widthPercent
            grabbed.widthPercent = 0
         }

         if (change < 0 && grabbedBefore) {
            
         }
      }

      grabbedBefore.editor.style.width = `calc(${100* grabbedBefore.widthPercent + '%'} - 1rem)`
      grabbed.editor.style.width = `calc(${100* grabbed.widthPercent + '%'} - 1rem)`
      grabbedAfter.editor.style.width = `calc(${100* grabbedAfter.widthPercent + '%'} - 1rem)`
      // console.log('resize', index)
      // console.log(totalWidth)

      grabbedPos.x = e.clientX
   }
}

function onEditorMouseDown(e) {
   e.preventDefault()

   var grabber = grabbers.find(g => g.html === e.target)
   grabbed = grabber
   grabbedPos = { x: e.clientX, y: e.clientY } 
   console.log('grabbing', grabber, e.clientX, e.clientY)

}

console.log(grabbers)