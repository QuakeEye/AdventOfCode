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

const setGuard : () => void = () => {
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
            if (lineArr[y][x] === '^')
                guardPosition = [x, y];

    guardDirection = "North";
}

setGuard();


// Algorithm
function cloneArray(arr: any[]): any[] {
    return arr.map(item => Array.isArray(item) ? cloneArray(item) : item);
}

const checkLooping : (checkLineA: string[][]) => boolean = (checkLineA: string[][]) => {
    let doesLoop : boolean = false;
    let checkLineArr : string[][] = cloneArray(checkLineA);

    while (true) {
        let oldGuardPos = guardPosition;

        let nextPosX = oldGuardPos[0] + Direction[guardDirection][0];
        let nextPosY = oldGuardPos[1] + Direction[guardDirection][1];

        if (outOfGrid(nextPosX, nextPosY)) break;

        if (checkLineArr[oldGuardPos[1]][oldGuardPos[0]] === '.') {
            if (guardDirection === "North") checkLineArr[oldGuardPos[1]][oldGuardPos[0]] = 'N';
            if (guardDirection === "East") checkLineArr[oldGuardPos[1]][oldGuardPos[0]] = 'E';
            if (guardDirection === "South") checkLineArr[oldGuardPos[1]][oldGuardPos[0]] = 'S';
            if (guardDirection === "West") checkLineArr[oldGuardPos[1]][oldGuardPos[0]] = 'W';
        }

        if (checkLineArr[nextPosY][nextPosX] === '#') {
            guardDirection = turnRight(guardDirection);
            continue;
        }

        if (checkLineArr[nextPosY][nextPosX] === 'N' && guardDirection === "North") doesLoop = true;
        if (checkLineArr[nextPosY][nextPosX] === 'E' && guardDirection === "East") doesLoop = true;
        if (checkLineArr[nextPosY][nextPosX] === 'S' && guardDirection === "South") doesLoop = true;
        if (checkLineArr[nextPosY][nextPosX] === 'W' && guardDirection === "West") doesLoop = true;

        if (doesLoop) break;

        guardPosition = [nextPosX, nextPosY];
    }

    return doesLoop;
}


let totalLoops : number = 0;
let checkingLineArr : string[][] = cloneArray(lineArr);

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (lineArr[y][x] === '#' || lineArr[y][x] === '^') continue;

        setGuard();

        checkingLineArr = cloneArray(lineArr);
        checkingLineArr[y][x] = '#';

        totalLoops += checkLooping(checkingLineArr) ? 1 : 0;
    }
}


// Printing
console.log(totalLoops);