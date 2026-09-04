import * as THREE from  'three';
import { PointerLockControls } from '../build/jsm/controls/PointerLockControls.js';
import {initRenderer, 
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

        // Initial variables
let scene = new THREE.Scene();    // Create main scene
let renderer = initRenderer();    // Init a basic renderer
let material = setDefaultMaterial(); // create a basic material
let light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene


// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let tampoGeometria = new THREE.BoxGeometry(2, 2, 2);
let tampomaterial = setDefaultMaterial('yellow')
let tampo = new THREE.Mesh(tampoGeometria, tampomaterial);
tampo.position.set(0.0, 1, 0.0);
// add the cube to the scene
scene.add(tampo);


const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-5, 2, -5);
camera.lookAt(new THREE.Vector3(0, 2, 0));
scene.add(camera);

const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0).normalize(), 0, 2);
const controls = new PointerLockControls(camera, renderer.domElement);

const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', function () {

    controls.lock();

}, false);

controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
});

controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
});

const speed = 20;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;


window.addEventListener('keydown', (event) => movementControls(event.keyCode, true));
window.addEventListener('keyup', (event) => movementControls(event.keyCode, false));

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );


const clock = new THREE.Timer();
render();


function movementControls(key, value) {
    switch (key) {
        case 38:
        case 87: // W
            moveForward = value;
            break;
        
        case 40:
        case 83: // S
            moveBackward = value;
            break;

        case 37:
        case 65: // A
            moveLeft = value;
            break;
        
        case 39:
        case 68: // D
            moveRight = value;
            break;
        case 32: //space
            moveUp = value;
            break;
        case 16: // shift
            moveDown = value;
            break;
    }
}

function moveAnimate(delta) {
    raycaster.ray.origin.copy(controls.object.position);
    const isIntersectingGround = raycaster.intersectObjects([plane]).length > 0;

    if (moveForward) {
        controls.moveForward(speed * delta);
    }
    else if (moveBackward) {
        controls.moveForward(speed * -1 * delta);
    }

    if (moveRight) {
        controls.moveRight(speed * delta);
    }
    else if (moveLeft) {
        controls.moveRight(speed * -1 * delta);
    }

    if (moveUp && camera.position.y <= 100) {
        camera.position.y += speed * delta;
    }
    else if (moveDown && !isIntersectingGround) {
        camera.position.y -= speed * delta;
    }
}


function render(){

        clock.update();
        if(controls.isLocked){
                moveAnimate(clock.getDelta())
        }
    renderer.render(scene, camera);
    requestAnimationFrame(render);

}