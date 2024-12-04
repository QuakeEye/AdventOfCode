const fileName = process.argv[2];
const fs = require("fs");

const input = fs.readFileSync(fileName, "utf8");

const leftList = [];
const rightList = [];

input.split("\n").forEach((line) => {
    const [left, right] = line.split("   ");

    leftList.push(parseInt(left));
    rightList.push(parseInt(right));
});

let counter = 0;

for (const left of leftList)
    for (const right of rightList)
        if (left === right)
            counter += left;

console.log(counter);