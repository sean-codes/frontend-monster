var eleCards = document.querySelectorAll('.card')

for (var eleCard of eleCards) {
   eleCard.iterations = 0
   eleCard.onanimationiteration = function() {
      this.iterations = this.iterations + 1
   }

   eleCard.onclick = function() {
      // remove these always
      this.classList.remove('pinned-out')
      this.querySelector('.top').style.animationIterationCount = 'infinite'

      // if its pinned we need to transition out of the animation
      if (this.classList.contains('pinned')) {
         //
         this.querySelector('.top').style.animationIterationCount = this.iterations + 1
         this.classList.add('pinned-out')
      }

      // toggled pinned class
      this.classList.toggle('pinned')

   }
}

