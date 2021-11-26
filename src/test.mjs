import lineMP from "../lineMP.mjs";
// Para testes á função lineMP

let P={x:0,y:0}; let Q={x:3,y:1};

   P.x=Math.floor(Math.random() * 10);
   P.y=Math.floor(Math.random() * 10);
   Q.x=Math.floor(Math.random() * 10);
   Q.y=Math.floor(Math.random() * 10);
   console.log("Pontos P={"+P.x+","+P.y+"} e Q={"+Q.x+","+Q.y+"}");
   let R = lineMP(P,Q);
   console.log(R);

/*
//let P={x:0,y:0}; let Q={x:3,y:1};
console.log("Pontos P={"+P.x+","+P.y+"} e Q={"+Q.x+","+Q.y+"}");
let R = lineMP(P,Q);
console.log(R);
*/