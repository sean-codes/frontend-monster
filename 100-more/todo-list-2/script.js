var app = document.querySelector('.app')
var input = app.querySelector('input')
var buttonAdd = app.querySelector('.component-input button')
var list = app.querySelector('.component-list')
buttonAdd.addEventListener('click', onClickAdd)

var todos = [
   {
      text: 'hello 1',
      deleted: false,
   },
   {
      text: 'hello 2',
      deleted: false,
   }
]


function onClickAdd() {
   if (!input.value) return
   
   todos.push({
      text: input.value,
      delete: false,
   })

   input.value = ''
   render()
}

function onClickDel() {
   var index = Number(this.getAttribute('index'))
   todos.splice(index, 1)
   render()
}

render()
function render() {
   // clear
   list.innerHTML = ''

   // create
   var i = 0;
   for (var todo of todos) {
      var element = document.createElement('div')
      element.innerHTML = `
         <div class="item">
            <div class="text">${todo.text}</div>
            <button index="${i}">
               <i class="fa-solid fa-trash"></i>
            </button>
         </div>
      `

      element.querySelector('button').addEventListener('click', onClickDel)
      list.append(element)
      i+=1
   }
}