console.clear()
const categories = document.querySelector('#nav-models')
var data = curseNav(categories)
console.log(JSON.stringify(data, null, 3))
console.log(data)

function curseNav(nav) {
    var items = []    
    var cats = nav.querySelectorAll('[class*="col-md"]')

    for (var cat of cats) {
        var name = cat.querySelector('.smallDarkTitle')
        name = name?.childElementCount == 0
            ? name.innerHTML
            : name?.firstChild.innerHTML

        if (!name) continue

        var img = cat.querySelector('img')?.src
        var link = cat.querySelector('a')
        var navTo = link.getAttribute('onclick')?.split("('")[1].split("'")[0]
        var note = cat.querySelector('.snipe') ? 'new' : undefined
        var nextCat = document.querySelector('#'+navTo)
        var price = [...cat.querySelectorAll('.nav-models-title')].pop()?.innerHTML
        
         items.push({
            name,
            img,
            navTo,
            note,
            price: price?.replace('*', ''),
            items: nextCat ? curseNav(nextCat) : undefined
        })
        
    }

    return items
}


