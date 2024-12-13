const fs = require("fs");
const fileName = process.argv[2];
export {};

const fileContents : string = fs.readFileSync(fileName, "utf8");
const lines : string[] = fileContents.split("\r\n");


// Definitions
type Arcade = {
    buttonA: [bigint, bigint],
    buttonB: [bigint, bigint],
    prizePos: [bigint, bigint]
};


// Parsing lines
let lineGroups : string[][] = [];

for (let i = 0; i < lines.length; i += 4)
    lineGroups.push(lines.slice(i, i + 3));


// Parsing arcade data
let arcades : Arcade[] = [];

lineGroups.forEach((lineGroup) => {
    const buttonA : bigint[] = lineGroup[0].split(": ")[1].split(", ").map((elem) => {
        return BigInt(elem.split("+")[1]);
    });
    const buttonB : bigint[] = lineGroup[1].split(": ")[1].split(", ").map((elem) => {
        return BigInt(elem.split("+")[1]);
    });

    const prizePos : bigint[] = lineGroup[2].split(": ")[1].split(", ").map((elem) => {
        return (BigInt(parseInt(elem.split("=")[1])) + 10000000000000n);
    });

    arcades.push({
        buttonA: [buttonA[0], buttonA[1]],
        buttonB: [buttonB[0], buttonB[1]],
        prizePos: [prizePos[0], prizePos[1]]
    });
});


// Linear algebra to determine minimum token cost
const getCheapestWin : (Arcade) => bigint = (arcade: Arcade) => {
    const a : bigint =  (arcade.buttonB[1] * arcade.prizePos[0] - arcade.buttonB[0] * arcade.prizePos[1]) / 
                        (arcade.buttonB[1] * arcade.buttonA[0] - arcade.buttonB[0] * arcade.buttonA[1]);
    
    const b : bigint = (arcade.prizePos[0] - arcade.buttonA[0] * a) / (arcade.buttonB[0]);
    
    const cost : bigint = 3n * a + b;

    if (a * arcade.buttonA[0] + b * arcade.buttonB[0] === arcade.prizePos[0] &&
        a * arcade.buttonA[1] + b * arcade.buttonB[1] === arcade.prizePos[1])
            return cost;

    return 0n;
};

let spentTokens : bigint = 0n;

arcades.forEach((arcade) => {
    spentTokens += getCheapestWin(arcade);
});

console.log(spentTokens);