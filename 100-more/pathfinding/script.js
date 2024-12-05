import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

// config
var cw = 15
var spaces = 10
var space = cw/spaces
var offset = cw/2 - space/2

// setup
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.BasicShadowMap
document.body.appendChild(renderer.domElement)

// camera
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = -8
camera.position.x = -8

// camera.position.z += offset
// camera.position.x += offse20
camera.position.y = 20
camera.lookAt(offset, 0, offset)


// light
var ambientLight = new THREE.AmbientLight('#FFF', 0.75)
scene.add(ambientLight)

var pointLight = new THREE.PointLight(0xffffff, 10, 100000, 0.5)
pointLight.position.set(2, 15, 2)
pointLight.castShadow = true
scene.add(pointLight)


// floor
var geometry = new THREE.BoxGeometry(cw, 1, cw)
var material = new THREE.MeshPhongMaterial({ color: '#333335' })
material.shininess = 0
material.flatShading = true
var floor = new THREE.Mesh(geometry, material)
floor.position.x += offset
floor.position.z += offset
floor.position.y -= space/2 + 0.5
floor.receiveShadow = true
floor.isFloor = true
scene.add(floor)

// floor cursor
var cursorObj = new THREE.Object3D()
var points = [
   0, -space/2+0.1, 0,
   space, -space/2+0.1, 0,
   space, -space/2+0.1, space,
   0, -space/2+0.1, space,
   0, -space/2+0.1, 0,
]
var geo = new LineGeometry();
geo.setPositions( points );
var mat = new LineMaterial({ color: '#CCC', linewidth: 0.1, worldUnits: true })
var line = new Line2(geo, mat)
line.computeLineDistances()
cursorObj.add(line)
line.position.x -= space/2
line.position.z -= space/2
scene.add(cursorObj)



// controls
var controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window ); 
controls.maxPolarAngle = Math.PI / 2;
controls.target = floor.position
controls.update()
controls.rotateSpeed = 0.5

// mouse
var raycaster = new THREE.Raycaster()
var pointer = new THREE.Vector2(-1, -1)
var holding = false
var hoverX = -1
var hoverY = -1
window.addEventListener('pointermove', function() {
   pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
   pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
})

window.addEventListener('mousedown', function() {
   if (hoverX >= 0 && hoverY >=0) {
      console.log('click area', hoverX, hoverY)
      var current = map[hoverX][hoverY]

      if (current == 'x' || current == '-') {
         map[hoverX][hoverY] = current == 'x' ? '-' : 'x'
      }
      if (current == 's' || current == 'e') {
         holding = holding ? false : {
            old: { x: hoverX, y: hoverY },
            type: current
         }
      }
      loadMap()
   }
})
// lines
// var points = [
//    -8, 3, -8,
//    8, 3, 8,
//    8, 3, -8,
// ]
// var geo = new LineGeometry();
// geo.setPositions( points );
// var mat = new LineMaterial({ color: '#FF6961', linewidth: 0.1, worldUnits: true, dashed: true })
// var line = new Line2(geo, mat)
// line.computeLineDistances()
// scene.add(line)




// step
function step() {
   raycaster.setFromCamera(pointer, camera)
   var intersects = raycaster.intersectObjects(scene.children)
   var top = intersects[0]
   var floor = intersects.find(o => o.object.isFloor)
   hoverX = -1
   hoverY = -1
   scene.remove(cursorObj)
   if (floor && floor.normal.y == 1) {
      scene.add(cursorObj)

      var xLock = Math.floor(floor.uv.x*spaces)
      var yLock = spaces - Math.ceil(floor.uv.y*spaces)

      cursorObj.position.x = xLock * space
      cursorObj.position.z = yLock * space
      
      hoverX = xLock
      hoverY = yLock

      if (holding) {
         var over = map[hoverX][hoverY]
         if (over !== 'x') {
            map[holding.old.x][holding.old.y] = '-'
            map[hoverX][hoverY] = holding.type
            holding.old.x = hoverX
            holding.old.y = hoverY
            loadMap()
         }
      }
   }


   for (var object of objects) {
      object.draw()
   }

   renderer.render(scene, camera)

}

renderer.setAnimationLoop(step)


