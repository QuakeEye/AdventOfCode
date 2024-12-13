const fs = require("fs");
const fileName = process.argv[2];
export {};

const fileContents : string = fs.readFileSync(fileName, "utf8");
const lines : string[] = fileContents.split("\r\n");


// Definitions
type Arcade = {
    buttonA: [number, number],
    buttonB: [number, number],
    prizePos: [number, number]
};


// Parsing lines
let lineGroups : string[][] = [];

for (let i = 0; i < lines.length; i += 4)
    lineGroups.push(lines.slice(i, i + 3));


// Parsing arcade data
let arcades : Arcade[] = [];

lineGroups.forEach((lineGroup) => {
    const buttonA : number[] = lineGroup[0].split(": ")[1].split(", ").map((elem) => {
        return parseInt(elem.split("+")[1]);
    });
    const buttonB : number[] = lineGroup[1].split(": ")[1].split(", ").map((elem) => {
        return parseInt(elem.split("+")[1]);
    });

    const prizePos : number[] = lineGroup[2].split(": ")[1].split(", ").map((elem) => {
        return parseInt(elem.split("=")[1]);
    });

    arcades.push({
        buttonA: [buttonA[0], buttonA[1]],
        buttonB: [buttonB[0], buttonB[1]],
        prizePos: [prizePos[0], prizePos[1]]
    });
});


// Linear algebra to determine minimum token cost
const getCheapestWin : (Arcade) => number = (arcade: Arcade) => {
    const a : number =  (arcade.buttonB[1] * arcade.prizePos[0] - arcade.buttonB[0] * arcade.prizePos[1]) / 
                        (arcade.buttonB[1] * arcade.buttonA[0] - arcade.buttonB[0] * arcade.buttonA[1]);
    
    const b : number = (arcade.prizePos[0] - arcade.buttonA[0] * a) / (arcade.buttonB[0]);
    
    return ((3 * a + b) % 1 === 0.0) ? 3 * a + b : 0;
};

let spentTokens : number = 0;

arcades.forEach((arcade) => {
    spentTokens += getCheapestWin(arcade);
});

console.log(spentTokens);