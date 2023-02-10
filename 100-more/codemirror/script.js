console.log('meow')


var htmlEditors = document.querySelector('.editors')
var editorHTML = htmlEditors.querySelector('#editor-html')
var editorCSS = htmlEditors.querySelector('#editor-css')
var editorJS = htmlEditors.querySelector('#editor-js')
var editors = [editorHTML, editorCSS, editorJS]

var grabbed = undefined
var grabbedPos = { x: 0, y: 0 }
var grabbedOffset = { x: 0, y: 0 }
var totalWidth = htmlEditors.getBoundingClientRect().width
var grabbers = generateGrabbers()
updateInfo()

// duplicate 
window.onresize = function () {
   var totalWidth = htmlEditors.getBoundingClientRect().width
   console.log(totalWidth)
   var grabberWidth = grabbers[0].html.getBoundingClientRect().width
   var totalPercent = grabbers.reduce((s, n) => s + n.widthPercent, 0)

   for (var grabber of grabbers) {
      var percentOfTotal = grabber.widthPercent / totalPercent
      var newTotalPercent = (totalWidth - (grabberWidth * 3)) / totalWidth
      var widthPercent = percentOfTotal * newTotalPercent
      grabber.widthPercent = widthPercent
      grabber.editor.style.width = 100 * widthPercent + '%'
   }
   updateGrabberLabels()
   updateInfo()
}


htmlEditors.addEventListener('mousemove', onEditorsMouseMove)
htmlEditors.addEventListener('mouseup', onEditorsMouseUp)

function generateGrabbers() {
   return [...document.querySelectorAll('.grabber')].map((html, i) => {
      html.onmousedown = onEditorMouseDown

      var grabberSize = html.getBoundingClientRect()
      var totalPercent = (totalWidth - (grabberSize.width*3)) / totalWidth
      var widthPercent = totalPercent / 3
      var editor = editors[i]
      editor.style.width = 100 * widthPercent + '%'

      return {
         html: html,
         editor: editor,
         widthPercent: widthPercent,
         size: function () {
            return this.editor.getBoundingClientRect()
         }
      }
   })
}

function onEditorsMouseUp(e) {
   grabbed = undefined
}

function onEditorsMouseMove(e) {
   e.preventDefault()
   if (grabbed) {
      var index = grabbers.indexOf(grabbed)
      if (index <= 0) return // can not move first in group

      var totalWidth = htmlEditors.getBoundingClientRect().width
      var grabberRect = grabbed.html.getBoundingClientRect()
      var grabberWidth = grabberRect.width

      var change = e.clientX - (grabberRect.left - grabbedOffset.x)
      var changed = false

      // there is some recurse way to do this :<

      // going right
      if (change > 0) {
         var before = grabbers[index - 1]
         var next = grabbers[index + 1]

         // if (next) {
            var spaceLeft = Math.max(next ? next.size().width : 0, grabbed.size().width)
            change = Math.min(Math.abs(change), spaceLeft) * Math.sign(change)
            console.log(change)
         // }

         if (change) changed = true

         var changePercent = change / totalWidth

         grabbed.widthPercent -= changePercent
         before.widthPercent += changePercent

         if (grabbed.widthPercent < 0) {
            if (next) {
               next.widthPercent += grabbed.widthPercent
            } else {
               before.widthPerscent += grabbed.widthPercent
            }
            grabbed.widthPercent = 0

            if (next && next.widthPercent < 0) {
               before.widthPerscent -= next.widthPercent
               next.widthPercent = 0
            }
         }
      }

      // going left
      if (change < 0) {
         // var before = grabbers[index - 1]
         // var beforeBefore = grabbers[index - 2]
         // var next = grabbers[index + 1]
         var befores = grabbers.slice(0, index).reverse()

         // var spaceLeft = Math.max(...befores.map(b => b.size().width))
         // if (spaceLeft) changed = true

         var totalChange = Math.abs(change)

         for (var before of befores) {
            if (!totalChange) continue
            var spaceLeft = before.size().width
            var changeIn = Math.min(totalChange, spaceLeft)

            console.log('changeIn', changeIn)
            if (changeIn) {
               var changePercent = changeIn / totalWidth
               grabbed.widthPercent += changePercent
               before.widthPercent -= changePercent

               totalChange -= changeIn
            }
         }


         // if (before) {
         //    change = Math.min(Math.abs(change), spaceLeft) * Math.sign(change)
         //    console.log(change)
         // }

         // var changePercent = change / totalWidth

         // grabbed.widthPercent -= changePercent
         // before.widthPercent += changePercent


         // // broken
         // if (before && before.widthPercent < 0) {
         //    // beforeBefore.widthPercent += before.widthPercent
         //    grabbed.widthPercent += before.widthPercent
         //    before.widthPercent = 0
         // }
      }  

      
      updateGrabberLabels()

      // update last grab point
      // if (changed) {
         grabbedPos.x = e.clientX
      // }
   }

   updateInfo()
}

function updateGrabberLabels() {
   // update all widths
   for (var grabber of grabbers) {
      grabber.editor.style.width = (grabber.widthPercent * 100) + '%'

      // toggle label if width less than 90
      var toggleLabel = grabber.size().width < 90
      grabber.html.classList.toggle('closed', toggleLabel)
   }
}


function onEditorMouseDown(e) {
   e.preventDefault()

   var grabber = grabbers.find(g => g.html === e.target)
   grabbed = grabber
   grabbedPos = { x: e.clientX, y: e.clientY } 
   grabberRect = grabber.html.getBoundingClientRect()
   grabbedOffset.x = grabberRect.x - e.clientX
   console.log(grabbedOffset.x)
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

   var totalWidthCalc = 1 - (grabbers[0].html.getBoundingClientRect().width * 3 / htmlEditors.getBoundingClientRect().width)
   var htmlWidthCalc = htmlInfo.querySelector('.widthTotalCalc')
   htmlWidthCalc.innerHTML = totalWidthCalc
}
console.log(grabbers)