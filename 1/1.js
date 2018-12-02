const getStdin = require('get-stdin');
getStdin().then(input => {
    console.log(input.split("\n").reduce( (accumulator, currentValue) => { return eval(`${accumulator} ${currentValue}`); }));
});
