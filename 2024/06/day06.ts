const fs = require("fs");
const fileName = process.argv[2];
export {};

let fileContents : string = fs.readFileSync(fileName, "utf8");
let lineArr : string[][] = [];

fileContents.split("\r\n").map((line) => {
    lineArr = lineArr.concat([line.split('')]);
})


// Grid setup
const width = lineArr[0].length;
const height = lineArr.length;

const checkCharInt: (a: string, b: string) => number = (a: string, b: string) => a === b ? 1 : 0;

const outOfGrid: (x: number, y: number) => boolean = 
    (x: number, y: number) => x < 0 || y < 0 || x >= width || y >= height;

interface IDirection {
    [key: string]: [x: number, y: number];
};

const Direction: IDirection = {
    "North": [0, -1],
    "East": [1, 0],
    "South": [0, 1],
    "West": [-1, 0]
};

const turnRight : (string) => string = (direction: string) => {
    if (direction === "North") return "East";
    if (direction === "East") return "South";
    if (direction === "South") return "West";
    return "North";
}


// Guard setup
let guardDirection : string = "North";
let guardPosition : [x: number, y: number];

for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
        if (lineArr[y][x] === '^')
            guardPosition = [x, y];


// Algorithm
while (true) {
    let oldGuardPos = guardPosition;

    let nextPosX = oldGuardPos[0] + Direction[guardDirection][0];
    let nextPosY = oldGuardPos[1] + Direction[guardDirection][1];

    lineArr[oldGuardPos[1]][oldGuardPos[0]] = 'X';

    if (outOfGrid(nextPosX, nextPosY)) break;

    if (lineArr[nextPosY][nextPosX] === '#') {
        guardDirection = turnRight(guardDirection);

        nextPosX = oldGuardPos[0] + Direction[guardDirection][0];
        nextPosY = oldGuardPos[1] + Direction[guardDirection][1];
    }

    guardPosition = [nextPosX, nextPosY];
}


// Count X's
let totalX : number = 0;

for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
        totalX += checkCharInt(lineArr[y][x], 'X');


// Printing
for (let y = 0; y < height; y++) {
    var output = "";
    for (let x = 0; x < width; x++) output += lineArr[y][x];
    console.log(output);
}

console.log(totalX);