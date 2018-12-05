#!/usr/local/bin/node

const getInput = () => {
    return new Promise( (resolve, reject) => {
        let string = '';
        const getStdin = require('get-stdin');
        getStdin().then(input => {
            resolve(input.trim());
        });
    });
};

const react = (polymer) => {
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
    return compressed;
};

const removeUnit = (asciiCode, polymer) => {
    let matchRE = new RegExp(String.fromCharCode(asciiCode), "ig");
    return(polymer.replace(matchRE, ''));
};

getInput()
.then( (polymer) => {
    let minLength = polymer.length;
    let minLetter = '';
    for (var i=65; i<=90; i++){
        let modified = removeUnit(i, polymer);
        let compressed = react(modified);
        if (compressed.length < minLength){
            minLength = compressed.length;
            minLetter = String.fromCharCode(i);
        }
    }
    console.log(minLength);
});


