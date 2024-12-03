const fs = require("fs");
const fileName = process.argv[2];


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




// Old non-functional solution (stopped before finishing part 1):

// // Set up variables
// let totalCount: number = 0;

// let mIndex: number = -1;
// let openIndex: number = -1;
// let closeIndex: number = -1;

// let expectedChars: any[] = ['m', 'u', 'l'];
// let expectationIndex: number = 0;

// let parsing: boolean = false;


// const reset = () => {
//     mIndex = -1;
//     openIndex = -1;
//     closeIndex = -1;
//     expectationIndex = 0;
//     parsing = false;
// }

// const numbersArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];


// // Parse input
// for (let i = 0; i < input.length; i++) {
//     if (parsing) {
//         if (openIndex !== -1) {
            
//             if (openIndex - mIndex === 3) { 
//                 reset();
//                 continue;
//             }
            
//             if (input[i] === ')') {
//                 closeIndex = i;

//                 // Logic for multiplying here
//                 const mult: string = input.slice(openIndex + 1, closeIndex);
//                 const numbers: string[] = mult.split(",");

//                 if (numbers.length !== 2 || Number.isNaN(numbers[0]) || Number.isNaN(numbers[1])) continue;

//                 let shouldContinue: boolean;

//                 for (let i = 0; i < numbers[0].length; i++)
//                     if (!numbersArr.includes(numbers[0][i])) shouldContinue = true;

//                 for (let i = 0; i < numbers[1].length; i++)
//                     if (!numbersArr.includes(numbers[1][i])) shouldContinue = true;

//                 if (shouldContinue) continue;

//                 const multResult: number = parseInt(numbers[0]) * parseInt(numbers[1]);
                
//                 totalCount += multResult;

//                 console.log(mult, multResult, totalCount);

//                 reset();
//             }
//         }
        
//         if (input[i] === '(') openIndex = i;
//     }

//     if (input[i] === expectedChars[expectationIndex]) {
//         if (expectationIndex === 0) mIndex = i;
        
//         expectationIndex++;

//         if (expectationIndex >= expectedChars.length) {
//             parsing = true;
//             expectationIndex = 0;
//         }
//     } else expectationIndex = 0;
// }

// console.log(totalCount);