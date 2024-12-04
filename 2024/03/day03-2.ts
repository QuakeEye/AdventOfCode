const fs = require("fs");
const fileName = process.argv[2];
export {};


// Handle importing
let input: string = "";

const fileContents : string = fs.readFileSync(fileName, "utf8");

fileContents.split("\n").map((line: string) => {
    input += line;
});

let match: RegExpExecArray | null;


// Custom types
enum entryType {
    mulMatch,
    dontMatch,
    doMatch
}

type indexEntry = [
    index: number,
    matchType: entryType,
    numbers?: number[]
]


// Variables
const regex = new RegExp("mul\\(\\d+,\\d+\\)", "g");
const dontRegex = new RegExp("don't\\(\\)", "g");
const doRegex = new RegExp("do\\(\\)", "g");
const numbersRegex = new RegExp("\\d+,\\d+");

let mulMatches: indexEntry[] = [];
let dontMatches: indexEntry[] = [];
let doMatches: indexEntry[] = [];

let totalCounter = 0;


// Parse the input and fill arrays
while ((match = regex.exec(fileContents)) !== null) {
    if(match === null) break;

    const numbersString: string = numbersRegex.exec(match[0])[0];
    const numbers: number[] = numbersString.split(',').map((strNum) => parseInt(strNum));
    
    mulMatches = mulMatches.concat([[match.index, entryType.mulMatch, numbers]]);
}

while ((match = dontRegex.exec(fileContents)) !== null) {
    if(match === null) break;

    dontMatches = dontMatches.concat([[match.index, entryType.dontMatch]]);
}

while ((match = doRegex.exec(fileContents)) !== null) {
    if(match === null) break;

    doMatches = doMatches.concat([[match.index, entryType.doMatch]]);
}


// Move through sorted array to perform multiplications when possible
let indexArr: indexEntry[] = [];

indexArr = indexArr.concat(mulMatches).concat(dontMatches).concat(doMatches);
indexArr = indexArr.sort((a, b) => a[0] - b[0]);

let doing: boolean = true;

for (let i = 0; i < indexArr.length; i++) {
    if (indexArr[i][1] === entryType.mulMatch && doing) {
        const numbers: number[] = indexArr[i][2];
        totalCounter += numbers[0] * numbers[1];
    }

    if (indexArr[i][1] === entryType.doMatch) doing = true;

    if (indexArr[i][1] === entryType.dontMatch) doing = false;
}

console.log(totalCounter);