// figure out how the hell to do this
var rightButton = document.querySelector('.final .right-button')
var leftButton = document.querySelector('.final .left-button')
// console.log(button)

// data
var position = 0

// program
rightButton.onclick = onClickRightButton
leftButton.onclick = onClickLeftButton

function onClickRightButton() {
   // console.log('test')
   var oldPositon = position
   position = position + 1

   if (position > 4) {
      position = 4
   }
   // console.log('position', position)
   var slides = document.querySelector('.final .slides')
   slides.classList.remove('move-' + oldPositon)
   slides.classList.add('move-' + position)

   // show the left
   if (position > 0) {
      leftButton.classList.remove('hide')
   }
}


function onClickLeftButton() {
   // update position
   var oldPosition = position // save old position
   position = position - 1
   // console.log(position)

   if (position < 0) {
      position = 0
   }

   var slides = document.querySelector('.final .slides')
   slides.classList.remove('move-' + oldPosition)
   slides.classList.add('move-' + position)

   if (position == 0) {
      leftButton.classList.add('hide')
   }
}
