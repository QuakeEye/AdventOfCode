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
const blinks = 25;

for (let i = 0; i < blinks; i++) {
    let newStones : number[] = [];

    for (let j = 0; j < stones.length; j++) {
        const stone : number = stones[j];
        
        // Rule 1
        if (stone === 0) {
            newStones.push(1);
            continue;
        }


        // Rule 2
        const strStone = stone.toString();
        if (strStone.length % 2 === 0) {
            const strStoneLeft = strStone.slice(0, strStone.length / 2);
            const strStoneRight = strStone.slice(strStone.length / 2);

            newStones.push(parseInt(strStoneLeft));
            newStones.push(parseInt(strStoneRight));

            continue;
        }        


        // Rule 3
        newStones.push(stone * 2024);
    }

    stones = newStones;
}

console.log(stones.length);