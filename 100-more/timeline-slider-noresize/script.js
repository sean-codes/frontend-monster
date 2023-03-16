console.log('test')
var app = document.querySelector('.app')
var iconGroups = app.querySelectorAll('.icon-group')
var highlight = app.querySelector('.highlight')

for (var iconGroup of iconGroups) {
    iconGroup.onclick = onClickIconGroup
}

function onClickIconGroup() {
    // set active
    var currentlyActive = app.querySelector('.active')
    currentlyActive.classList.remove('active')
    this.classList.add('active')

    // move highlight
    var index = Number(this.getAttribute('index'))
    highlight.style.left = index * 6 + 'rem';


    // cards
    var currentShownCard = app.querySelector('.card.show')
    currentShownCard.classList.remove('show')

    var nextCardToShow = app.querySelector('.card-' + index)
    nextCardToShow.classList.add('show')
}