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


// Determine regions
const serialise : (pos: [number, number]) => string = (pos) => {
    return "[" + pos[0].toString() + ", " + pos[1].toString() + "]";
};

const deserialise : (value: string) => [x: number, y: number] = (value: string) => {
    const numbers: number[] = value.slice(1).slice(0, value.length - 2).split(", ").map((strNum) => {
        return parseInt(strNum);
    });
    return [numbers[0], numbers[1]];
};

const getRegion : (x: number, y: number, checkingCharacter: string, region: Set<string>) => Set<string> = (x: number, y: number, checkingCharacter: string, region: Set<string>) => {
    region.add(serialise([x, y]));

    directions.forEach(direction => {
        const newPos : [number, number] = [x + direction[0], y + direction[1]];

        if (outOfGrid(newPos[0], newPos[1])) return;

        if (!region.has(serialise(newPos)) && lineArr[newPos[1]][newPos[0]] === checkingCharacter) {
            region.add(serialise(newPos));
            const recursiveCheck = getRegion(newPos[0], newPos[1], checkingCharacter, region);
            if (recursiveCheck.size > 1) region = new Set<string>([...region, ...recursiveCheck]);
        }
    });

    return region;
};

const getRegions = () => {
    const regions = new Map<string, number[][][]>();
    const visited = new Set<string>();

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!visited.has(serialise([x, y]))) {
                visited.add(serialise([x, y]));

                const region = getRegion(x, y, lineArr[y][x], new Set<string>());

                regions.set(lineArr[y][x], [
                    ...(regions.get(lineArr[y][x])) || [],
                    Array.from(region).map((val) => deserialise(val))
                ]);

                region.forEach((pos) => visited.add(pos));
            }
        }
    }

    return regions;
};


// Calculate costs
const getPerimeter : (region: number[][], key: string) => number = (region: number[][], key: string) => {
    let perimeterCounter : number = 0;

    region.forEach((pos) => {
        const x = pos[0];
        const y = pos[1];

        directions.forEach((direction) => {
            const checkPos : [number, number] = [x + direction[0], y + direction[1]];

            if (outOfGrid(checkPos[0], checkPos[1])) return perimeterCounter++;
            if (lineArr[checkPos[1]][checkPos[0]] !== key) perimeterCounter++;
        });
    });

    return perimeterCounter;
};

const getArea : (region: number[][]) => number = (region: number[][]) => {
    return region.length;
};

const calculateTotalCost = (regions : Map<string, number[][][]>) => {
    let costCounter : number = 0;

    regions.forEach((regionList, key) => {
        regionList.forEach((region) => {
            costCounter += getArea(region) * getPerimeter(region, key);
            console.log(`A region of ${key} plants with price ${getArea(region)} * ${getPerimeter(region, key)} = ${getArea(region) * getPerimeter(region, key)}`);
        });
    });

    return costCounter;
};


// Entry point
const regions : Map<string, number[][][]> = getRegions();
const totalCost : number = calculateTotalCost(regions);

console.log(totalCost)