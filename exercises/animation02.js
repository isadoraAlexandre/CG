import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera, 
        onWindowResize,
        setDefaultMaterial,
        initDefaultSpotlight,
        initDefaultBasicLight,
        createGroundPlaneXZ} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var light = initDefaultBasicLight(scene);
var camera = initCamera(new THREE.Vector3(5, 5, 7)); // Init camera in this position
var trackballControls = new TrackballControls( camera, renderer.domElement );
initDefaultSpotlight(scene, new THREE.Vector3(2, 4, 2)); // Use default light

// Set angles of rotation
var speed1 = 0.05;
var speed2 = 0.05
var animationOn = false; // control if animation is on or of

// Show world axes
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// Base sphere
var sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
var sphereMaterial = new THREE.MeshPhongMaterial(
    {color:'rgb(180,180,255)', shininess:"40", specular:'rgb(255,255,255'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
//scene.add(sphere);
// Set initial position of the sphere
//sphere.translateX(1.0).translateY(1.0).translateZ(1.0);


let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

//let sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
//let sphereMaterial = setDefaultMaterial('yellow' );

let sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere1.position.set(0.0, 0.1, 3.0)
scene.add( sphere1 )

let sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere2.position.set(2.0, 0.1, 3.0)
scene.add( sphere2 )

const lerpConfig1 = {
  destination: new THREE.Vector3(0.0, 0.1, 0.0),
  alpha: 0.01,
  move: false
}

const lerpConfig2 = {
  destination: new THREE.Vector3(2.0, 0.1, 0.0),
  alpha: 0.05,
  move: false
}

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

buildInterface();
render();


function buildInterface()
{
  var controls = new function ()
  {
    this.onChangeAnimation = function(){
      animationOn = !animationOn;
    };
    this.speed1 = 0.05;
    this.speed2 = 0.05

    this.changeSpeed1 = function(){
      speed1 = this.speed1
    };

    this.changeSpeed2 = function(){
      speed2 = this.speed2
    };

    this.reset = function(){
      sphere1.position.set(0.0,0.1,3.0)
      sphere2.position.set(2.0,0.1,3.0)
      animationOn = false

    }
  };


  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
  gui.add(controls, 'changeSpeed1', 0.05, 0.5)
    .onChange(function(e) { controls.changeSpeed1() })
    .name("Change Speed s1");
  gui.add(controls, 'changeSpeed2', 0.05, 0.5)
    .onChange(function(e) { controls.changeSpeed2() })
    .name("Change Speed s2");
  gui.add(controls, 'reset')
  .name("Reset")
}

function render()
{
  if(animationOn){
   sphere2.position.lerp(lerpConfig2.destination, lerpConfig2.alpha)
  sphere1.position.lerp(lerpConfig1.destination, lerpConfig1.alpha)
  }
 
  stats.update(); // Update FPS
  trackballControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}
