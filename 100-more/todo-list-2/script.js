var app = document.querySelector('.app')
var htmlList = app.querySelector('.component-list')
var htmlInput = app.querySelector('input')
var htmlAdd = app.querySelector('.component-input button')
htmlAdd.onclick = onClickAdd

var list = [
   {
      text: 'wash cloths',
      deleted: false,
   },
   {
      text: 'clean out the garage',
      deleted: false,
   },
]
render()

function onClickDelete() {
   var index = Number(this.getAttribute('index'))
   // list.splice(index, 1)
   list[index].deleted = true
   render()
}

function onClickAdd() {
   if (htmlInput.value) {
      // list.push({ text: htmlInput.value, deleted: false }) // add to back of array
      var newItem = {
         text: htmlInput.value,
         deleted: false
      }
      list.splice(0, 0, newItem) // add to front of array
      htmlInput.value = ''
      render()
   }
}

function render() {
   // clear
   htmlList.innerHTML = ''

   // update
   var i = 0
   for (var item of list) {
      var htmlItem = document.createElement('div')
      var deletedClass = item.deleted ? 'deleted' : ''
      htmlItem.innerHTML = `
         <div class="item ${deletedClass}">
            <div class="text">${item.text}</div>
            <button index=${i}><i class="fa-solid fa-trash"></i></button>
         </div>
      `

      htmlList.append(htmlItem)

      // listen delete
      var button = htmlItem.querySelector('button')
      button.onclick = onClickDelete

      i = i + 1
   }
}