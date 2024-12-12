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
const boolToNumber : (input: boolean) => number = (input: boolean) => input ? 1 : 0;

// Calculate corners as that equals the amount of sides
const getCorners : (region: number[][], key: string) => number = (region: number[][], key: string) => {
    let cornerCount : number = 0;

    region.forEach((cell) => {
        // Determine outie corners
        //
        //      ...
        //      .XX
        //      .XX
        const left = [cell[0] - 1, cell[1]];
        const up = [cell[0], cell[1] - 1];
        const right = [cell[0] + 1, cell[1]];
        const down = [cell[0], cell[1] + 1];
        
        const topLeftOutie : boolean =      (outOfGrid(up[0], up[1]) || lineArr[up[1]][up[0]] !== key) && 
                                            (outOfGrid(left[0], left[1]) || lineArr[left[1]][left[0]] !== key);
        const topRightOutie : boolean =     (outOfGrid(up[0], up[1]) || lineArr[up[1]][up[0]] !== key) && 
                                            (outOfGrid(right[0], right[1]) || lineArr[right[1]][right[0]] !== key);
        const bottomLeftOutie : boolean =   (outOfGrid(down[0], down[1]) || lineArr[down[1]][down[0]] !== key) && 
                                            (outOfGrid(left[0], left[1]) || lineArr[left[1]][left[0]] !== key);
        const bottomRightOutie : boolean =  (outOfGrid(down[0], down[1]) || lineArr[down[1]][down[0]] !== key) && 
                                            (outOfGrid(right[0], right[1]) || lineArr[right[1]][right[0]] !== key);

        // Determine innie corners
        //
        //      .XX
        //      XXX
        //      XXX
        const topLeft = [cell[0] - 1, cell[1] - 1];
        const topRight = [cell[0] + 1, cell[1] - 1];
        const bottomLeft = [cell[0] - 1, cell[1] + 1];
        const bottomRight = [cell[0] + 1, cell[1] + 1];

        let topLeftInnie : boolean = false;
        let topRightInnie : boolean = false;
        let bottomLeftInnie : boolean = false;
        let bottomRightInnie : boolean = false;

        if (!outOfGrid(up[0], up[1]) && !outOfGrid(left[0], left[1])) {
            topLeftInnie =      (!outOfGrid(up[0], up[1]) && lineArr[up[1]][up[0]] === key) && 
                                (!outOfGrid(left[0], left[1]) && lineArr[left[1]][left[0]] === key) && 
                                (lineArr[topLeft[1]][topLeft[0]] !== key);
        }

        if (!outOfGrid(up[0], up[1]) && !outOfGrid(right[0], right[1])) {
            topRightInnie =     (!outOfGrid(up[0], up[1]) && lineArr[up[1]][up[0]] === key) && 
                                (!outOfGrid(right[0], right[1]) && lineArr[right[1]][right[0]] === key) && 
                                (lineArr[topRight[1]][topRight[0]] !== key);
        }

        if (!outOfGrid(down[0], down[1]) && !outOfGrid(left[0], left[1])) {
            bottomLeftInnie =   (!outOfGrid(down[0], down[1]) && lineArr[down[1]][down[0]] === key) && 
                                (!outOfGrid(left[0], left[1]) && lineArr[left[1]][left[0]] === key) && 
                                (lineArr[bottomLeft[1]][bottomLeft[0]] !== key);
        }

        if (!outOfGrid(down[0], down[1]) && !outOfGrid(right[0], right[1])) {
            bottomRightInnie =  (!outOfGrid(down[0], down[1]) && lineArr[down[1]][down[0]] === key) && 
                                (!outOfGrid(right[0], right[1]) && lineArr[right[1]][right[0]] === key) && 
                                (lineArr[bottomRight[1]][bottomRight[0]] !== key);
        }

        cornerCount +=  boolToNumber(topLeftOutie) + 
                        boolToNumber(topRightOutie) +
                        boolToNumber(bottomLeftOutie) +
                        boolToNumber(bottomRightOutie) +
                        boolToNumber(topLeftInnie) +
                        boolToNumber(topRightInnie) +
                        boolToNumber(bottomLeftInnie) +
                        boolToNumber(bottomRightInnie);
    });

    return cornerCount;
};

const getArea : (region: number[][]) => number = (region: number[][]) => {
    return region.length;
};

const calculateTotalCost = (regions : Map<string, number[][][]>) => {
    let costCounter : number = 0;

    regions.forEach((regionList, key) => {
        regionList.forEach((region) => {
            costCounter += getArea(region) * getCorners(region, key);
            console.log(`A region of ${key} plants with price ${getArea(region)} * ${getCorners(region, key)} = ${getArea(region) * getCorners(region, key)}`);
        });
    });

    return costCounter;
};


// Entry point
const regions : Map<string, number[][][]> = getRegions();
const totalCost : number = calculateTotalCost(regions);

console.log(totalCost)