console.log('hello!')



class GamepadHelper {
   constructor() {
      window.addEventListener("gamepadconnected", e => this.onGamepadConnect(e))
      window.addEventListener("gamepaddisconnected", e => this.onGamepadDisconnect(e))

      console.log(navigator.getGamepads())
      this.gamepad = null

      this.map = {
         x: 1,
         square: 0,
         triangle: 3,
         circle: 2,
      }

      this.buttons = {
         x: new GamepadButton(),
         square: new GamepadButton(),
         triangle: new GamepadButton(),
         circle: new GamepadButton(),
      }
   }

   updateMap() {
      // for (var buttonName in this)
   }

   update() {
      if (!this.gamepad) return

      // find button id
      // for (var buttonId in this.gamepad.buttons) {
      //    var buttonState = this.gamepad.buttons[buttonId]
      //    if (buttonState.pressed == true) {
      //       console.log('hello', buttonId)
      //    }
      // }

      this.gamepad = navigator.getGamepads()[0]
      // update map
      for (var buttonName in this.buttons) {
         var buttonMap = this.map[buttonName]
         var buttonState = this.gamepad.buttons[buttonMap]
         this.buttons[buttonName].update(buttonState)
      }
   }

   updateMap() {
   }

   onGamepadConnect(e) {
      console.log('connect', e)

      this.gamepad = e.gamepad

   }

   onGamepadDisconnect() {
      this.gamepad = null
   }
}

class GamepadButton {
   constructor() {
      this.gamepadButton = null
      // state
      this.up = false
      this.down = false
      this.held = false
   }

   setButton(gamepadButtonObject) {
      this.gamepadButton = gamepadButtonObject
   }
   update(state) {
      // console.log(state)

      this.up = false
      this.down = false
      // this.held = false

      console.log('updating', state)
      var pressed = state.pressed


      if (!this.held && pressed) {
         this.down = true
      }

      this.held = pressed

      if (this.held && !pressed) {
         this.up = true
      }
   }
}

var gph = new GamepadHelper()

// setInterval(() => {
//    gph.update()

//    // update ui
//    updateHtml()
// }, 1)
update()

function update() {
   gph.update()
   updateHtml()
   window.requestAnimationFrame(update)
   // setTimeout(update, 1000/30)
}


function updateHtml() {
   console.log('update')
   var table = document.querySelector('table')

   for (var buttonName in gph.buttons) {
      var row = table.querySelector('#row-' + buttonName)

      if (!row) {
         row = document.createElement('tr')
         row.innerHTML = `<td>${buttonName}</td><td>false</td><td>0</td>`
         row.id = 'row-' + buttonName
         table.appendChild(row)
      }

      var held = row.children[1]
      var pressed = row.children[2]

      var state = gph.buttons[buttonName]
      if (state.down) {
         pressed.innerHTML = Number(pressed.innerHTML) + 1
      }
      held.innerHTML = !!state.held

   }
}

