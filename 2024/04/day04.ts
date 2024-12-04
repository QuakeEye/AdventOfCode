const fs = require("fs");
const fileName = process.argv[2];
export {};

const fileContents : string = fs.readFileSync(fileName, "utf8");
let lineArr : string[][] = [];

fileContents.split("\r\n").map((line) => {
    lineArr = lineArr.concat([line]);
})


// Word search setup
const wordToSearch: string = "XMAS";

const width = lineArr[0].length;
const height = lineArr.length;

const getLetterFromGrid: (x: number, y: number) => string = (x: number, y: number) => {
    return lineArr[y][x];
};

const outOfGrid: (x: number, y: number) => boolean = (x: number, y: number) => {
    return x < 0 || y < 0 || x >= width || y >= height;
};

const directions: [xDiff: number, yDiff: number][] = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
];


// Algorithm
let solves: [[xStart: number, yStart: number], [xEnd: number, yEnd: number]][] = [];

const checkWord = (x, y, direction: [number, number]) => {
    let xCheck, yCheck;

    for (let i = 1; i < wordToSearch.length; i++) {
        xCheck = x + i * direction[0];
        yCheck = y + i * direction[1];

        if (outOfGrid(xCheck, yCheck)) return;

        if (getLetterFromGrid(xCheck, yCheck) !== wordToSearch[i]) return;
    }

    solves.push([[x, y], [xCheck, yCheck]]);
};

for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
        if (getLetterFromGrid(x, y).startsWith(wordToSearch[0]))
            directions.forEach(direction => checkWord(x, y, direction));


console.log(solves);
console.log("Amount of", wordToSearch, ":", solves.length);