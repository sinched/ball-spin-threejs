import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

//Scene
const scene = new THREE.Scene();

//Create Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
	color: '#00ff83',
	roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//Size of Viewport
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10); //x, y and z position
light.intensity = 1.25;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
	50,
	sizes.width / sizes.height,
	0.001,
	1000
);
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; //makes it not stop when grabbing
controls.enablePan = false; //disables panning with right click
controls.enableZoom = false; //disables zoom with scrolling wheel
controls.autoRotate = true; //automatically rotates an object
controls.autoRotateSpeed = 3; //speed of the rotation (default is 1)

//Resize
window.addEventListener('resize', () => {
	//Update Sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
	controls.update(); //delays when the object stops when grabbed
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
};

loop();

// Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1.8 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

//mouse animation color
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
	if (mouseDown) {
		rgb = [
			Math.round((e.pageX / sizes.width) * 255),
			Math.round((e.pageY / sizes.height) * 255),
			150,
		];
		//Lets animate
		let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
		gsap.to(mesh.material.color, {
			r: newColor.r,
			g: newColor.g,
			b: newColor.b,
		});
	}
});
