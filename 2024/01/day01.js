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

// const sortedLeftList = leftList.sort((a, b) => a - b);
// const sortedRightList = rightList.sort((a, b) => a - b);

// const tupledList = sortedLeftList.map((left, index) => [left, sortedRightList[index]]);

let counter = 0;

// for (const [left, right] of tupledList) {
    // counter += Math.abs(left - right);
// }

for (const left of leftList) {
    for (const right of rightList) {
        if (left === right) {
            counter += left;
        }
    }
}

console.log(counter);