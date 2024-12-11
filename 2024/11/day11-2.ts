const fs = require("fs");
const fileName = process.argv[2];
export {};

let fileContents : string = fs.readFileSync(fileName, "utf8");


// Parse stones
let stones : number[] = [];

fileContents.split(" ").map((strStone) => {
    stones.push(parseInt(strStone));
});


// Keep blinking
const blinks = 75;

const handleStone : (stone: number) => number[] = (stone: number) => {
    // Rule 1
    if (stone === 0) return [1];

    // Rule 2
    const strStone = stone.toString();
    if (strStone.length % 2 === 0)
        return [
            parseInt(strStone.slice(0, strStone.length / 2)),
            parseInt(strStone.slice(strStone.length / 2))
        ];

    // Rule 3
    return [stone * 2024];
};

const blink : (stones: number[]) => Map<number, number> = (stones) => {
    const stoneMap = new Map<number, number>(stones.map((stone) => [stone, 1]));

    for (let i = 0; i < blinks; i++) {
        const oldStones = new Map<number, number>(stoneMap);
    
        stoneMap.clear();
    
        for (const [stone, count] of oldStones) {
            const newStones = handleStone(stone);

            newStones.map((newStone) => {
                stoneMap.set(newStone, (stoneMap.get(newStone) || 0) + count)
            });
        }
    }

    return stoneMap;
}


let totalCount: number = 0;
for (const count of blink(stones).values()) totalCount += count;

console.log(totalCount);