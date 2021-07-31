import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.131.1-ABR1EJL0AQkCASkHoEad/mode=imports,min/optimized/three.js';
import { RenderPass } from 'https://cdn.skypack.dev/pin/three@v0.131.1-ABR1EJL0AQkCASkHoEad/mode=imports,min/unoptimized/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/pin/three@v0.131.1-ABR1EJL0AQkCASkHoEad/mode=imports,min/unoptimized/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'https://cdn.skypack.dev/pin/three@v0.131.1-ABR1EJL0AQkCASkHoEad/mode=imports,min/unoptimized/examples/jsm/postprocessing/EffectComposer.js';

const container = document.querySelector( "container" );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window );
renderer.toneMapping = THREE.ReinhardToneMapping;
container.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x020204 );

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 300;
camera.position.y = 0;
scene.add( camera );

//MOUSE INPUTS
///////////////////////////////////////////
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


//LIGHTS
///////////////////////////////////////////
scene.add( new THREE.AmbientLight( 0x101010 ) );

//PASSES
////////////////////////////////////////////
const renderScene = new RenderPass( scene, camera );

const bloomParams = {
    bloomThreshold: 0,
    exposure: 0.9,
    bloomStrength: 3,
    bloomRadius: 0.3
};

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = bloomParams.threshold;
bloomPass.strength = bloomParams.bloomStrength;
bloomPass.radius = bloomParams.bloomRadius;

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );

//GEOMETRY
////////////////////////////////
var num_tris = 400;
var geometry = [];
var vz = [];
var mats = [];

const geo1 = new THREE.BoxGeometry( 50, 50, 70 );
const material1 = new THREE.MeshBasicMaterial( { color: 0x666666 } );
const cube1 = new THREE.Mesh( geo1, material1 );

const geo2 = new THREE.BoxGeometry( 30, 30, 80 );
const material2 = new THREE.MeshBasicMaterial( { color: 0x020202 } );
const cube2 = new THREE.Mesh( geo2, material2 );

const geo3 = new THREE.BoxGeometry( 10, 10, 90 );
const material3 = new THREE.MeshBasicMaterial( { color: 0x111111 } );
const cube3 = new THREE.Mesh( geo3, material3 );

cube1.name = 'big';
cube3.name = 'small';


scene.add( cube1 );
scene.add( cube2 );
scene.add( cube3 );



function initGeometry() {
    const g = new THREE.TetrahedronGeometry( 14 );
    const w = new THREE.WireframeGeometry( g );

    for ( let i = 0; i < num_tris; i++ ) {
        var m = new THREE.LineBasicMaterial( { color: 0xbb3434, linewidth: 20 } );
        mats.push( m );

        var object = new THREE.LineSegments( w, m );

        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;


        object.position.x = 400 * ( Math.random() * 2 - 1 );
        object.position.y = 400 * ( Math.random() * 2 - 1 );
        object.position.z = 1300 * ( Math.random() - 1 );

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;


        object.material.depthTest = false;
        object.material.opacity = 0.4;

        object.material.transparent = true;

        scene.add( object );
        geometry.push( object );
        vz.push( Math.random() * 2 );


    }
}
initGeometry();




window.addEventListener( "resize", onWindowResize, false );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );
    console.log( window.innerHeight );
}


window.addEventListener( "pointerdown", onPointerDown );

function onPointerDown( event ) {
    var scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName( "html" )[ 0 ].scrollTop;
    if ( scrollPos < window.innerHeight ) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        const intersects = raycaster.intersectObjects( scene.children );
        if ( intersects.length > 0 ) {
            const object = intersects[ 0 ].object;

            if ( object.name == 'big' ) {
                mode += 1;
                if ( mode > 5 ) mode -= 5;
                cube1.material.color = modeColors[ mode ];
                cube3.material.color = modeColors[ mode - 1 ];
            }
            else if ( object.name == 'small' ) {
                mode -= 1;
                if ( mode < 1 ) mode += 5;
                cube1.material.color = modeColors[ mode ];
                cube3.material.color = modeColors[ mode - 1 ];
            }

            console.log( mode );

            //object.material.color = new THREE.Color(0x550000);
        }
    }

}


let counter = 0;
//MODE
/////////////////
let mode = 1;
//1 => normal
//2=> color change on rebound
//3 => frenzy
/////////////////
const randColors = [ new THREE.Color( 'green' ), new THREE.Color( 'pink' ), new THREE.Color( 'goldenrod' ), new THREE.Color( 'purple' ), new THREE.Color( 'skyblue' ) ];
const modeColors = [ new THREE.Color( 0x111111 ), new THREE.Color( 0x666666 ), new THREE.Color( 0x652841 ), new THREE.Color( 0x123456 ), new THREE.Color( 0x654321 ), new THREE.Color( 0x111111 ) ];
function animate() {
    requestAnimationFrame( animate );
    composer.render();
    let m5 = 1;
    scene.background = new THREE.Color( 0x020204 );
    if ( mode == 3 ) m5 = -1;
    if ( mode == 3 ) scene.background = new THREE.Color( 0x030303 );
    if ( mode == 4 ) scene.background = new THREE.Color( 0x030301 );
    if ( mode == 5 ) {
        m5 = 0;
        scene.background = new THREE.Color( 0x000000 );
    }
    for ( var i = 0; i < num_tris; i++ ) {
        geometry[ i ].rotation.x += 0.002;
        geometry[ i ].rotation.y += 0.001;
        geometry[ i ].rotation.z += 0.003;

        geometry[ i ].position.z += vz[ i ] * m5;

        if ( mode == 1 ) geometry[ i ].material.color = new THREE.Color( 0xbb3434 );
        if ( mode == 3 ) {
            let h = Math.floor( Math.abs( geometry[ i ].position.z / 8 ) % 100 );
            geometry[ i ].material.color.setHSL( h / 100, 1, 0.5 );
        }

        if ( geometry[ i ].position.z > 300 ) {
            if ( mode == 1 ) { geometry[ i ].position.z = -1000; }
            if ( mode == 2 || mode == 3 ) {
                vz[ i ] *= -1;
                geometry[ i ].material.color = randColors[ i % randColors.length ];
            }
        }
        else if ( geometry[ i ].position.z < -1000 ) {
            vz[ i ] *= -1;
        }


    }
    counter += 0.05;

}

onWindowResize();
animate();