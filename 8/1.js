#!/usr/local/bin/node

const parseTree = (data) => {
    data.level++;
    let childCount = data.tree.shift();
    let metaCount = data.tree.shift();
    if (childCount){
        for (var child=1; child<=childCount; child++){
            data = parseTree(data);
        }
    }
    let metaData = data.tree.splice(0, metaCount);
    let node = {                
               "childCount": childCount,
               "metaCount": metaCount,
               "metaSum": metaData.reduce( (accumulator, item) => accumulator + item, 0),
               "metaData": metaData
               };
    data.nodes.push(node);
    data.level--;
    return data;
};

const getInput = () => {
    return new Promise( (resolve, reject) => {
        let data = {
            "level": 0,
            "tree": [],
            "nodes": []
        };
        const getStdin = require('get-stdin');
        getStdin().then(input => {
            let lines = input.split("\n");
            data.tree = lines[0].split(' ').map(Number);
            data = parseTree(data);
            resolve(data.nodes);
        });
    });
};

getInput()
.then( (nodes) => {
    let totalMeta = nodes.reduce((accumulator, node) => {
        return accumulator + node.metaSum;
    }, 0);
    console.log(totalMeta);
});
