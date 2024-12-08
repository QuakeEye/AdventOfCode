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


// General setup
let occCharacterTypes : string[] = [];
let occCharacters : [string, [x: number, y: number]][] = [];
const defaultCharacter : string = '.';

for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
        if (lineArr[y][x] !== defaultCharacter) {
            if (!occCharacterTypes.includes(lineArr[y][x]))
                occCharacterTypes.push(lineArr[y][x]);

            occCharacters.push([lineArr[y][x], [x, y]]);
        }
            


// Count antinodes
let antinodes : [x: number, y: number][] = [];

const antiIncludes : (antinode) => boolean = (antinode: [x: number, y: number]) => {
    for (let i = 0; i < antinodes.length; i++)
        if (antinodes[i][0] === antinode[0] && antinodes[i][1] === antinode[1]) return true;

    return false;
}

for (let i = 0; i < occCharacterTypes.length; i++) {
    for (let j = 0; j < occCharacters.length; j++) {
        const character = occCharacters[j];

        if (character[0] !== occCharacterTypes[i]) continue;

        for (let k = 0; k < occCharacters.length; k++) {
            if (j === k) continue;

            if (occCharacters[k][0] !== occCharacters[j][0]) continue;

            const posDiffX : number = occCharacters[k][1][0] - occCharacters[j][1][0];
            const posDiffY : number = occCharacters[k][1][1] - occCharacters[j][1][1];

            const antinodeOne : [number, number] = [occCharacters[k][1][0] + posDiffX, occCharacters[k][1][1] + posDiffY];
            const antinodeTwo : [number, number] = [occCharacters[j][1][0] - posDiffX, occCharacters[j][1][1] - posDiffY];

            if (!outOfGrid(antinodeOne[0], antinodeOne[1]) && !antiIncludes(antinodeOne))
                antinodes.push(antinodeOne);
            
            if (!outOfGrid(antinodeTwo[0], antinodeTwo[1]) && !antiIncludes(antinodeTwo))
                antinodes.push(antinodeTwo);
        }
    }
}

console.log(antinodes.length);