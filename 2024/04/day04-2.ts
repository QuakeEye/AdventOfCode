const fs = require("fs");
const fileName = process.argv[2];
const printAllSolvesInput = process.argv[3];
const printAllSolves: boolean = printAllSolvesInput === "t" ? true : false;
export {};

const fileContents : string = fs.readFileSync(fileName, "utf8");
let lineArr : string[][] = [];

fileContents.split("\r\n").map((line) => {
    lineArr = lineArr.concat([line]);
})


// Word search setup
const width = lineArr[0].length;
const height = lineArr.length;

const getLetterFromGrid: (x: number, y: number) => string = (x: number, y: number) => {
    return lineArr[y][x];
};

const checkChar: (a: string, b: string) => number = (a: string, b: string) => a === b ? 1 : 0;


// Algorithm
let solves: [[xCenter: number, yCenter: number]][] = [];

const checkXMas = (x: number, y: number) => {
    const topLeft = getLetterFromGrid(x - 1, y - 1);
    const topRight = getLetterFromGrid(x + 1, y - 1);
    const bottomLeft = getLetterFromGrid(x - 1, y + 1);
    const bottomRight = getLetterFromGrid(x + 1, y + 1);

    if (topLeft === bottomRight || bottomLeft === topRight) return;

    const totalM: number = checkChar(topLeft, 'M') + 
                            checkChar(topRight, 'M') +
                            checkChar(bottomLeft, 'M') +
                            checkChar(bottomRight, 'M')

    const totalS: number = checkChar(topLeft, 'S') + 
                            checkChar(topRight, 'S') +
                            checkChar(bottomLeft, 'S') +
                            checkChar(bottomRight, 'S')

    if ( totalM !== 2 || totalS !== 2) return;

    solves.push([[x, y]]);
};

for (let y = 1; y < height - 1; y++)
    for (let x = 1; x < width - 1; x++)
        if (getLetterFromGrid(x, y) === 'A')
            checkXMas(x, y);


if (printAllSolves) console.log(solves);
console.log("Amount of X Masses:", solves.length);