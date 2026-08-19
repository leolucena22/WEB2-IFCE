// Criei uma função que realiza um sorteio com 5 números entre 1 e 60
// Os números sorteados não podem ser repetidos
// Imprima os números sorteados

function sorteiaNumeros() {
  let array = [];
  let qtd = 0;

  while (qtd < 5) {
    let num = Math.floor(Math.random() * 60) + 1;
    if (!array.includes(num)) {
      array.push(num);
      qtd++;
    }
  }

  console.log(array);
}

sorteiaNumeros();
