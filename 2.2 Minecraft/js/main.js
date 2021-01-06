let camera, scene, renderer, controls;

let chooseColor = false;
let closeColorField;
let colorField;
let blockColor = "black";

let action = 0;

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let vertex = new THREE.Vector3();
const color = new THREE.Color();

init();
animate();

const raycasterMouse = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove (event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}

function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    controls = new THREE.PointerLockControls( camera, document.body );

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    closeColorField = document.getElementById("closeColorField");
    colorField = document.getElementById("colorFieldUI");
    closeColorField.style.display = "none";
    document.getElementById("colorFieldUI").style.visibility = "hidden";

    instructions.addEventListener( 'click', function () {
        controls.lock();
    }, false );

    document.addEventListener('click', function() {
        if(controls.isLocked){
            const raycasterMouse = new THREE.Raycaster();
            raycasterMouse.ray.origin.copy(camera.getWorldPosition(new THREE.Vector3()))
            var dir = camera.getWorldDirection(new THREE.Vector3());
            raycasterMouse.ray.direction.copy(dir);
            const intersects = raycasterMouse.intersectObjects(scene.children);
            
            if(intersects.length > 0 && intersects[0].object.typeObject == "block"){
                var elm = intersects[0];
                if (action == 0) {
                    addBlock(elm.object.coord.x + elm.face.normal.x, elm.object.coord.y + elm.face.normal.y, elm.object.coord.z + elm.face.normal.z);
                }
                else if (action == 1) {
                    removeBlock(elm);
                }
            }
            else {
                if (action == 0) {
                    var posX = Math.round(intersects[0].point.x / 5);
                    var posZ = Math.round(intersects[0].point.z / 5);
                    addBlock(posX, 0, posZ);
                }
            }
        }
        else{
            if(chooseColor){
                document.getElementById("colorField").style.visibility = "";
                closeColorField.style.display = "";
            }
        }
    });

    colorField.addEventListener('click', function (){
        chooseColor = true;
        document.getElementById('colorField').jscolor.show();
    });

    closeColorField.addEventListener('click', function (){
        chooseColor = false;
        controls.lock();
        document.getElementById("colorFieldUI").style.visibility = "hidden";
        closeColorField.style.display = "none";
        mousePointer.style.display = "";
    });

    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    } );

    controls.addEventListener( 'unlock', function () {
        if(chooseColor){
            document.getElementById("colorFieldUI").style.visibility = "";
            closeColorField.style.display = "";
        } else{
            blocker.style.display = 'block';
            instructions.style.display = '';
        }
    } );

    scene.add( controls.getObject() );

    const onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            
            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;
            
            case 67: // c
                if (controls.isLocked) changeColor();
                break;
            
            case 66: // b
                if (controls.isLocked) action = 0;
                break;
            
            case 72: // h
                if (controls.isLocked) action = 1;
                break;
        }
    };

    const onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // floor
    let floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
    floorGeometry.rotateX( - Math.PI / 2 );
    
    // vertex displacement
    let position = floorGeometry.attributes.position;
    for ( let i = 0, l = position.count; i < l; i ++ ) {
        vertex.fromBufferAttribute( position, i );
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;
        position.setXYZ( i, vertex.x, vertex.y, vertex.z );
    }

    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
    position = floorGeometry.attributes.position;
    const colorsFloor = [];

    for ( let i = 0, l = position.count; i < l; i ++ ) {
        color.setHSL( 0.5, Math.random() * 0.25 + 0.75, Math.random() * 0.25 + 0.15);
        colorsFloor.push( color.r, color.g, color.b );
    }
    
    floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );

    const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    scene.add( floor );
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}
// add a block
function addBlock(x, y, z){
    var boxGeometry = new THREE.BoxGeometry(6, 6, 6);
    var boxMaterial = new THREE.MeshBasicMaterial( {color: blockColor} );
    var box = new THREE.Mesh(boxGeometry, boxMaterial);

    box.position.set(x * 6, y * 6 + 5, z * 6);
    box.typeObject = "block";
    box.coord = {x, y, z};
    scene.add(box);  
}
// remove a block
function removeBlock(block){
    scene.remove(block.object);
    block.object.material.dispose();
    block.object.geometry.dispose();
}
// change actual color
function changeColor(){
    if(!chooseColor){
        chooseColor = true;
        controls.unlock();
        document.getElementById("colorFieldUI").style.visibility = "";
        closeColorField.style.visibility = "";
        document.getElementById('colorField').jscolor.show();
        mousePointer.style.display = "none";
    }
}
// new block color
function newBlockColor(jscolor){
    blockColor = new THREE.Color('#' + jscolor);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    const time = performance.now();
    
    if ( controls.isLocked === true ) {
        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;
    
        const intersections = raycaster.intersectObjects( objects );
        const onObject = intersections.length > 0;
        const delta = ( time - prevTime ) / 1000;
    
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    
        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions
        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
        if ( onObject === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
        }
    
        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );
        controls.getObject().position.y += ( velocity.y * delta ); // new behavior
        if ( controls.getObject().position.y < 10 ) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
    }
    prevTime = time;
    renderer.render( scene, camera );
}

window.addEventListener('mousemove', onMouseMove, false);