var template = document.querySelector('template')
// console.log(template)

// clone it
// console.log(clone)

// container

var loopTime = 100
for (var i =0; i < loopTime; i++) {
   var clone = template.content.cloneNode(true)
   // console.log(i)

   var container = document.querySelector('.app')
   container.append(clone)
}
