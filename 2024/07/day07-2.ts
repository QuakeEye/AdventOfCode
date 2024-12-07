const fs = require("fs");
const fileName = process.argv[2];
export {};

let fileContents : string = fs.readFileSync(fileName, "utf8");

// Parse file content
let eqResults : number[] = [];
let eqComponents : number[][] = [];

fileContents.split("\r\n").map((line) => {
    let lineComponents = line.split(":");

    eqResults.push(parseInt(lineComponents[0]));

    eqComponents.push(lineComponents[1].substring(1).split(" ").map((strNum) => parseInt(strNum)));
});


// Determine operators
let total : number = 0;

for (let i = 0; i < eqResults.length; i++) {
    if (eqComponents[i].length === 1 && eqResults[i] === eqComponents[i][0])
        total += eqResults[i];
    
    let counters : number[] = [];

    counters.push(eqComponents[i][0] + eqComponents[i][1]);
    counters.push(eqComponents[i][0] * eqComponents[i][1]);
    counters.push(parseInt(eqComponents[i][0].toString() + eqComponents[i][1].toString()));

    for (let j = 1; j < eqComponents[i].length - 1; j++) {
        let tempCounters : number[] = [];
        
        for (let k = 0; k < 3**j; k++) {
            let old : number = counters.pop();

            tempCounters.push(old + eqComponents[i][j + 1]);
            tempCounters.push(old * eqComponents[i][j + 1]);
            tempCounters.push(parseInt(old.toString() + eqComponents[i][j + 1].toString()));
        }

        counters = counters.concat(tempCounters);
    }

    if (counters.includes(eqResults[i])) total += eqResults[i];
}

console.log(total);