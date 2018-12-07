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
    grid["left"] -= 10000;
    grid["top"] -= 10000;
    grid["bottom"] += 10000;
    grid["right"] += 10000;
    console.log(grid);
    let goodPoints = [];
    let good = 0;
    for (var i=grid["left"]; i<=grid["right"]; i++){
        console.log(i);
        for (var j=grid["top"]; j<=grid["bottom"]; j++){
            let totalDistance = grid.myPoints.reduce( (accumulator, thisPoint) => {
                return accumulator + manhattan([thisPoint.x, thisPoint.y], [i,j]);
            }, 0);
            if (totalDistance < 10000){
                // goodPoints.push(thisPoint.id);
                good++;
            }
        }
    }
    // console.log(goodPoints.length);
    console.log(good);
});


