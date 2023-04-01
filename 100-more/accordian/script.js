document.querySelectorAll('.acc .title').forEach(a => {
   a.onclick = function() {
      this.parentElement.classList.toggle('closed')
   }
})