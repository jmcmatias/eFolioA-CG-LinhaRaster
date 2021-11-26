/*
    efolioA - Algoritmo do Ponto Médio  
    Jorge Matias 1901087   19/11/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import lineMP from '../lineMP.mjs'

// Função que cria um pixel para ser colocado no display raster
function createPixel(side, squareColor, x, y) {
    const geometry = new THREE.BoxGeometry(side, side, 0);  // cada pixel será representado por uma box (quadrado) com z=0 e 
    const material = new THREE.MeshBasicMaterial({          // definição do material tipo mesh, da cor e duplo lado
        color: squareColor,
        side: THREE.DoubleSide
    });
    let pixel = new THREE.Mesh(geometry, material);           // sqr vai ser a mesh da boxgeometry com o material
    // definição da posição do pixel no display raster
    pixel.position.x = x;                                     
    pixel.position.y = y;
    pixel.position.z = 0;
    // Definição do nome apenas para controlo
    pixel.name = "sqr " + x + " " + y;  // DEBUG only

    return pixel; //retorna o mesh boxgeometry/material
}

//Função que vai crias o display raster, recebe como arg o tamanho da grelha, o tamanho de cada pixel (lado do quadrado) a cor1 e a cor2
function displayRaster(gridSize, pixelSize, gridColor1, gridColor2) {
    const displayRasterArray = [];                      // array onde vão der inseridos os "pixeis"
    for (let x = -gridSize; x <= gridSize; x++) {       //ciclo em x de -tamanho da grelha até +tamanho da grelha
        for (let y = -gridSize; y <= gridSize; y++) {   //ciclo em y de -tamanho da grelha até +tamanho da grelha
            if ((y % 2 == 0 && x % 2 == 0) ||           // se y e x forem pares ou 
                (y % 2 != 0 && x % 2 != 0)) {           // ou se y e x forem impares 
                let pixel = new createPixel(pixelSize, gridColor1, x, y); // coloca em pixel o pixel(mesh) criado nas posições (x,y) com a cor 1
                displayRasterArray.push(pixel);                           // insere o pixel no array
            }
            else {
                let pixel = new createPixel(pixelSize, gridColor2, x, y); // coloca em pixel o pixel(mesh) criado nas posições (x,y) com a cor 2
                displayRasterArray.push(pixel);                           // insere o pixel no array
            }
        }
    }
    return displayRasterArray;      // retorna 
}

// Função que cria o Tile para compor a lineMP
function createTile(pixelSize, pixelPosition, tileColor) {
    const tileHeight = (pixelSize) / 4;                     // Inicializa a altura do tile com pixelSize/4 (1/4) do comprimento de um pixel
    const geometry = new THREE.BoxGeometry(pixelSize, pixelSize, tileHeight);  // cria uma nova boxgeometry
    const material = new THREE.MeshBasicMaterial({                             // cria o material
        opacity: 0.7,                                                          // com opacidade 0.7 (transparencia)
        transparent: true,                      
        color: tileColor,                                                      // com a cor definida por pixelcolor
        side: THREE.DoubleSide                                                 // com double side
    });
    let tile = new THREE.Mesh(geometry, material);                             // cria a Mesh   
    tile.position.x = pixelPosition.x;              // inicializa com a posição x calculada em lineMP
    tile.position.y = pixelPosition.y;              // inicializa com a posição y calculada em lineMP
    tile.position.z = tileHeight / 2;               // inicializa
    //console.log(tile);                             // DEBUG only
    return tile;
}

// Função que chama a lineMP para o par de pontos selecionados e cria um array, e seguidamente cria um outro array com a Mesh a ser inserida na scene
function getLineMP(a, b, pixelSize, pixelColor) {
    let lineVertices = [];
    lineVertices = lineMP(a, b);
    const linePixels = [];
    lineVertices.every(vertice => linePixels.push(createTile(pixelSize,vertice,pixelColor)));
    //console.log(line);                            // DEBUG only
    //console.log(linePixels);                         // DEBUG only
    return linePixels
}
// Função que cria a linha ideal 
function getIdealLine(a, b,pixelSize) {
    const pointsForLine = [];
    pointsForLine.push(new THREE.Vector3(a.x,a.y,pixelSize/8));
    pointsForLine.push(new THREE.Vector3(b.x,b.y,pixelSize/8));
    const line = new THREE.BufferGeometry().setFromPoints(pointsForLine);
    const black = new THREE.LineBasicMaterial({ color: 0x000000 });
    const idealLine = new THREE.Line(line, black);
    return idealLine;
}

// classe para criar os eixos x e y, igual a que vem por defeito no THREE.js mas com a componente do vertice z a zero
class AxesCustom extends THREE.LineSegments {
    constructor(size = 1) {
        const vertices = [
            0, 0, 0, size, 0, 0,
            0, 0, 0, 0, size, 0,
            0, 0, 0, 0, 0, 0
        ];

        const colors = [
            1, 0, 0, 1, 0.6, 0,
            0, 1, 0, 0.6, 1, 0,
            0, 0, 1, 0, 0.6, 1
        ];

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({ vertexColors: true, toneMapped: false });

        super(geometry, material);
    }
}


export { displayRaster, AxesCustom, createPixel, getLineMP, getIdealLine };