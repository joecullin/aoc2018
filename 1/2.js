const getStdin = require('get-stdin');
getStdin().then(input => {
    let steps = input.split("\n");
    let seen = {};
    let result = 0;
    const reducer = (accumulator, currentValue) => {
        var expr = `${accumulator} ${currentValue}`;
        if (seen[accumulator] ==1) {
            console.log(accumulator);
            process.exit();
        }
        seen[accumulator] = (seen[accumulator] || 0) + 1;
        return eval(expr);
    };
    while (1){
        result = steps.reduce(reducer, result);
    }
});
