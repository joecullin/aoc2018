#!/usr/local/bin/node

const getStdin = require('get-stdin');
getStdin().then(input => {
    let ids = input.split("\n");
    ids.forEach( (id) => {
        ids.forEach( (id2) => {
            let same = [];
            for (var i = 0; i < id.length; i++) {
                if (id.charAt(i) == id2.charAt(i)){
                    same.push(id.charAt(i));
                }
            }
            if (same.length == id.length-1){
                console.log(same.join(''));
                process.exit();
            }
        });
    });
});
