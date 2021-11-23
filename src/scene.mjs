/*
    efolioA - Algoritmo do Ponto Médio  
    Jorge Matias 1901087   19/11/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { grid, AxesCustom, getIdealLine, getLineMP } from './myObjects.mjs';

let renderer, scene, camera, controls, axes;
let squares = [];

var A ;
var B ;
var points = [];
const gridSize = 20;
const pixelSize = 1;
const pixelColor=0xffff00;
const gridColor1=0xff8000;
const gridColor2=0x408080;

const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector3();
mouse = { x: 0, y: 0, z: 0 };

init();
animate();

function init() {
    // renderer 
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // scene 
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 10);
    // controls 
    controls = new OrbitControls(camera, renderer.domElement);

    // ambient 
    scene.add(new THREE.AmbientLight(0x222222));
    // axes 
    getAxes();

    // Grid
    getGrid();

    
}

const selected = [];
const test = new THREE.Vector2();

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function getGrid() {
    squares = [];
    squares = grid(gridSize, pixelSize, gridColor1,gridColor2);
    squares.every(square => scene.add(square));
}

function getAxes() {
    axes = new AxesCustom(20);
    axes.position.z=0.05
    scene.add(axes);
}

function getLineMPBlocks() {
    let lineBlocks = [];
    lineBlocks = getLineMP(A, B, pixelSize,pixelColor);
    console.log(lineBlocks);
    scene.add(lineBlocks[0]);
    lineBlocks.every(block => scene.add(block));
}

function drawIdealLine(){
    console.log(pixelSize);
    let idealLine=getIdealLine(A,B,pixelSize); 
    scene.add(idealLine);
}

// evento que le uma tecla quando
document.addEventListener('keydown', event => {
    event.preventDefault();
    const keyname = event.key;
    //console.log(keyname); // DEBUG only
    if (points.length < 2) {
        if (keyname == 'x') {
            //console.log("Mouse x=" + mouse.x + " y=" + mouse.y) // DEBUG only
            //scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000)); // DEBUG only
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(squares);
            if (intersects.length > 0) {
                intersects[0].object.material.color.set(0xff0000)

                points.push({ x: intersects[0].object.position.x, y: intersects[0].object.position.y })
                if (points.length == 2) {
                    A = points[0];
                    B = points[1];
                    console.log(points[0]);
                    console.log(A, B);
                    getLineMPBlocks();
                    drawIdealLine();
                }
                //console.log(intersects) // DEBUG only
                // console.log("x= " + intersects[0].object.position.x + ", y= " + intersects[0].object.position.y); // DEBUG only
            }

        }
    }
    

    //console.log(points);

    if (keyname == 'Backspace') {
        scene.remove.apply(scene, scene.children);
        points = [];
        getAxes();
        getGrid();
    }
})

window.addEventListener('mousemove', onMouseMove, false);


function animate() {
    //controls.update(); 
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

window.addEventListener("resize", resize, false);
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export default scene;
