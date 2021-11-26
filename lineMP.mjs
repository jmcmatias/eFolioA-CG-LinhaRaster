/*
    efolioA - Algoritmo do Ponto Médio  
    Jorge Matias 1901087   19/11/2021
*/

function lineMP(a = { x: x0, y: y0 }, b = { x: x1, y: y1 }) {                                                         //Condições de chamada
    /*                                                                                                                     // 1<|m|<1? Sinal m
        se for octante 1 x cresce mais rapido do que y cresce, escolha entre E e NE                 (m>0 |m|<1) A ENE< x ganha  (1)     (1)
        se for octante 2 y cresce mais rapido do que x cresce, escolha entre N e NE                 (m>0 |m|>1) B NNE> y ganha  (2)     (1)
        se for octante 3 y descresce mais rapido do que x cresce, escolha entre S e SE              (m<0 |m|>1) C SSE> -y ganha (2)     (2)
        se for octante 4 x cresce mais rapido do que y descresce, escolha entre E e SE              (m<0 |m|<1) D ESE< x ganha  (1)     (2)
        se for octante 5 x cresce mais rapido do que y cresce, novamente escolha entre E e NE       (m>0 |m|<1) A ENE< x ganha  (1)     (1)
        se for octante 6 y cresce mais rapido do que x cresce, novamente escolha entre N e NE       (m>0 |m|>1) B NNE> y ganha  (2)     (1)
        se for octante 7 y decresce mais rapido do que x cresce, novamente escolha entre S e SE     (m<0 |m|>1) C SSE> -y ganha (2)     (2)
        se for octante 8 x cresce mais rapido do que y descresce, novamente escolha entre E e SE    (m<0 |m|<1) D ESE< x ganha  (1)     (2)
                                                                                                            (1)-função zone1  (2)-função zone2
        Fórmulas simplificadas
        E    dnext = d + 2 * dy
        NE   dnext = d + 2 * (dy - dx)
        N    dnext = d + 2 * dx
        SE   dnext = d + 2 * (dx - dy)  
        S    dnext = d - 2 * dx
        Para a simetria em y
        W    dnext = d - 2 * dy   
        NW   dnext = d - 2 * (dy - dx)
        SW   dnext = d - 2 * (dx - dy)   
        
    */
    let vertices = [];  // Definição do array que vai receber os pontos

    if (a == b) {      // Para o caso em que o ponto a é igual ao ponto b, não necessita efetuar calculos.
        return vertices.push(a);
    }

    if (Math.abs(b.y - a.y) < Math.abs(b.x - a.x)) {    // (1) caso |dy| < |dx| sendo que m= dy/dx então |m| < 1 teste e Incremento/Decremento do y (octantes 1,4,5,8)
        if (a.x > b.x) {                // se a.x(x0) > b.x(x1) 
            vertices = zone1(b, a);     // chama a zona1 e inverte os pontos na chamada de forma a começar do ponto mais a oeste
        } else {
            vertices = zone1(a, b);     // senão chama a zona1
        }
    } else {                                            // (2) senão |m| > 1 teste e Incremento/Decremento do x ()
        if (a.y > b.y) {                // se a.y(y0) > b.y(y1)
            vertices = zone2(b, a);     // chama a zona2 e inverte os pontos na chamada de forma a começar do ponto mais a sul
        } else {
            vertices = zone2(a, b);     // senão chama a zona2
        }
    }
    return vertices;
}

// Função que computa a zona 1 do algoritmo 
function zone1(a, b) {

    let vertices = [];    // Array que irá receber os vertices escolhidos
    let dx = b.x - a.x;      // Calculo de dx
    let dy = b.y - a.y;      // Calculo de dy
    let dirY = 1;        // variavel que vai definir se o y incrementa ou decrementa (direção do y)

    if (dy < 0) {         // m < 0 (1) (2) Caso o dy seja negativo (y decrementa) m < 0 e |m| > 1 e aplica a simetria no eixo do x
        dirY = -1;         // a direção do crescimento passa a negativo (y decrementa)
        dy = -dy           // e o sinal de dy é também negativo
    }
    // senão m > 0 (1) (1) 
    let d = 2 * dy - dx; // Fator de decisão inicial
    let yn = a.y;          // inicialização do yn inicial

    for (let xn = a.x; xn <= b.x; xn++) {  // Em cada passo xn aumenta um do a.x(x0) até b.x(x1), neste caso o x cresce mais rapido
        //console.log({x:xn,y:yn});         // DEBUG only
        vertices.push({ x: xn, y: yn });     // Insere o ponto (vertice) no array
        if (d > 0) {             // caso o d seja positivo
            yn += dirY;        // incrementa/decrementa y na direção detetada anteriormente (conforme o sinal de dirY)
            d += (2 * (dy - dx));   // escolhe NE (ou NW conforme a simetria)
        } else {                // senão d=0 ou d<0
            d += 2 * dy;          // escolhe E (ou W!! conforme a simetria)(conforme o sinal de dirX) e y não incrementa
        }
    }
    return vertices;    // retorna o 
}

// Função que computa a zona2 do algoritmo
function zone2(a, b) {
    let vertices = [];     // Array que irá receber os vertices escolhidos
    let dx = b.x - a.x;        // Calculo de dx
    let dy = b.y - a.y;        // Calculo de dy
    let dirX = 1;          // variavel que vai definir se o x incrementa ou decrementa (direção do x) 

    if (dx < 0) {           // m < 0 (2) (2) Caso o dx seja negativo (x decrementa) m<0 e |m|>1 e aplica simetria no eixo do y 
        dirX = -1;         // a direção do crescimento passa a negativo
        dx = -dx           // e o sinal da variação também muda pois na chamada vamos trocar os pontos
    }                      // senão m > 0 (1) (1) 
    let d = 2 * dx - dy    // Calculo do fator de decisão inicial
    let xn = a.x;

    for (let yn = a.y; yn <= b.y; yn++) {     // Em cada passo yn aumenta um do a.y(y0) até b.y(y1), neste caso o y cresce mais rapido 
        //console.log({x:xn,y:yn});         // DEBUG only
        vertices.push({ x: xn, y: yn });     // Insere o ponto (vertice) no array
        if (d > 0) {              // caso o d seja positivo
            xn += dirX;       // incrementa/decrementa x na direção detetada anteriormente (conforme o sinal de dirX)
            d += 2 * (dx - dy);     // escolhe SE (ou SW conforme a simetria)
        } else {                // senão 
            d += 2 * dx;          // escolhe N (ou S!! conforme a simetria)(conforme o sinal de dirX) e x não incrementa
        }
    }
    return vertices;          // retorna o array vertices
    //console.log(vertices);  // DEBUG only
}
export default lineMP;       // exporta lineMP como default