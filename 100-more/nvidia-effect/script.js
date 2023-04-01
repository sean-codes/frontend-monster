var units = document.querySelectorAll('.unit')
units.forEach(u => {
   setTimeout(() => {
      setInterval((unit) => {
         unit.classList.toggle('lit', Math.random() > 0.5)
      }, 500, u)
   }, Math.random() * 1000)
})



var rotate = 0
setInterval(() => {
   rotate += 0.2

   document.querySelector('.chip').style.setProperty('--chip-rotate-z', rotate + 'deg')
})