/*---------------------------------------------------------------
| Editor Horizontal Resizers
---------------------------------------------------------------*/
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
      var changeP = change / totalWidth
      var changed = false

      // why this still feel wrong!!! :<
      // going right
      if (change > 0) {
         var nexts = grabbers.slice(index, grabbers.length)
         var before = grabbers[index-1]

         var totalChange = Math.abs(changeP)
         var totalSpace = nexts.reduce((s, n) => s + n.widthPercent, 0)
         
         var changeIt = Math.min(totalSpace, totalChange)
         
         // force move. next with fix up
         grabbed.widthPercent -= changeIt * Math.sign(change)
         before.widthPercent += changeIt * Math.sign(change)

         nexts.forEach((next, i) => {
            var nextNext = nexts[i+1]
            if (next.widthPercent < 0) {
               if (nextNext) {
                  nextNext.widthPercent += next.widthPercent
               }
               next.widthPercent = 0
            }
         })
      }

      // going left
      if (change < 0) {
         var befores = grabbers.slice(0, index).reverse()

         var totalChange = Math.abs(change)

         for (var before of befores) {
            if (!totalChange) continue
            var spaceLeft = before.size().width
            var changeIn = Math.min(totalChange, spaceLeft)

            if (changeIn) {
               var changePercent = changeIn / totalWidth
               grabbed.widthPercent += changePercent
               before.widthPercent -= changePercent

               totalChange -= changeIn
            }
         }
      }


      updateGrabberLabels()

      grabbedPos.x = e.clientX
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
}


function updateInfo() {
   var totalEditorsWidth = grabbers.reduce((sum, num) => {
      var width = num.widthPercent
      return sum + width
   }, 0)

   var htmlInfo = document.querySelector('.debug')
   var htmlWidthTotal = htmlInfo.querySelector('.widthTotal')
   htmlWidthTotal.innerHTML = totalEditorsWidth

   var totalWidthCalc = 1 - (grabbers[0].html.getBoundingClientRect().width * 3 / htmlEditors.getBoundingClientRect().width)
   var htmlWidthCalc = htmlInfo.querySelector('.widthTotalCalc')
   htmlWidthCalc.innerHTML = totalWidthCalc
}


/*---------------------------------------------------------------
| Editor Vertical Resize
---------------------------------------------------------------*/
// should reuse grabber code from above but all experimental :]

var htmlVGrabber = document.querySelector('.v-grabber') 
htmlVGrabber.onmousedown = onVGrabberMouseDown
var editorsHeight = 350
// console.log(htmlVGrabber)
var vGrabbed = undefined
var vGrabbedPos = 0
var vGrabbedOffset = 0


function onVGrabberMouseDown(e) {
   e.preventDefault()
   document.body.classList.add('grabbed')
   console.log('grabbing', this.getBoundingClientRect().y - e.clientY)
   vGrabbed = this
   vGrabbedPos = e.clientY
   vGrabbedOffset = this.getBoundingClientRect().y - e.clientY
}

document.addEventListener('mousemove', (e) => {
   if (vGrabbed) {
      var change = vGrabbedPos - e.clientY
      editorsHeight -= change
      htmlEditors.style.height = editorsHeight + 'px'

      vGrabbedPos = e.clientY
   }
})

document.addEventListener('mouseup', (e) => {
   document.body.classList.remove('grabbed')
   vGrabbed = null
})


/*---------------------------------------------------------------
| Display Iframe
---------------------------------------------------------------*/
var iframe = document.querySelector('iframe')
var displayTimeout = undefined
var displayTimeoutTime = 1000

cmEditorHtml.on('change', updateDisplayTimeout)
cmEditorCss.on('change', updateDisplayTimeout)
cmEditorJs.on('change', updateDisplayTimeout)


updateDisplay()



function updateDisplayTimeout() {
   clearTimeout(displayTimeout)

   displayTimeout = setTimeout(() => {
      updateDisplay()  
   }, displayTimeoutTime)
}
function updateDisplay() {
      var html = `
         <style>
            ${cmEditorCss.getValue()}
         </style>
         ${cmEditorHtml.getValue()}

         <script type="text/javascript">
            ${cmEditorJs.getValue()}
         </script>

      `
      // console.log(html)

      iframe.contentDocument.open()
      iframe.contentDocument.write(html)
      iframe.contentDocument.close()
}









