import * as THREE from "three";
//import { EffectComposer } from "postprocessing";
//import { OrbitControls, DragControls } from "controls";

MOVE_SPEED = 0.01;
ROTATION_SPEED = 0.1;

//Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Create the scene
const scene = new THREE.Scene();

//Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//Cube parameters
//***********************
//Create the cube
const cube_x = 20;
const cube_y = 20;
const cube_z = 20;
const cube_geometry = new THREE.BoxGeometry(cube_x, cube_y, cube_z);
//Create the material
const cube_material = new THREE.MeshPhongMaterial({
  color: 0xfd59d7,
  shininess: 150,
});
//Create the cube
const cube = new THREE.Mesh(cube_geometry, cube_material);
//Add the cube to the scene
scene.add(cube);

var light1 = new THREE.PointLight(0x00ff00, 100, 20);
/* position the light so it shines on the cube (x, y, z) */
light1.position.set(0, 0, 15);
scene.add(light1);

//Add the axes helper
const axesHelper = new THREE.AxesHelper(5);

//Add axes helper
//scene.add(axesHelper);

//Set the camera's x and y position
let camera_x = 0;
let camera_y = 0;
let camera_z = 30;

//Set camera rotation parameters
let camera_rotate_x = 0;
let camera_rotate_y = 0;
let camera_rotate_z = 0;

//Set variables that control camera movement
let camera_move = false;
let camera_rotate = false;

//Get movement x and y
let previous_x = 0;
let previous_y = 0;

//Adjust mouse speed based on zoom rate
let adjusted_move_speed = 1;
let adjusted_rotate_speed = 1;

//Add event listener for mouse wheel
addEventListener("wheel", (event) => {});
//Add event listener for mouse button
addEventListener("mousedown", (event) => {});
addEventListener("mouseup", (event) => {});

//Mouse movement
addEventListener("mousemove", (event) => {});

//Zoom control with mouse wheel
onwheel = (event) => {
  console.log(`Camera Position: ${camera_z}`);
  if (event.deltaY > 0) {
    if (camera_z < 500) {
      camera_z += 1;
    }
  } else {
    if (camera_z > 20) {
      camera_z -= 1;
    }
  }
};

//Rotation control middle mouse button
onmousedown = (event) => {
  switch (event.button) {
    case 0:
      console.log("Left mouse button pressed");
      camera_move = true;
      break;
    case 1:
      console.log("Middle button pressed");
      camera_rotate = true;
      break;
    default:
      console.log(`No control set for mouse button ${event.button}`);
  }
};

//Mouse up
onmouseup = (event) => {
  switch (event.button) {
    case 0:
      console.log("Left mouse up");
      camera_move = false;
      break;
    case 1:
      console.log("Middle mouse up");
      camera_rotate = false;
      break;
    default:
      console.log(`No control set for mouse button ${event.button}`);
  }
};

onmousemove = (event) => {
  //Handle camera movement
  if (camera_move) {
    //Speed up the movement speed when camera is further away
    adjusted_move_speed = (50 / (51 - camera_z)) * MOVE_SPEED;
    if (event.clientX > previous_x) {
      camera_x -= 1 * adjusted_move_speed;
    } else if (event.clientX < previous_x) {
      camera_x += 1 * adjusted_move_speed;
    }
    if (event.clientY > previous_y) {
      camera_y += 1 * adjusted_move_speed;
    } else if (event.clientY < previous_y) {
      camera_y -= 1 * adjusted_move_speed;
    }
  }

  //Handle camera rotation
  if (camera_rotate) {
    if (event.clientX > previous_x) {
      camera_rotate_x -= 1 * ROTATION_SPEED;
    } else if (event.clientX < previous_x) {
      camera_rotate_x += 1 * ROTATION_SPEED;
    }
    if (event.clientY > previous_y) {
      camera_rotate_y += 1 * ROTATION_SPEED;
    } else if (event.clientY < previous_y) {
      camera_rotate_y -= 1 * ROTATION_SPEED;
    }
  }

  if (camera_move || camera_rotate) {
    previous_x = event.clientX;
    previous_y = event.clientY;
  }
};

//A function to animate the cube
function animate() {
  requestAnimationFrame(animate);
  camera.position.x = camera_x;
  camera.position.y = camera_y;
  camera.position.z = camera_z;
  //camera.rotation.x = camera_rotate_x;
  //camera.rotation.y = camera_rotate_z;
  //camera.rotation.z = camera_rotate_y;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  //cube.rotation.z += 0.02;

  renderer.render(scene, camera);
}

//Animate the scene
animate();
