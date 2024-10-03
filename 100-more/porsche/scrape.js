console.clear()
var data = []
var app = document.querySelector('phn-header').shadowRoot
var cats = [...app.querySelectorAll('phn-p-button-pure.sc-phn-side-drawer-item')]
for (var i in cats) {
    var cat = cats[i]
    const name = cat.dataset.id?.replace('models/mainmenu.', '')
    const img = cat.querySelector('.model-signature')?.shadowRoot.querySelector('img').src
    const note = cat.querySelector('.subtext')?.innerHTML
    // console.log(name, img, note)
    

    setTimeout((cat) => {
        console.log('[CATEGROY]: ' + name)
        cat.click()
        setTimeout(() => {
            const items = readCurrentModels()
            data.push({ name, img, note, items })
        }, 500)
        
    }, i*1000, cat)
    
}

function readCurrentModels() {
    var items = []
    var models = [...app.querySelectorAll('.series-body-type.sc-phn-car-body-types-drawer phn-p-link-pure.sc-phn-car-body-types-drawer')]
    // console.log(models[0])
    
    for (var model of models) {
        var img = model.querySelector('.model-link-content img').srcset.split(',')[1].replace(' 2x', '').trim()
        var name = model.querySelector('phn-p-text').innerHTML.trim()
        console.log('[MODEL]: ', name)

        items.push({ img, name })
    }

    return items
}