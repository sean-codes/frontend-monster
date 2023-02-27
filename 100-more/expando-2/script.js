var accordians = document.querySelectorAll('.accordian')
for (var accor of accordians) {
   accor.onclick = onClickAccordian
}

function onClickAccordian() {
   this.classList.toggle('open')
}