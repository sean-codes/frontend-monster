var navItems = [...document.querySelectorAll('.category-nav .nav-item')]
console.log('len', navItems.length)
var data = navItems.map(i => {
    var items = [...i.querySelectorAll('.submenu li')].map(s => ({
        label: s.querySelector('.item-description span')?.innerHTML,
        description: s.querySelector('a').dataset.description,
        price: s.querySelector('a').dataset.subtitle,
        img: s.querySelector('.item-image img')?.src,
        package: s.querySelector('.package')?.innerHTML,
    })).filter(f => f.label)
    
    return { 
        label: i.querySelector('.tappable').innerHTML,
        url: i.querySelector('a').href,
        items: items
    }
})
console.log(JSON.stringify(data, null, 3))


