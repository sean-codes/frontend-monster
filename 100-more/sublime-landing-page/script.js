var state = localStorage.getItem('toggle') === 'true' ? true : false
var eleToggle = document.querySelector('.toggle')
onClickToggle(state)

eleToggle.onclick = () => onClickToggle()

function onClickToggle(setState = null) {
   var newState = setState !== null ? setState : !eleToggle.classList.contains('on')
   eleToggle.classList.toggle('on', newState)
   document.body.classList.toggle('light', newState)

   localStorage.setItem('toggle', newState)
   setTimeout(() => {
      document.body.classList.add('ready')
   }, 100)
}

