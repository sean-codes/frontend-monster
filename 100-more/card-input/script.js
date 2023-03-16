var app = document.querySelector('.app')

// element selectors
var inputGroupCardNumber = app.querySelector('#inputGroupCardNumber')
var inputCardNumber = inputGroupCardNumber.querySelector('input')
var inputGroupCardHolders = app.querySelector('#inputGroupCardHolders')
var inputCardHolders = inputGroupCardHolders.querySelector('input')

// event listeners
var cardCardNumber = app.querySelector('.card-middle .number')
var cardCardHolder = app.querySelector('#cardCardHolder .value')

// listen for onfocus
inputCardNumber.onfocus = onFocusCardNumber
inputCardHolders.onfocus = onFocusCardHolders

function onFocusCardNumber() {
    removeCurrentHighlight()
    setHighlightOnElement(cardCardNumber)
}

function onFocusCardHolders() {
    removeCurrentHighlight()
    setHighlightOnElement(cardCardHolder)
}

function removeCurrentHighlight() {
    // remove current highlight
    var currentHighlight = app.querySelector('.highlight')
    if (currentHighlight) currentHighlight.classList.remove('highlight')
}

function setHighlightOnElement(element) {
    element.classList.add('highlight')
}