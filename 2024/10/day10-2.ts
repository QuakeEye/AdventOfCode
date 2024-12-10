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

const directions: [x: number, y: number][] = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
];


// Determine possible trail starts
let trailStarts : [x: number, y: number][] = [];

for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
        if (lineArr[y][x] === '0')
            trailStarts.push([x, y]);


// Pathfinding
const findNextCells = (currentTrail: [number, number][]) => {
    let possibleTrails : [number, number][][] = [];
    const newestAdditionIndex : [number, number] = currentTrail[currentTrail.length - 1];
    const newestAddition : number = parseInt(lineArr[newestAdditionIndex[1]][newestAdditionIndex[0]]);

    directions.map((direction) => {
        const newCellPos : [x: number, y: number] = 
            [newestAdditionIndex[0] + direction[0],
            newestAdditionIndex[1] + direction[1]];

        if (outOfGrid(newCellPos[0], newCellPos[1]))
            return;
        
        if (parseInt(lineArr[newCellPos[1]][newCellPos[0]]) - newestAddition !== 1)
            return;

        let addingTrail : [number, number][] = currentTrail.concat([newCellPos]);

        possibleTrails.push(addingTrail);
    });

    return possibleTrails;
};

let newTrails : [number, number][][] = [];
trailStarts.map((trail) => {
    newTrails = newTrails.concat(findNextCells([trail]));
});


for (let i = 0; i < 8; i++) {
    let newNewTrails : [number, number][][] = [];
    
    for (let j = 0; j < newTrails.length; j++)
        newNewTrails = newNewTrails.concat(findNextCells(newTrails[j]));

    newTrails = newNewTrails;
};

console.log("Length", newTrails.length);