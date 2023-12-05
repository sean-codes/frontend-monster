var data = []

var currentCategory = null
var categories = [...document.querySelectorAll('.menu-models > .links[data-js-shortcutnav-lv1=""] > .link')]
// var models = [...document.querySelectorAll('.menu-models_lv2 .link')]
console.log(categories)

// console.log(categories.map(c => c.querySelector('.family')?.innerHTML.trim() || 'Scrambler'))
for (var c of categories) {
    var name = c.querySelector('.family')?.innerHTML.trim() || 'Scrambler'
    var newCat = { name: name, items: []}
    var models = c.querySelectorAll('.links .link')
    console.log(models)
    for (var model of models) {
        var sheet = model.querySelector('.model-sheet')
        console.log(sheet)
        var item = {}
        item.name = sheet.querySelector('.content .title')?.textContent.trim()
        item.price = sheet.querySelector('.price strong')?.textContent.trim()
        item.img = sheet.querySelector('.imgwrap.-link img').src
        
        // table
        item.attributes = []
        var table = sheet.querySelectorAll('.table li')
        for (var tr of table) {
            var key = tr.querySelector('span')?.textContent.trim()
            var value = tr.querySelector('strong')?.textContent.trim()
            item.attributes.push({ key, value})
            
        }
        newCat.items.push(item)
    }
    data.push(newCat)
}

console.log(JSON.stringify(data, null, 3))