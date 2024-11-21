
setInterval(() => {
   var time = Date.now()
   fetch(window.location.href).then(() => {
      var ping = Date.now() - time
      document.querySelector('.ping').innerHTML = ping
   })
}, 1000)