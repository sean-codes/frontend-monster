console.log('meow')


var htmlEditors = document.querySelector('.editors')
var editorHTML = htmlEditors.querySelector('#editor-html')
var editorCSS = htmlEditors.querySelector('#editor-css')
var editorJS = htmlEditors.querySelector('#editor-js')
var editors = [editorHTML, editorCSS, editorJS]
console.log(editors)


var grabbed = undefined
var grabbedPos = { x: 0, y: 0 }
var totalWidth = htmlEditors.getBoundingClientRect().width

var grabbers = [...document.querySelectorAll('.grabber')].map((html, i) => {
   var grabberSize = html.getBoundingClientRect()
   var editor = editors[i]
   var editorSize = editor.getBoundingClientRect()
   html.onmousedown = onEditorMouseDown
   // console.log(editorSize)
   var width = editorSize.width - grabberSize.width
   // console.log(width)
   var widthPercent = ((totalWidth / 3) - (grabberSize.width)) / totalWidth
   console.log(totalWidth, grabberSize)
   editor.style.width = 100* widthPercent + '%'
   // console.log(widthPercent)
   return {
      html: html,
      editor: editors[i],
      width: editorSize.width,
      widthPercent: widthPercent,
      x: grabberSize.x,
      size: function() {
         return this.editor.getBoundingClientRect()
      }
   }
})

updateInfo()

htmlEditors.addEventListener('mousemove', onEditorsMouseMove)
htmlEditors.addEventListener('mouseup', onEditorsMouseUp)



function onEditorsMouseUp(e) {
   grabbed = undefined
}
function onEditorsMouseMove(e) {
   e.preventDefault()

   if (grabbed) {
      var index = grabbers.indexOf(grabbed)
      if (index <= 0) return // can not move first in group


      var totalWidth = htmlEditors.getBoundingClientRect().width
      var grabberWidth = grabbers[0].html.getBoundingClientRect().width

      var change = e.clientX - grabbedPos.x

      // console.log(changePercent)

      // there is some recurse way to do this :<

      // going right
      if (change > 0) {
         var before = grabbers[index - 1]
         var next = grabbers[index + 1]

         if (next) {
            var spaceLeft = Math.max(next.size().width, grabbed.size().width)
            change = Math.min(Math.abs(change), spaceLeft) * Math.sign(change)
         }

         var changePercent = change / totalWidth

         grabbed.widthPercent -= changePercent
         before.widthPercent += changePercent

         if (next && grabbed.widthPercent < 0) {
            next.widthPercent += grabbed.widthPercent
            grabbed.widthPercent = 0

            if (next.widthPercent < 0) {
               before.widthPercent -= next.widthPercent
               next.widthPercent = 0
            }
         }
      }

      // going left
      if (change < 0) {
         var before = grabbers[index - 1]
         var beforeBefore = grabbers[index - 2]
         var next = grabbers[index + 1]
         var befores = grabbers.slice(0, index)


         if (before) {
            var spaceLeft = Math.max(...befores.map(b => b.size().width))
            change = Math.min(Math.abs(change), spaceLeft) * Math.sign(change)
         }

         var changePercent = change / totalWidth

         grabbed.widthPercent -= changePercent
         before.widthPercent += changePercent

         if (before && before.widthPercent < 0) {
            beforeBefore.widthPercent += before.widthPercent
            before.widthPercent = 0
         }
      }  

      // update all widths
      for (var grabber of grabbers) {
         grabber.editor.style.width = grabber.widthPercent*100 + '%'

         // toggle label if width less than 90
         var toggleLabel = grabber.size().width < 90
         grabber.html.classList.toggle('closed', toggleLabel)
      }


      // update last grab point
      grabbedPos.x = e.clientX
   }

   updateInfo()
}

function onEditorMouseDown(e) {
   e.preventDefault()

   var grabber = grabbers.find(g => g.html === e.target)
   grabbed = grabber
   grabbedPos = { x: e.clientX, y: e.clientY } 
   console.log('grabbing', grabber, e.clientX, e.clientY)

}


function updateInfo() {
   var totalEditorsWidth = grabbers.reduce((sum, num) => {
      var width = num.widthPercent
      return sum + width
   }, 0)

   var htmlInfo = document.querySelector('.info')
   var htmlWidthTotal = htmlInfo.querySelector('.widthTotal')
   htmlWidthTotal.innerHTML = totalEditorsWidth

   var totalWidthCalc = 1 - grabbers[0].html.getBoundingClientRect().width*3 / htmlEditors.getBoundingClientRect().width
   var htmlWidthCalc = htmlInfo.querySelector('.widthTotalCalc')
   htmlWidthCalc.innerHTML = totalWidthCalc
}
console.log(grabbers)