/*
    efolioA - Algoritmo do Ponto Médio  
    Jorge Matias 1901087   19/11/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import lineMP from '../lineMP.mjs'

function createSquare(side, squareColor, x, y) {
    const geometry = new THREE.BoxGeometry(side, side, 0)
    const material = new THREE.MeshBasicMaterial({
        color: squareColor,
        side: THREE.DoubleSide
    });
    let sqr = new THREE.Mesh(geometry, material);
    sqr.position.x = x;
    sqr.position.y = y;
    sqr.position.z = 0;
    sqr.name = "sqr " + x + " " + y;  // DEBUG only

    return sqr;
}

function grid(size, pixelSize, gridColor1, gridColor2) {
    const squares = [];
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            if ((y % 2 == 0 && x % 2 == 0) ||
                (y % 2 != 0 && x % 2 != 0)) {
                let sqr = new createSquare(pixelSize, gridColor1, x, y);
                squares.push(sqr);
            }
            else {
                let sqr = new createSquare(pixelSize, gridColor2, x, y);
                squares.push(sqr);
            }
        }

    }
    return squares;

}

function createPixel(pixelSize, pixelPosition, pixelColor) {
    const pixelHeight = pixelSize / 4;
    const geometry = new THREE.BoxGeometry(pixelSize, pixelSize, pixelHeight);
    const material = new THREE.MeshBasicMaterial({
        opacity: 0.7,
        transparent: true,
        color: 0xffff00,
        side: THREE.DoubleSide
    });
    let pxl = new THREE.Mesh(geometry, material);
    pxl.position.x = pixelPosition.x;
    pxl.position.y = pixelPosition.y;
    pxl.position.z = pixelHeight / 2;
    console.log(pxl);
    return pxl;
}

function getIdealLine(a, b,pixelSize) {
    console.log(pixelSize);
    const pointsForLine = [];
    pointsForLine.push(new THREE.Vector3(a.x,a.y,pixelSize/8));
    pointsForLine.push(new THREE.Vector3(b.x,b.y,pixelSize/8));
    console.log(pointsForLine);
    const line = new THREE.BufferGeometry().setFromPoints(pointsForLine);
    const black = new THREE.LineBasicMaterial({ color: 0x000000 });
    const idealLine = new THREE.Line(line, black);
    return idealLine;
}

function getLineMP(a, b, pixelSize, pixelColor) {
    let line = [];
    line = lineMP(a, b);
    const linePixels = [];
    for (let i = 0; i < line.length; i++) {
        console.log(line);
        linePixels.push(createPixel(pixelSize, line[i]));
        console.log(linePixels);
    }

    //console.log(linePixels);
    return linePixels
}


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


export { grid, AxesCustom, createPixel, getLineMP, getIdealLine };