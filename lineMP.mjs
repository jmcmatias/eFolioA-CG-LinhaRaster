/*
    efolioA - Algoritmo do Ponto Médio  
    Jorge Matias 1901087   19/11/2021
*/

function lineMP(a = { x: x0, y: y0 }, b = { x: x1, y: y1 }) {

    //console.log("  a(" + a.x + "," + a.y + ") b(" + b.x + "," + b.y + ")");

    //console.log("signX= " + signX + " signY= " + signY + "      a(" + a.x + "," + a.y + ") b(" + b.x + "," + b.y + ")");

/*
    incrE = 2 * dy;
    incrNE = 2 * (dy - dx);
    incrN = -2 * dx;
*/
    //console.log("dx " + dx + " dy= " + dy + " incrE =" + incrE + " incrNE= " + incrNE + " incrN= " + incrN);

    let vertices = [];

    vertices.push(a); //start pixel
    // Para o caso em que o ponto a é igual ao ponto b, não necessita efetuar calculos.
    if (a === b) {
        //console.log("Pontos Iguais");
        return vertices;
    }

    if (Math.abs(b.y - a.y) < Math.abs(b.x - a.x)) {    // caso dy < dx
        if (a.x > b.x) {       // se x0 > x1
            vertices = zone0(b, a);     // chama a zona0 e inverte os pontos na chamada pois o algoritmo funciona da esquerda para a direita
        } else {
            vertices = zone0(a, b);      // senão chama a zona zero
        }
    } else {
        if (a.y > b.y) {
            vertices = zone1(b, a);
        } else {
            vertices = zone1(a, b);
        }
    }
    return vertices;
}




function zone0(a,b) {   // 
    
    let vertices =[];
    let dx=b.x-a.x;     // Calculo de dx
    let dy=b.y-a.y;     // Calculo de dy
    let dirY = 1;       // variavel que vai definir se o y incrementa ou decrementa (direção do y)
    
    if (dy < 0){        // Caso o dy seja negativo (y decrementa)
        dirY=-1;        // a direção passa a negativo
        dy=-dy          // e o sinal da variação também muda pois na chamada vamos trocar os pontos
    }
    
    let d = 2 * dy - dx; // Calculo do fator de decisão
    let yn=a.y;

    for ( let xn=a.x ; xn<=b.x ;xn++){  // faz x ir incrementando de x0 até x1
        vertices.push({x:xn,y:yn});
        if (d>0){
            yn+=dirY;         // incrementa y na direção detetada anteriormente (conforme o sinal de dirY)
            d+=(2*(dy-dx));  // incrementa para NE ou para NW
        }else{
            d+=2*dy;    // incrementa para E 
        }
    }
    return vertices;
}


function zone1(a,b) {
    let vertices = [];
    let dx=b.x-a.x;     // Calculo de dx
    let dy=b.y-a.y;     // Calculo de dy
    let dirX = 1;       // variavel que vai definir se o x incrementa ou decrementa (direção do x)
    
    if (dx < 0){        // Caso o dx seja negativo (x decrementa)
        dirX = -1;      // a direção passa a negativo
        dx = -dx        // e o sinal da variação também muda pois na chamada vamos trocar os pontos
    }
    let d = 2 * dx - dy    // Calculo do fator de decisão
    let xn=a.x;

    for (let yn=a.y;yn<=b.y;yn++ ){ // faz x ir incrementando de x0 até x1
        vertices.push({x:xn,y:yn});
        if(d>0){
            xn += dirX;
            d+=2*(dx-dy);
        }else{
            d+=2*dx;   // incrementa para Norte
        }
    }
    return vertices;
}
export default lineMP;