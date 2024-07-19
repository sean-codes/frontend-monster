console.clear()


var data = []

// open categories
console.log('Opening menu')
var nav = document.querySelector('.header__primary-nav-link')
var event = new MouseEvent('mouseover', {
  'view': window,
  'bubbles': true,
  'cancelable': true
});

nav.dispatchEvent(event);

setTimeout(triumphCycler, 500)

function triumphCycler() {
    console.log('Starting to loop categories')
    // get categories
    const htmlCats = [...document.querySelectorAll('.kFoOft button')]
    
    for (var i in htmlCats) {
        var htmlCat = htmlCats[i]
        // if (i > 0) break
        // loop over each button
        setTimeout((cat, index) => {
            catName = cat.innerHTML
            cat.click()
            setTimeout(loopCycles, 1, catName, (index == htmlCats.length-1))
        }, i * 5000, htmlCat, i)
    }
    
    // loop categories then get motorcycles
    function loopCycles(catName, lastOne) {
        console.log('loop cycles: ' + catName)
        const htmlCycles = [...document.querySelectorAll('.GenrePanel___StyledDiv3-sc-fhdyyc-6 button')]
        const items = []
        for (var i in htmlCycles) {
            var htmlCycle = htmlCycles[i]
            // console.log(htmlCycle)
            setTimeout((htmlCycle, lastOne, lastOneOne) => {
                var dataCycle = {}
                htmlCycle.click()
                setTimeout(() => {
                
                    var panel = document.querySelector('.kHoiJz')
                    dataCycle.name = panel.querySelector('.eVpuyx').innerHTML
                    dataCycle.price = panel.querySelector('.bVVNkM').innerHTML
                    dataCycle.img = panel.querySelector('img')?.src
                    dataCycle.attributes = []
                    var htmlAttributes = panel.querySelectorAll('table tr')
                    for (var htmlRow of htmlAttributes) {
                        var htmlCols = [...htmlRow.querySelectorAll('td')]
                        var [htmlValue, htmlKey] = htmlCols
                        var key = htmlKey.innerHTML
                        var value = htmlValue.innerHTML
                        dataCycle.attributes.push({key, value})
                    }
                    
                    items.push(dataCycle)
                    if (lastOneOne) {
                        console.log('collected group:', { label: catName, items  })
                        data.push({ label: catName, items  })
                    }
                    if (lastOneOne && lastOne) {
                        console.log("Triumph motorcycles data")
                        console.log('---------------------------------')
                        console.log(data)
                    }
                }, 300)
            }, i * 400, htmlCycle, lastOne, i == htmlCycles.length-1)
            
        }
    }
}