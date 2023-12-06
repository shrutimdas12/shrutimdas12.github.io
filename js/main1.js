import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const handUrl = new URL('../Models/Hand/ShortHandDifferentAnimations.glb', import.meta.url);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x02063d);

//Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//Front Directional Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 5, 30);

//Back Directional Light
const directionalLightBack = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLightBack);
directionalLightBack.position.set(0, 5, -30);

//Camera and Orbit control
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 15);
orbit.update();

//Asset Loader
let mixer;
let action;
const assetLoader = new GLTFLoader();
assetLoader.load(handUrl.href, function (gltf) {

  const model = gltf.scene;
  scene.add(model);

  //Play animation
  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;

  //Listen for Button
  const playBtn = document.getElementById('play-btn');

  playBtn.addEventListener('click', () => {
    // Play animation
    const clip = THREE.AnimationClip.findByName(clips, 'Mudras');
    action = mixer.clipAction(clip);
    action.reset();
    action.play();
  });

}, undefined, function (error) {
  console.error(error);
});

//Clock
const clock = new THREE.Clock();
function animate() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

//Resize function
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

async function mainEvent() {
  try {
    const response = await fetch("https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json");
    const data = await response.json();
    console.table(data);  
  } catch (error) {
    console.log(error); 
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await mainEvent();
});
