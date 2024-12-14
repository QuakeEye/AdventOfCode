const fs = require("fs");
const fileName = process.argv[2];
const test = process.argv[3] === "t" ? true : false;
export {};

const fileContents : string = fs.readFileSync(fileName, "utf8");
const lines : string[] = fileContents.split("\r\n");


// Parse input lines
type Robot = {
    position: [number, number],
    velocity: [number, number]
};

let robots : Robot[] = [];

lines.forEach((line) => {
    const split : string[] = line.split(" ");

    const startPos: number[] = split[0].split("=")[1].split(",").map((strNum) => parseInt(strNum));
    const velocity: number[] = split[1].split("=")[1].split(",").map((strNum) => parseInt(strNum));

    robots.push({
        position: [startPos[0], startPos[1]],
        velocity: [velocity[0], velocity[1]]
    });
});


// Grid setup
const width = test ? 11 : 101;
const height = test ? 7 : 103;

const outOfGrid: (pos: [number, number]) => boolean = 
    (pos) => pos[0] < 0 || pos[1] < 0 || pos[0] >= width || pos[1] >= height;

const createGrid : (width: number, height: number) => number[][] = (width, height) => {
    return new Array(height).fill(0).map(() => new Array(width).fill(0));
};

const createGridWithRobots : () => number[][] = () => {
    const grid : number[][] = createGrid(width, height);

    robots.forEach((robot) => {
        grid[robot.position[1]][robot.position[0]] += 1;
    });

    return grid;
};

const printGrid : (grid: number[][]) => void = (grid) => {
    for (let y = 0; y < height; y++) {
        var output : string = "";
        for (let x = 0; x < width; x++) output += grid[y][x].toString();
        console.log(output);
    }
};


// Algorithm
const steps : number = 100; // Number of steps to take in the loop

const addVector2 : (left: [number, number], right: [number, number]) => [number, number] = (left, right) => {
    return [left[0] + right[0], left[1] + right[1]];
};

const fixComponent : (posComp: number, dimensionSize: number) => number = (posComp, dimensionSize) => {
    return (posComp - (Math.floor(posComp / dimensionSize)) * dimensionSize) % dimensionSize;
};

const moveRobot : (robot: Robot) => Robot = (robot) => {
    let newPos : [number, number] = addVector2(robot.position, robot.velocity);

    if (!outOfGrid(newPos)) return { ...robot, position: newPos };

    return { ...robot, position: [
        fixComponent(newPos[0], width),
        fixComponent(newPos[1], height)
    ]};
};

const step = () => {
    const newRobots : Robot[] = [];
    
    robots.forEach((robot) => {
        newRobots.push(moveRobot(robot));
    });

    robots = newRobots;
};

for (let i = 0; i < steps; i++) step();


// Calculate safety factor
const middleX : number = Math.floor(width / 2);
const middleY : number = Math.floor(height / 2);

type Quadrant = {
    xMinMax: [number, number],
    yMinMax: [number, number]
};

// Quadrant: [[Xmin, Xmax], [Ymin, Ymax]]
const quadrants : Quadrant[] = [
    { xMinMax: [0, middleX], yMinMax: [0, middleY] },
    { xMinMax: [middleX+1, width], yMinMax: [0, middleY] },
    { xMinMax: [0, middleX], yMinMax: [middleY+1, height] },
    { xMinMax: [middleX+1, width], yMinMax: [middleY+1, height]}
];

const determineQuadrantTotal : (quadrant: Quadrant, grid: number[][]) => number = (quadrant, grid) => {
    let quadrantCounter : number = 0;
    
    for (let y = quadrant.yMinMax[0]; y < quadrant.yMinMax[1]; y++)
        for (let x = quadrant.xMinMax[0]; x < quadrant.xMinMax[1]; x++)
            quadrantCounter += grid[y][x];

    return quadrantCounter;
};

const calculateSafetyFactor : (grid: number[][]) => number = (grid) => {
    let safetyFactor : number = 1;

    quadrants.forEach((quadrant) => {
        safetyFactor *= determineQuadrantTotal(quadrant, grid);
    });

    return safetyFactor;
};

// The steps are already taken, so create a grid with the moved robots, and print its safety factor
console.log(calculateSafetyFactor(createGridWithRobots()));