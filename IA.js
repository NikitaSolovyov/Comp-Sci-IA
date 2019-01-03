var width = window.innerWidth, height = window.innerHeight, delta;
var viewangle = 60, aspect = width/height, nearclipping = 0.1, farclipping = 3000;

var rSpeed = 5;
var scene, camera, light, renderer, earth;
var platform = document.getElementById("platform");
var earthSphere, earthMat, eMesh;

var moonSphere, moonMat, mMesh;
var AXIS = new THREE.Vector3( 0.235, 1, 0 ).normalize();
var camerax = 220, cameray = 100, cameraz = -80;
var controls, pivot, curve;

var starGeo, starMat, starMesh;

init();

function init() {
	renderer = new THREE.WebGLRenderer({ 
		antialiasing: true,
	});
	renderer.setSize(width, height);
	renderer.domElement.style.position = 'relative';
	document.body.appendChild(renderer.domElement);
	renderer.autoClear = false;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(viewangle, aspect, nearclipping, farclipping);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	camera.position.set(camerax,cameray,cameraz);
	controls.update();

	//scene.add(new THREE.AxesHelper(500));

	window.addEventListener('resize', function(){
		var width2 = window.innerWidth, height2 = window.innerHeight;
		renderer.setSize(width2, height2);
		camera.aspect = width2/height2;
		camera.updateProjectionMatrix();
	});

	light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
	scene.add( light );
	//scene.background = new THREE.Color(0x99ff99);
	/*light = new THREE.SpotLight(0xFFFFFF, 1 ,0, Math.PI/2, 1);
	light.position.set(4000, 4000, 1500);
	light.target.position.set(1000, 3800, 1000);
	scene.add(light);*/

	earthSphere = new THREE.SphereGeometry(30, 40, 400);
	earthMat = new THREE.MeshPhongMaterial();
	earthMat.map = new THREE.TextureLoader().load('earthmap1k.jpg');

	pivot = new THREE.Object3D();
	scene.add(pivot);

	eMesh = new THREE.Mesh(earthSphere, earthMat);
	eMesh.position.set(0, 0, 0);
	eMesh.rotation.y=5;
	scene.add(eMesh);
	controls.update();

	eMesh.castShadow = true;
	eMesh.recieveShadow = true;

	moonSphere = new THREE.SphereGeometry(8, 10, 100);
	moonMat = new THREE.MeshPhongMaterial();
	moonMat.map = new THREE.TextureLoader().load('moonmap.jpg');
	mMesh = new THREE.Mesh(moonSphere, moonMat);
	mMesh.position.set(-140, 0, -80);
	pivot.add(mMesh);

	camera.lookAt(eMesh.position);

	starGeo = new THREE.SphereGeometry (3000, 10, 100);
    starMat = new THREE.MeshBasicMaterial();
    starMat.map = new THREE.TextureLoader().load('star-field.png');
    starMat.side = THREE.BackSide;
                
    starMesh = new THREE.Mesh(starGeo, starMat);
                
    scene.add(starMesh);

	renderer.autoClear = false;
	renderer.shadowMap.enabled = true;
}
//moon orbital period = 27 days
function animate() {
	requestAnimationFrame(animate);
	render();
}
function render(){
	pivot.rotation.y += 0.0008;
	eMesh.rotateOnAxis(AXIS, 0.009);

	controls.update();
	renderer.clear();
	renderer.render(scene, camera);
}
animate();