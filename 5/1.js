#!/usr/local/bin/node

const getInput = () => {
    return new Promise( (resolve, reject) => {
        let string = '';
        const getStdin = require('get-stdin');
        getStdin().then(input => {
            resolve(input.trim());
        });
    });
}

getInput()
.then( (polymer) => {
    let combos = [];
    for (var i=65; i<=90; i++){
        let j=i+32;
        combos.push(String.fromCharCode(i) + String.fromCharCode(j));
        combos.push(String.fromCharCode(j) + String.fromCharCode(i));
    }
    let matchRE = new RegExp(combos.join("|"), "g");
    let compressed = polymer, current = polymer;
    do {
        current = compressed;
        compressed = current.replace(matchRE, '');
    } while (compressed != current);
    console.log(compressed.length);
});


