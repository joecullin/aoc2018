#!/usr/local/bin/node

const getStdin = require('get-stdin');
getStdin().then(input => {
    let claims = input.split("\n");
    let claimRE = /^#(\d+)\s+@\s+(\d+),(\d+):\s+(\d+)x(\d+)/; // #1 @ 604,100: 17x27
    let whole = [];
    claims.forEach( (claim) => {
        let claimProperties = claim.match(claimRE);
        if (claimProperties != null){
            claimProperties.shift();
            let id, left, right, top, bottom, width, height;
            [id, left, top, width, height] = claimProperties.map( (x) => parseInt(x));
            right = left + width;
            bottom = top+height;
            for (x=left; x<right; x++){
                whole[x] = whole[x] || [];
                for (y=top; y<bottom; y++){
                    whole[x][y] = whole[x][y] ? whole[x][y]+1 : 1;
                }
            }
        }
    });

    let count = whole.reduce( (accumulator, currentValue) => {
        return accumulator + currentValue.reduce( (accumulator, currentValue) => {
            return currentValue>1 ? accumulator + 1 : accumulator;
        }, 0);
    }, 0);

    console.log(count);
});

