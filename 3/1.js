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

    let count = 0;
    for (x=0; x<whole.length; x++){
        if (whole[x] !== undefined){
            for (y=0; y<whole[x].length; y++){
                if (whole[x][y] !== undefined && whole[x][y] > 1){
                    count++;
                }
            }
        }
    }

    console.log(count);
});

