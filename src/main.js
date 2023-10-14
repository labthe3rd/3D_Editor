import * as THREE from "three";
//import { EffectComposer } from "postprocessing";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

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

camera.position.z = 30;
camera.position.y = 15;

//Cube parameters
//***********************
//Create the cube
const cube_x = 3;
const cube_y = 3;
const cube_z = 3;
const cube_geometry = new THREE.BoxGeometry(cube_x, cube_y, cube_z);
//Create the material
const cube_material = new THREE.MeshPhongMaterial({
  color: 0xfd59d7,
  shininess: 300,
});
//Create the cube
const cube = new THREE.Mesh(cube_geometry, cube_material);
cube.position.x = -2;
cube.position.y = 2;
cube.name = "Cube";
//Add the cube to the scene
scene.add(cube);

//Add a red sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 150,
  })
);
sphere.position.set(4, 2, 0);
sphere.name = "Sphere";
scene.add(sphere);
sphere.add(new THREE.AxesHelper(5));

//Add a plane to be the ground
const planeGeometry = new THREE.PlaneGeometry(25, 25);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  shininess: 150,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
planeMesh.name = "Plane";
scene.add(planeMesh);

//***********LIGHTS************************* */
var pointLight1 = new THREE.PointLight(0xffffff, 100, 20);
/* position the light so it shines on the cube (x, y, z) */
pointLight1.position.set(0, 11.5, 0);
pointLight1.color.set(0xffffff);
scene.add(pointLight1);

//Add the orbital controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Add transform controls
const transformControls = new TransformControls(camera, renderer.domElement);
// transformControls.attach(cube);
// transformControls.setMode("rotate");

transformControls.addEventListener("dragging-changed", function (event) {
  orbitControls.enabled = !event.value;
  //dragControls.enabled = !event.value
});

const gui = new GUI();
const pointLight1Folder = gui.addFolder("Point Light 1");
pointLight1Folder.addColor(pointLight1, "color");
pointLight1Folder.add(pointLight1, "intensity", 0, 10);
pointLight1Folder.add(pointLight1.position, "x", -100, 100);
pointLight1Folder.add(pointLight1.position, "y", -100, 100);
pointLight1Folder.add(pointLight1.position, "z", -100, 100);
const cubeFolder = gui.addFolder("Cube");
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2);
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2);
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2);
cubeFolder.open();
const sphereFolder = gui.addFolder("Sphere");
sphereFolder.add(sphere.rotation, "x", 0, Math.PI * 2);
sphereFolder.add(sphere.rotation, "y", 0, Math.PI * 2);
sphereFolder.add(sphere.rotation, "z", 0, Math.PI * 2);
sphereFolder.open();

//Select different transform controls based on key press
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "g":
      transformControls.setMode("translate");
      break;
    case "r":
      transformControls.setMode("rotate");
      break;
    case "s":
      transformControls.setMode("scale");
      break;
  }
});

//Windows resize event listener
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

//Select object for transformcontrol
//Create the raycaster
const raycaster = new THREE.Raycaster();
let intersects;

//Add pickable objects from the scene
const originalMaterials = {};
let pickableObjects = [];

scene.traverse(function (child) {
  let output;
  if (child.isMesh) {
    const m = child;
    console.log(child);
    switch (m.name) {
      case "Plane":
        m.receiveShadow = true;
        break;
      default:
        m.castShadow = true;
        pickableObjects.push(m);
        originalMaterials[m.name] = m.material;
    }
  }
});

let intersectedObject = null;

//Highlight the object when the mouse is over it
const highlightedMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});
const mouse = new THREE.Vector2();
function onDocumentMouseMove(event) {
  mouse.set(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(pickableObjects, false);

  if (intersects.length > 0) {
    intersectedObject = intersects[0].object;
    console.log(intersects[0].name);
  } else {
    intersectedObject = null;
  }
  pickableObjects.forEach((o, i) => {
    if (intersectedObject && intersectedObject.name === o.name) {
      pickableObjects[i].material = highlightedMaterial;
    } else {
      pickableObjects[i].material = originalMaterials[o.name];
    }
  });
}

//When left select is pressed pick the object on the screen to have transform control
let selectedObject;
function onDocumentMouseDown(event) {
  const mouseBtn = event.buttons;
  if (mouseBtn == 1) {
    if (intersectedObject && intersectedObject.name !== "Plane") {
      if (selectedObject && selectedObject.name !== intersectedObject.name) {
        transformControls.attach(intersectedObject);
        scene.add(transformControls);
        selectedObject = intersectedObject;
      } else if (!selectedObject) {
        transformControls.attach(intersectedObject);
        scene.add(transformControls);
        selectedObject = intersectedObject;
      }
    }
  }
}

document.addEventListener("mousemove", onDocumentMouseMove, false);
document.addEventListener("mousedown", onDocumentMouseDown, false);

//Add the stats
const stats = new Stats();
document.body.appendChild(stats.dom);

//A function to animate the cube
function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  render();

  //Update stats
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

//Animate the scene
animate();
