import { mkdir } from "fs";
import { Jimp } from "jimp";
import path = require("path");

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



// Algorithm
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


// Rendering for christmas tree
const renderGrid : (step: number) => void = async (step) => {
    const image = new Jimp({
        width: width,
        height: height,
        color: 0x000000ff
    });

    robots.forEach((robot) => {
        image.setPixelColor(0xffffffff, robot.position[0], robot.position[1]);
    });

    const outputPath = path.join("14", "renders", `step-${step}.png`);
    await mkdir(path.dirname(outputPath), () => {});

    await image.write(outputPath as any);
};

const renderSteps : (maxSteps: number) => void = (steps) => {
    for (let i = 1; i <= steps; i++) {
        step();
        renderGrid(i);
    }
};

renderSteps(10000);