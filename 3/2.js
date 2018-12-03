#!/usr/local/bin/node

const getStdin = require('get-stdin');
getStdin().then(input => {
    let claimsList = input.split("\n");
    let claimRE = /^#(\d+)\s+@\s+(\d+),(\d+):\s+(\d+)x(\d+)/; // #1 @ 604,100: 17x27
    let claims = [];
    let whole = [];
    claimsList.forEach( (claim) => {
        let claimProperties = claim.match(claimRE);
        if (claimProperties != null){
            claimProperties.shift();
            let id, left, right, top, bottom, width, height;
            [id, left, top, width, height] = claimProperties.map( (x) => parseInt(x));
            right = left + width;
            bottom = top+height;
            claims.push({
                "id": id,
                "left": left,
                "right": right,
                "top": top,
                "bottom": bottom,
                "width": width,
                "height": height
            });
            for (x=left; x<right; x++){
                whole[x] = whole[x] || [];
                for (y=top; y<bottom; y++){
                    whole[x][y] = whole[x][y] ? whole[x][y]+1 : 1;
                }
            }
        }
    });

    let best = claims.filter(claim => {
        for (x=claim.left; x<claim.right; x++){
            for (y=claim.top; y<claim.bottom; y++){
                if (whole[x][y] > 1)
                    return false;
            }
        }
        return true;
    });
    
    console.log(best[0].id);
});

