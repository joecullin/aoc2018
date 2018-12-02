#!/usr/local/bin/node

const getStdin = require('get-stdin');
getStdin().then(input => {
    let ids = input.split("\n");
    let twos = 0, threes = 0;
    ids.forEach( (id) => {
        var seen = {};
        let thisTwos = 0, thisThrees = 0;
        for (var i = 0; i < id.length; i++) {
            const letter = id.charAt(i);
            seen[letter] = (seen[letter] || 0) + 1;
        }
        Object.entries(seen).forEach( ([letter,count]) => {
            if (count == 3){
                thisThrees++;
            }
            else if (count == 2){
                thisTwos++;
            }
        });
        twos += thisTwos ? 1 : 0;
        threes += thisThrees ? 1 : 0;
    });
    const checksum = twos * threes;
    console.log(checksum);
});

