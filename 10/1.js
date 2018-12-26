#!/usr/local/bin/node

const getInput = () => {
    return new Promise( (resolve, reject) => {
        let data = {
            "points": {},
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "height": 0,
            "width": 0,
        };
        const getStdin = require('get-stdin');
        getStdin().then(input => {
            let lineRE = /^position=<\s*([+-]?\d+),\s*([+-]?\d+)> velocity=<\s*([+-]?\d+),\s*([+-]?\d+)>/;
            let lines = input.split("\n");
            let i = 0;
            lines.forEach( (line) => {
                i++;
                let parsed = line.match(lineRE);
                if (parsed && parsed.length){
                    data.points[i] = {
                                    "x": Number(parsed[1]),
                                    "y": Number(parsed[2]),
                                    "velX": Number(parsed[3]),
                                    "velY": Number(parsed[4]),
                                };
                }
                console.log(line, parsed);
            });
            resolve(data);
        });
    });
};

const moveForward = (data) => {
    Object.keys(data.points).forEach( (point) => {
        data.points[point].x += data.points[point].velX;
        data.points[point].y += data.points[point].velY;
    });
    let allX = Object.keys(data.points).map( (point) => data.points[point].x ).sort( (a,b) => a - b );
    let allY = Object.keys(data.points).map( (point) => data.points[point].y ).sort( (a,b) => a - b );
    data.top = allY[0];
    data.bottom = allY[allY.length-1];
    data.left = allX[0];
    data.right = allX[allX.length-1];

    data.width = (data.right-data.left)
    data.height = (data.bottom - data.top);
    return data;
}

const draw = (data) => {
    for (var y=data.top; y<=data.bottom; y++){
        let line = [];
        for (var x=data.left; x<=data.right; x++){
            let char = Object.keys(data.points).filter( (point) => { return data.points[point].x == x && data.points[point].y == y } ).length ? '#' : '.';
            line.push(char);
        }
        console.log(line.join(''));
    }   
};

getInput()
.then( (data) => {
    console.log(data);
    var sleep = require('sleep');
    var moves = 0;
    while (1){
        moves++;
        data = moveForward(data);
        console.log(`${moves} (${data.height}h x ${data.width}w) -------------------------------------------------------`);
        if (data.height < 80){
            draw(data);
        }
        if (data.height < 40){
            sleep.sleep(1);
        }
    }
});
