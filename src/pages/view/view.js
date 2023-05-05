import * as THREE from "three"
import "./view.css"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import galaxy from '/img/big_galaxy.jpg';

const object = JSON.parse(localStorage.getItem("sceneData"))

let sunSize = object.sunSize

//let planetYearLength = object.yearlength*object.speed
let planetDayLength = object.daylength*object.speed
let cameraOrbitLenght = object.orbitLenght*object.speed


// setting up some basics
const clock = new THREE.Clock();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(5);


const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const textureDay = textureLoader.load(object.planetFile);
const textureNight = textureLoader.load('../img/8k_earth_nightmap.jpg');


// Objects/textures
//    The galaxy/space background
const outside = new THREE.SphereGeometry(object.distanceFromSun*15, 64, 64);
const outsideMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(galaxy),
  side: THREE.DoubleSide,
});
const space = new THREE.Mesh(outside,outsideMat);
scene.add(space)
//earth is special, so adding a bunch to it, need texture, reflection, and then later to swap in the night map

const planetGeometry = new THREE.SphereGeometry(object.planetSize, 64, 64, );
let planetTexture = null;

if (object.isEarth){
  planetTexture = new THREE.MeshPhongMaterial({
    map: textureDay,
    bumpMap: textureLoader.load("../img/2k_earth_normal_map.jpg"),
    bumpScale: 0.5,
    specularMap: textureLoader.load("../img/2k_earth_specular_map.jpg"),
    shininess: 0.5,
  });
}else{
  planetTexture = new THREE.MeshStandardMaterial({
    map: textureLoader.load(object.planetFile)
  });
}


const planet = new THREE.Mesh(planetGeometry, planetTexture);
planet.rotation.z = object.tilt
planet.position.x = object.distanceFromSun;
scene.add(planet);


const sun = new THREE.SphereGeometry(sunSize, 64, 64, );
let sunColor = null
if (object.ourSun){
  sunColor = '#FDB813',
  console.log("its our sun, so here we use #FDB813, in space, the sun is actually white #FFFFFF, ppl wouldn't like if i showed it this way though")
}else{
  sunColor = object.sunColor
}

// take in intensity and use to scale light and emissive somehwat

let brightness = 2
if (object.luminosity < 3e25){
  brightness = 1
}else if (object.luminosity > 3e27){
  brightness = 3
}else if (object.luminosity > 3e28){
  brightness = 5
}else if (object.luminosity > 3e29){
  brightness = 7
}else if (object.luminosity > 3e31){
  brightness = 10
}else if (object.luminosity > 3e33){
  brightness = 15
}

const sunTexture = object.ourSun ? new THREE.MeshStandardMaterial({
  emissiveMap: textureLoader.load("../img/2k_sun.jpg"),
  emissiveIntensity: brightness,
  emissive: 0xFFFFFF,
}) : new THREE.MeshStandardMaterial({
  emissiveMap: textureLoader.load("../img/2k_sun_grey.png"),
  emissiveIntensity: brightness,
  emissive: sunColor,
}); new THREE.MeshBasicMaterial({color: sunColor,}); 


const meshSun = new THREE.Mesh(sun, sunTexture);
scene.add(meshSun);


const light = new THREE.PointLight(object.sunColor, 0.9 + brightness*.4, object.distanceFromSun*2);//todo sun color
scene.add(light);
const backgroundLight = new THREE.PointLight(0xFFFFFF, .15)// not dependent on sun
//const backgroundLight = new THREE.AmbientLight(0xFFFFFF, .15)
scene.add(backgroundLight)


// camera (titan)
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 3*object.distanceFromSun);
camera.position.z = object.cameraOrbit;
camera.position.x = object.distanceFromSun;
scene.add(camera);


const controls = new OrbitControls(camera,renderer.domElement);
const posiotion_center = new THREE.Vector3( object.distanceFromSun, 0, 0 );
controls.target = posiotion_center;
controls.update(clock.getDelta());


function animate(time) {
  requestAnimationFrame(animate);
  planet.rotation.y = time / planetDayLength;
  // i should be able to make the folowing much less expensive
  if (object.isCameraOrbit){
  camera.position.z = planet.position.z+object.cameraOrbit*Math.cos(time/cameraOrbitLenght);
  camera.position.x = planet.position.x+object.cameraOrbit*Math.sin(time/cameraOrbitLenght);
  }


  controls.update(clock.getDelta());
  renderer.render(scene, camera);
};
animate();

// wonder if this is expensive, idk
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
