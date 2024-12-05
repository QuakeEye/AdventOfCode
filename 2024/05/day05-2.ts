const fs = require("fs");
const fileName = process.argv[2];
export {};

const fileContents : string = fs.readFileSync(fileName, "utf8");
const fileSplit = fileContents.split("\r\n\r\n");

const ruleLines: string[] = fileSplit[0].split("\r\n");
const updateLines: string[] = fileSplit[1].split("\r\n");

// Parse the rules
let rules: [before: number, after: number][] = [];

ruleLines.map((rule) => {
    const splitNumbers: string[] = rule.split("|");
    rules.push([parseInt(splitNumbers[0]), parseInt(splitNumbers[1])]);
});


// Parse the updates
let updates: number[][] = [];

updateLines.map((update) => {
    const splitNumbers: string[] = update.split(",");
    updates.push(splitNumbers.map((numStr) => parseInt(numStr)));
});


// Loop through updates
let correctUpdates: number[][] = [];
let incorrectUpdates: number[][] = [];

const checkIncorrect: (update: number[]) => [boolean, number, number] = (update: number[]) => {
    let breakingRule: boolean = false;
    let firstIndex: number, secondIndex: number;
    
    for (let i = 0; i < update.length - 1; i++) {
        const aNum: number = update[i];

        for (let j = i + 1; j < update.length; j++) {
            const bNum: number = update[j];

            rules.map((rule) => {
                if (aNum === rule[1] && bNum === rule[0]) {
                    breakingRule = true;   
                    firstIndex = i, secondIndex = j;
                }
            });

            if (breakingRule) break;
        }

        if (breakingRule) break;
    }

    return [breakingRule, firstIndex, secondIndex];
}

updates.map((update) => {
    let correctnessState: [boolean, number, number] = checkIncorrect(update);
    
    if (!correctnessState[0]) correctUpdates.push(update);
    else incorrectUpdates.push(update);
});


// Fix incorrect updates
let correctedUpdates: number[][] = [];

incorrectUpdates.map((update) => {
    let correctedUpdate: number[] = update;

    while (true) {
        let correctnessState: [boolean, number, number] = checkIncorrect(correctedUpdate);

        if (!correctnessState[0]) {
            correctedUpdates.push(correctedUpdate);
            return;
        }

        const temp: number = correctedUpdate[correctnessState[1]];
        correctedUpdate[correctnessState[1]] = correctedUpdate[correctnessState[2]];
        correctedUpdate[correctnessState[2]] = temp;
    }
});


// Calculate total
let total: number = 0;

correctedUpdates.map((update) => {
    total += update[Math.floor(update.length / 2)]
});

console.log(total);