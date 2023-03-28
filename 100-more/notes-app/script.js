var app = document.querySelector('.app')
var buttonCreate = app.querySelector('#buttonCreate')
var list = app.querySelector('.component-list')
var modal = app.querySelector('.modal')
var modalTitle = modal.querySelector('input ')
var modalText = modal.querySelector('textarea')
var modalButtonSave = modal.querySelector('#buttonSave')
var modalButtonDelete = modal.querySelector('#buttonDelete')

modalButtonSave.onclick = onClickModalSave
modalButtonDelete.onclick = onClickModalDelete
buttonCreate.onclick = onClickCreate

var selectedIndex = 0
var notes = [
   {
      title: 'note 1',
      text: 'text for note 1',
   },
   {
      title: 'note 2',
      text: 'text for note 2',
   },
   {
      title: 'note 3',
      text: 'text for note 3',
   }
]

render()

function onClickCreate() {
   console.log('create')
   notes.push({
      title: 'untitled',
      text: 'text notes'
   })

   render()
}

function onClickNote() {
   // show the modal
   modal.classList.add('show')   

   // get the index and set modal inputs
   selectedIndex = Number(this.getAttribute('index'))
   modalTitle.value = notes[selectedIndex].title
   modalText.value = notes[selectedIndex].text
}

function onClickModalSave() {
   modal.classList.remove('show')
   notes[selectedIndex].title = modalTitle.value
   notes[selectedIndex].text = modalText.value
   render()
}

function onClickModalDelete() {
   modal.classList.remove('show')
   notes.splice(selectedIndex, 1)
   render()
}

function render() {
   // clear
   list.innerHTML = ''

   // create
   var i = 0
   for (var note of notes) {
      var html = document.createElement('div')
      html.setAttribute('index', i)
      html.classList.add('item')
      html.innerHTML = `
         <div class="title">${note.title}</div>
      `

      html.onclick = onClickNote
      list.append(html)

      i++
   }
}