// render map
var objects = []
var map = `
----------
----x-----
----x-----
-s--x-----
----x-----
----x--e--
----x-----
----x-----
---xx-----
----------
`.trim().split('\n').map(r => r.split(''))

var startObject, endObject

function loadMap() {
   for (var object of objects) {
      scene.remove(object.shape)
   }
   objects = []
   // load objects
   for (var rowI in map) {
      for (var colI in map[rowI]) {
         var object = {
            's': ObjectStart,
            'x': ObjectBlock,
            'e': ObjectEnd,
         }[map[rowI][colI]]

         object && objects.push(new object(colI*space, rowI*space))
      }
   }
}
loadMap()
var sceneLine
var sceneLineOffset = 0

function ObjectStart(x, y) {
   startObject = this
   this.type = 's'
   this.shape = createObjectShape(this, x, y, '#9455f4')

   this.x = x
   this.y = y

   this.draw = function() {
      // draw path to end
      if (sceneLine) scene.remove(sceneLine)
      var path = findPath(
         { x: this.x, y: this.y},
         { x: endObject.x, y:endObject.y}
      )
      
      if (!path) {
         return
      }
      var points = []
      var from = path
      var last
      do {
         last = from
         points.push(from.y, 0, from.x)
         from = from.from 
      } while(from)
      sceneLineOffset += 0.025
      
      // very suboptimal 
      var geo = new LineGeometry();
      geo.setPositions( points );
      var mat = new LineMaterial({ 
         color: '#FF6961', 
         linewidth: 0.1, 
         worldUnits: true, 
         gapSize:0.25, 
         dashOffset: sceneLineOffset, 
         dashSize: 0.5, 
         dashed: true 
      })
      sceneLine = new Line2(geo, mat)
      sceneLine.computeLineDistances()
      scene.add(sceneLine)
   }
}

function ObjectEnd(x, y) {
   endObject = this
   this.type = 'e'
   this.shape = createObjectShape(this, x, y, '#50C878')
   this.x = x
   this.y = y

   this.draw = function() {
      
   }
}

function ObjectBlock(x, y) {
   this.type = 'x'
   this.shape = createObjectShape(this, x, y, '#DDDDD5')
   this.x = x
   this.y = y

   this.draw = function() {
      
   }
}

function createObjectShape(object, x, y, color) {
   var geometry = new THREE.BoxGeometry(space, space, space)
   var material = new THREE.MeshPhongMaterial({ color })
   material.flatShading = true
   material.shininess = 0
   var cube = new THREE.Mesh(geometry, material)
   cube.castShadow = true
   cube.position.z = x// - offset
   cube.position.x = y// - offset
   scene.add(cube)
   cube.gameObject = object
   return cube
}

function findPath(start, end) {
   // 1. make a grid
   var rows = cw/space
   var cols = cw/space

   var grid = []

   for (var y = 0; y < rows; y++) {
      grid[y] = []
      for (var x = 0; x < cols; x++) {
         grid[y][x] = {
            x: x*space,
            y: y*space,
            tx: x,
            ty: y,
            type: map[y][x]
         }
      }
   }

   // 2. start checking from self
   var checked = {}
   var checks = [[
      {
         x: start.x,
         y: start.y,
         tx: start.x/space,
         ty: start.y/space,
         type: 's',
      }
   ]]

   function check(loop) {
      // console.log(x, y)

      // up/down/left/right
      var group = []
      var stop = false
      var dirs = [
         { x: 0, y: -1 },
         { x: 0, y: 1 },
         { x: 1, y: 0 },
         { x: -1, y: 0 },
      ]

      for (var c of loop) {
         var {tx, ty} = c
         for (var dir of dirs) {
            var cx = c.tx+dir.x
            var cy = c.ty+dir.y
            var id = cx+'-'+cy
            if (checked[id]) continue  
            var c2 = grid[cy]?.[cx]

            if (c2?.type) { // off grid
               checked[id] = true
               if (c2.type == 'x') continue
               group.push({...c2, from: c})
               if (c2.type == 'e') stop = true
            }
         }
         if (stop) break
      }

      checks.push(group)

      if (!stop && group.length) check(group) 
   }


   check(checks[0])

   // console.log(checks)
   var last = checks[checks.length-1].find(c => c.type == 'e')
   return last
}

