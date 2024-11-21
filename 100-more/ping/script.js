
setInterval(() => {
   var time = Date.now()
   fetch(window.location.href, {cache: "no-store"}).then(() => {
      var ping = Date.now() - time
      document.querySelector('.ping').innerHTML = ping
   })
}, 1000)