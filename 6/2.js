#!/usr/local/bin/node

const getInput = () => {
    return new Promise( (resolve, reject) => {
        let grid = {
                    "myPoints": [],
                    "top": 500000,
                    "left": 500000,
                    "bottom": 0,
                    "right": 0 
        };
        const getStdin = require('get-stdin');
        getStdin().then(input => {
            let lines = input.split("\n");
            lines.forEach( (line) => {
                let thisPoint = line.split(", ");
                let thisX = parseInt(thisPoint[0]);
                let thisY = parseInt(thisPoint[1]);
                grid["bottom"] = thisY > grid["bottom"] ? thisY : grid["bottom"];
                grid["right"] = thisX > grid["right"] ? thisX : grid["right"];
                grid["top"] = thisY < grid["top"] ? thisY : grid["top"];
                grid["left"] = thisX < grid["left"] ? thisX : grid["left"];
                grid["myPoints"].push({
                                    "id": `${thisPoint[0]}_${thisPoint[1]}`,
                                    "x": thisPoint[0],
                                    "y": thisPoint[1]
                                });
            });
            resolve(grid);
        });
    });
};

const manhattan = (pointA, pointB) => {
    let distance = Math.abs(pointA[0] - pointB[0]) + Math.abs(pointA[1] - pointB[1]);
    return distance;
};

const mode = (array) => {
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
};

getInput()
.then( (grid) => {
    let good = 0;
    let startX = grid["left"] + Math.floor((grid["right"] - grid["left"])/2);
    let startY = grid["top"] + Math.floor((grid["bottom"] - grid["top"])/2);
    let radius = 0;
    let foundSome = 0;
    do {
        let previousTotal = good;
        let check = [];
        if (radius == 0){
            check.push([startX, startY]);
        }
        else{
            let left = startX - radius;
            let right = startX + radius;
            let top = startY - radius;
            let bottom = startY + radius;
            for (var i=left; i<=right; i++){
                check.push([i,top]);
                check.push([i,bottom]);
            }
            for (var i=top+1; i<bottom; i++){
                check.push([left,i]);
                check.push([right,i]);
            }
        }
        check.forEach( (point) => {
            let totalDistance = grid.myPoints.reduce( (accumulator, thisPoint) => {
                return accumulator + manhattan([thisPoint.x, thisPoint.y], point);
            }, 0);
            if (totalDistance < 10000){
                good++;
            }
        });
        foundSome = previousTotal != good;
        radius++;
    } while (foundSome);
    console.log(good);
});


