window.addEventListener("load", event => main());
window.addEventListener("resize", event => resize());

const resize = () => {

	console.log("resize", window.innerWidth, window.innerHeight);

};

const createCube = (color, x, y, z) => {

	// create cube geom and material
	let geometry = new THREE.BoxGeometry();
	let material = new THREE.MeshBasicMaterial( { color: color } );
	let cube = new THREE.Mesh( geometry, material );
	return cube;
};

const createCircle = (color, radius, segments) => {

	// create sphere geom and material
	let geometry = new THREE.CircleGeometry( radius, segments);
	let material = new THREE.MeshBasicMaterial( { color: color } );
	let circle = new THREE.Mesh( geometry, material );
	return circle;
}


const main = () => {

	console.log("hello world");

	// initialisation de la scène
	let scene = new THREE.Scene();

	// init camera
	let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// web gl renderer
	let renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let cube = createCube("#0000FF");
	// add cube to scene
	scene.add( cube );

	let recube = createCube("#00FFFF");
	// add cube to scene
	scene.add( recube );

	let circle = createCircle("#FFFF00", 1, 15);
	// add circle to Scene
	scene.add( circle );

	let recircle = createCircle("#FFAA00", 1, 15);
	// add circle to Scene
	scene.add( recircle );

	camera.position.z = 5;

	// init FIrst Person COntrol camera
	let controls = new THREE.FirstPersonControls( camera );
	controls.lookSpeed = 0.03;
	controls.movementSpeed = 5;

	// init clock
	let clock = new THREE.Clock();

	animate();

	// animate loop
	function animate() {
		// time delta value
		let delta = clock.getDelta();

		controls.update(delta);
		renderer.clear();

		requestAnimationFrame( animate ); // request next frame

		// move cube
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		// move cube
		recube.rotation.x -= 0.01;
		recube.rotation.y -= 0.01;

		// move circle
		circle.rotation.x += 0.01;
		circle.rotation.y += 0.01;

		// move circle
		recircle.rotation.x += 0.01;
		recircle.rotation.y -= 0.01;

		// render !
		renderer.render( scene, camera );
	}

};
