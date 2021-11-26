/*
    efolioA - Algoritmo do Ponto Médio  
    Jorge Matias 1901087   19/11/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { displayRaster, AxesCustom, getIdealLine, getLineMP } from './myObjects.mjs';

let renderer, scene, camera, controls, axes;  //Variaveis para funcionamento do THREE.js 

let pixels = [];              //Array que irá receber os pixeis do displayRaster
let lineTiles = [];           //Array que irá receber os Tiles da linha raster
var A;                        //Primeiro ponto selecionado
var B;                        //Segundo ponto selecionado
var points = [];              //array que irá receber os pontos selecionados pelo utilizador através da tecla 'x'
let rasterDisplaySize = 20;   //tamanho da grelha inicial de pixeis, poderá mudar a pedido do utilizador
const pixelSize = 1;          //tamanho do pixel(e tile) irão manter-se sempre a 1

const pixelColor = 0xffff00;            //0xffff00 - amarelo
const gridColor1 = 0xff8000;            //0xff8000 - laranja
const gridColor2 = 0x408080;            //0x408080 - azulado
const intersectedPixelColor = 0xff0000; //0xff0000 - Vermelho

const raycaster = new THREE.Raycaster(); // cria uma instancia de raycaster 
let mouse = new THREE.Vector2();         // cria um vector2 para receber as posições do rato devolvidas por onMouseMove 
mouse = { x: 0, y: 0, z: 0 };            // 

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
    camera.position.set(0, 0, 20);
    // controls 
    controls = new OrbitControls(camera, renderer.domElement);
    // ambient 
    scene.add(new THREE.AmbientLight(0x222222));
    // Desenha os eixos 
    getAxes();
    // Desenha o Display Raster
    getDisplayRaster();
}
// EventListener que devolve a posição do rato quando este se move com as coordenadas normalizadas e chama a função onMouseMove
document.body.addEventListener('mousemove', onMouseMove, false);
// Função que irá receber um callback com a ultima posição do rato x e y
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

//Função que insere o display raster na scene
function getDisplayRaster() {
    pixels = [];            // Inicializa o vetor de pixeis como vazio (global)
    pixels = displayRaster(rasterDisplaySize, pixelSize, gridColor1, gridColor2); // Coloca os objetos (mesh) pixeis no array pixels
    pixels.every(pixel => scene.add(pixel)); // desenha cada um deles na scene
}

// Função que vai inserir os eixos na scene
function getAxes() {
    axes = new AxesCustom(20);  // inicializa os eixos com 20 de comprimento
    axes.position.z = 0.05      // coloca os eixos um pouco acima do display raster para que se vejam bem
    scene.add(axes);            // adiciona a scene
}
// Função que vai inserir os tiles calculados por lineMP na scene
function getLineMPBlocks() {
    lineTiles = [];
    lineTiles = getLineMP(A, B, pixelSize, pixelColor);    // Chama a função que retorna o array com os objetos a serem inseridos
    //console.log(lineTiles);                              // DEBUG only
    lineTiles.every(tile => scene.add(tile));              // para todos os tiles insere cada um na scene
}
// Função que vai inserir a linha ideal na scene
function drawIdealLine() {
    //console.log(pixelSize);                               // DEBUG only
    let idealLine = getIdealLine(A, B, pixelSize);          // chama a função que retorna o objeto Line que representa a ideal line
    scene.add(idealLine);                                   // Insere na scene
}

// EventListener que "escuta por teclas pressionadas" e chama a função keydown
document.body.addEventListener('keydown', onKeyDown, false);

// Função que recebe o callback do evento keydown
function onKeyDown(event) {
    const keyName = event.key;              // inicializa keyName com o nome da tecla pressionada
    let i = 0;
    //console.log(keyname); // DEBUG only
    if (keyName == 'Backspace') {           // caso seja Backspace
        resetScene();                       // Faz reset a scene
    }

    if (keyName == 'x') {               // se a tecla pressionada for 'x'       
        //scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000)); // DEBUG only
        raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camara
        const intersects = raycaster.intersectObjects(pixels);     // coloca os objetos existentes no array pixels que são intercetados pelo ray no array intersects
        if (intersects.length > 0) {                               // Se existir alguma interseção
            intersects[0].object.material.color.set(intersectedPixelColor)      // muda a cor do pixel intersetado para vermelho
            points.push({ x: intersects[0].object.position.x, y: intersects[0].object.position.y }) // coloca o ponto que define a posição do pixel intersetado em points
            if (points.length >= 2) {    // caso points já tenha pelo menos 2 pontos 
                A = points[0];                                     // Inicializa A com o ponto no index 0 de points
                B = points[1];                                     // Inicializa B com o ponto no index 1 de points
                //console.log(points[0]); // DEBUG only
                //console.log(A, B);      // DEBUG only
                getLineMPBlocks();                                 // Chama a função que irá desencadear a inserção da linha raster na scene
                drawIdealLine();                                   // Chama a função que irá desencadear a inserção da linha ideal na scene
                points = [];                 // limpa o array points para que possa receber mais dois pontos
            }
            //console.log(intersects) // DEBUG only
            // console.log("x= " + intersects[0].object.position.x + ", y= " + intersects[0].object.position.y); // DEBUG only
        }
    }
}



// Função que reinicia todo o processo do algoritmo (para quando backspace é pressiondo ou quando é redimensionado o display raster)
function resetScene() {
    scene.remove.apply(scene, scene.children);  // Remove todos os filhos da scene (apaga tudo)
    points = [];                                // Reinicia o array poinst
    getAxes();                                  // chama o desenho dos eixos 
    getDisplayRaster();                         // Chama o desenho do display raster
}


window.changeDisplayRasterSize = () =>{
    rasterDisplaySize = document.getElementById("rasterDisplaySize").value;
    resetScene();
}
// Função recursiva que mantém a scene atualizada com o renderer
function animate() {
    //controls.update(); 
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

// Event Listener que deteta se a janela foi redimensionada e chama a função resize
window.addEventListener("resize", resize, false);

// Função que muda o aspect ratio da janela e atualiza o tamanho desta no renderer
// Acrescentei esta funcionalidade para que não fiquem zonas brancas ao redimensionar a janela do browser
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export default scene;   // exporta a scene


