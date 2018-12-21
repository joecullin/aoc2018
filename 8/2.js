#!/usr/local/bin/node

const parseTree = (data) => {
    data.level++;
    let childCount = data.tree.shift();
    let metaCount = data.tree.shift();
    let childTotals = [];
    if (childCount){
        for (var child=1; child<=childCount; child++){
            data = parseTree(data);
            childTotals.push(data.nodes[data.nodes.length-1].root);
        }
    }
    let metaData = data.tree.splice(0, metaCount);
    let node = {
               "childCount": childCount,
               "metaCount": metaCount,
               "metaSum": metaData.reduce( (accumulator, item) => accumulator + item, 0),
               "childTotals": childTotals,
               "root": 0,
               "metaData": metaData
               };
    node.metaData.forEach( (val) => {
        if (node.childCount == 0){
            node.root += val;
        }
        else if (node.childCount >= val){
            node.root += node.childTotals[val-1];
        }
    });

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
    console.log(nodes.pop().root);
});
