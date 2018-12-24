#!/usr/local/bin/node

const getInput = () => {
    return new Promise( (resolve, reject) => {
        let data = {
            "players": {},
            "marbles": {
                        "0": {
                            "id": 0,
                            "next": 0,
                            "prev": 0
                            }
                        },
            "currentPlayer": 0,
            "currentMarble": 0,
            "nextMarble": 1,
            "lastMarble": 0
        };
        const getStdin = require('get-stdin');
        getStdin().then(input => {
            let line = input.split("\n")[0];
            let parsed = line.match(/^(\d+) players; last marble is worth (\d+)/).map(Number);
            numPlayers = parsed[1];
            data.lastMarble = parsed[2] * 100;
            for (i=0; i<numPlayers; i++){
                data.players[i] = {"score": 0, "nextPlayer": i==numPlayers-1 ? 0 : i+1};
            }
            data.currentPlayer = numPlayers-1;
            resolve(data);
        });
    });
};

const getNext = (data, marble) => {
    let next = data.marbles[marble]["next"];
    return next;
}

const getPrev = (data, marble) => {
    let prev = data.marbles[marble]["prev"];
    return prev;
}

const insertMarble = (data, marble, after) => {
    let before = data.marbles[after]["next"];
    let newMarble = {
                    "id": marble,
                    "next": before,
                    "prev": after
                    };
    data.marbles[marble] = newMarble;
    data.marbles[after]["next"] = marble;
    data.marbles[before]["prev"] = marble;
    return data;
}

const removeMarble = (data, marble) => {

    let before = data.marbles[marble]["prev"];
    let after = data.marbles[marble]["next"];
    delete(data.marbles[marble]);
    data.marbles[before]["next"] = after;
    data.marbles[after]["prev"] = before;
    return data;
}

const playRound = (data) => {
    let newMarble = data.nextMarble;
    let newPlayer = data.players[data.currentPlayer].nextPlayer;
    if (newMarble % 23 == 0){
        data.players[data.currentPlayer].score += newMarble;
        let remove = data.currentMarble;
        for (var i=0; i<7; i++){
            remove = getPrev(data, remove);
        }
        data.players[data.currentPlayer].score += remove;
        let newCurrent = getNext(data, remove);
        data = removeMarble(data, remove);
        data.currentMarble = newCurrent;
    }
    else{
        let insertAfter = 0;
        insertAfter = getNext(data, data.currentMarble);
        data = insertMarble(data, newMarble, insertAfter);
        data.currentMarble = newMarble;
    }

    data.currentPlayer = newPlayer;
    data.nextMarble = data.nextMarble+1;
    return data;
};


getInput()
.then( (data) => {
    while (data.currentMarble <= data.lastMarble){
        data = playRound(data);
    }
    // console.log(data);
    let highScore = data.players[ Object.keys(data.players).sort( (a,b) => data.players[b].score - data.players[a].score )[0] ].score;
    console.log("high score", highScore);
});
