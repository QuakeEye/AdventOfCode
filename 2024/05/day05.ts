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

updates.map((update) => {
    let breakingRule: boolean = false;
    
    for (let i = 0; i < update.length - 1; i++) {
        const aNum: number = update[i];

        for (let j = i + 1; j < update.length; j++) {
            const bNum: number = update[j];

            rules.map((rule) => {
                if (aNum === rule[1] && bNum === rule[0]) breakingRule = true;
            });
        }
    }

    if (!breakingRule) correctUpdates.push(update);
});


// Calculate total
let total: number = 0;

correctUpdates.map((update) => {
    total += update[Math.floor(update.length / 2)]
});

console.log(total);