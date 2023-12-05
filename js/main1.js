import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const handUrl = new URL('../Models/Hand/ShortHandDifferentAnimations.glb', import.meta.url);

// const handUrl = new URL("AlexCodeHand.glb", import.meta.url);
// import modelUrl from './AlexCodeHand.glb';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 5, 30);

// const sLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(sLightHelper);

// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const directionalLightBack = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(directionalLightBack);
directionalLightBack.position.set(0, 5, -30);

// const sLightHelperBack = new THREE.DirectionalLightHelper(directionalLightBack);
// scene.add(sLightHelperBack);

renderer.setClearColor(0x02063d);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 2, 15);
orbit.update();

// const grid = new THREE.GridHelper(30, 30);
// scene.add(grid);

const assetLoader = new GLTFLoader();

let mixer;
let action;
let clipSet;
let currentIndex = 0;
assetLoader.load(handUrl.href, function(gltf) {
    
    const model = gltf.scene;
    scene.add(model);

    console.log("i loaded", gltf);

    // Play animation
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    

    //Listen for Spacebar
    document.addEventListener('keydown', (e) => {

    // Check if spacebar pressed 
    if(e.code === 'Space') { 

        if (action) {
            action.stop();
        }

    // Play a certain animation
    const clip = THREE.AnimationClip.findByName(clips, 'Mudras');
    action = mixer.clipAction(clip);
    action.reset();
    action.play();

  
    }
  
  });

  clipSet = [];
  clipSet[0] = THREE.AnimationClip.findByName(clips, 'Patakam'); 
  clipSet[1] = THREE.AnimationClip.findByName(clips, 'Tripatakam');
  clipSet[2] = THREE.AnimationClip.findByName(clips, 'Ardhapatakam');
  clipSet[3] = THREE.AnimationClip.findByName(clips, 'Aralam');
  clipSet[4] = THREE.AnimationClip.findByName(clips, 'Shukhathundam');

  console.log(clipSet);

  //Listen for Left and Right Arrows
  document.addEventListener('keydown', (e) => {


    if (e.code === "ArrowRight") {
        playNextClip();
      } 
    else if(e.code === "ArrowLeft") { 
        playPrevClip();
    }
    

    function playNextClip() {
        currentIndex++;
        if(currentIndex >= Object.keys(clipSet).length) {
          currentIndex = 0; 
        }
        
        const nextClip = clipSet[Object.keys(clipSet)[currentIndex]];  
        playClip(nextClip);
      
      }
      
      function playPrevClip() {
        currentIndex--;
        if(currentIndex < 0) {
          currentIndex = Object.keys(clipSet).length - 1;
        }
      
        const prevClip = clipSet[Object.keys(clipSet)[currentIndex]];
        playClip(prevClip);
      
      }
      
      function playClip(clip) {

        if (action) {
            action.stop();
        }
      
        action = mixer.clipAction(clip);
        action.reset();  
        action.play();
      
      }
  
  });
    // Play all animations at the same time
    // clips.forEach(function(clip) {
    //     const action = mixer.clipAction(clip);
    //     action.play();
    // });

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock();
function animate() {
    if(mixer){
        console.log(clock);
        mixer.update(clock.getDelta());
    }
        
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
