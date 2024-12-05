import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

// config
var cw = 15
var space = cw/10
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
camera.position.z = -5
camera.position.x = -15
camera.position.y = 20
camera.lookAt(0, 0, 0)


// light
var ambientLight = new THREE.AmbientLight('#FFF', 0.75)
scene.add(ambientLight)

var pointLight = new THREE.PointLight(0xffffff, 10, 100000, 0.5)
pointLight.position.set(2, 15, 2)
pointLight.castShadow = true
scene.add(pointLight)


// shapes
var geometry = new THREE.BoxGeometry(cw, 1, cw)
var material = new THREE.MeshPhongMaterial({ color: '#333335' })
material.shininess = 0
material.flatShading = true
var floor = new THREE.Mesh(geometry, material)
floor.position.x += offset
floor.position.z += offset
floor.position.y -= space/2 + 0.5
floor.receiveShadow = true
scene.add(floor)


// controls
var controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window ); 
controls.maxPolarAngle = Math.PI / 2;
controls.target = floor.position
controls.update()

// lines
// var points = [
//    -8, 3, -8,
//    8, 3, 8,
//    8, 3, -8,
// ]
// var geo = new LineGeometry();
// geo.setPositions( points );
// var mat = new LineMaterial({ color: '#FF6961', linewidth: 0.1, worldUnits: true })
// var line = new Line2(geo, mat)
// scene.add(line)



function step() {
   renderer.render(scene, camera)

   // cube.rotation.x += 0.01
   // cube.rotation.y += 0.01
   for (var object of objects) {
      object.draw()
   }
   // renderer.setAnimationLoop(null)
}

// step()

renderer.setAnimationLoop(step)


// render map
var objects = []
var map = `
----------
----------
----x-----
-s--x-----
----x-----
----x--e--
----x-----
----------
----------
----------
`.trim().split('\n').map(r => r.split(''))

var startObject, endObject

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

var sceneLine

function ObjectStart(x, y) {
   startObject = this
   this.shape = createObjectShape(x, y, '#9455f4')
   this.x = x
   this.y = y

   this.draw = function() {
      // console.log('test')
      // draw path to end
      var path = findPath(
         { x: this.x, y: this.y},
         { x: endObject.x, y:endObject.y}
      )
      
      var points = []
      var from = path
      do {
         points.push(from.y, 0, from.x)
         from = from.from 
      } while(from)

      var geo = new LineGeometry();
      geo.setPositions( points );
      if (!sceneLine) {
         var mat = new LineMaterial({ color: '#FF6961', linewidth: 0.1, worldUnits: true })
         sceneLine = new Line2(geo, mat)
         scene.add(sceneLine)
      }
   }
}

function ObjectEnd(x, y) {
   endObject = this
   this.shape = createObjectShape(x, y, '#50C878')
   this.x = x
   this.y = y

   this.draw = function() {
      
   }
}

function ObjectBlock(x, y) {
   this.shape = createObjectShape(x, y, '#DDDDD5')
   this.x = x
   this.y = y

   this.draw = function() {
      
   }
}

function createObjectShape(x, y, color) {
   var geometry = new THREE.BoxGeometry(space, space, space)
   var material = new THREE.MeshPhongMaterial({ color })
   material.flatShading = true
   material.shininess = 0
   var cube = new THREE.Mesh(geometry, material)
   cube.castShadow = true
   cube.position.z = x// - offset
   cube.position.x = y// - offset
   scene.add(cube)

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

   var last = checks[checks.length-1].find(c => c.type == 'e')
   return last
}

