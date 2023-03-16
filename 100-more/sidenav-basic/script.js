var sidenav = document.querySelector('.sidenav')
var dropdowns = sidenav.querySelectorAll('.dropdown')
var toggle = sidenav.querySelector('.sidenav .toggle')
for (var dropdown of dropdowns) {
    dropdown.onclick = function() {
        sidenav.classList.remove('hide')
        this.classList.toggle('open')
    }
}

toggle.onclick = function() {
    if (!sidenav.classList.contains('hide')) {
        for (var dropdown of dropdowns) {
            dropdown.classList.remove('open')
        }
    }
    sidenav.classList.toggle('hide')
}