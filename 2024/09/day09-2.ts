const fs = require("fs");
const fileName = process.argv[2];
export {};

let fileContents : string = fs.readFileSync(fileName, "utf8");


// Parse
let memory : string[] = [];
let isFile : boolean = true;
let currentID : number = 0;

const pushMemory = (amt: number, content: string) => {
    for (let i = 0; i < amt; i++) memory.push(content);
}

fileContents.split("").map((character) => {
    const amount : number = parseInt(character);
    
    if (isFile) {
        pushMemory(amount, currentID.toString());
        currentID++;
    } else pushMemory(amount, '.');

    isFile = !isFile;
});


// Move blocks
let readPointer : number = memory.length - 1;
let lowestID : number = Number.MAX_VALUE;

type Block = {
    startPointer: number,
    endPointer: number,
    character: string
} | null;

const readBlock : () => Block = () => {
    if (readPointer < 0) return null;
    
    const readingCharacter : string = memory[readPointer];
    const blockEndPointer : number = readPointer;

    while (memory[readPointer] === readingCharacter) readPointer--;

    return {
        startPointer: readPointer + 1, 
        endPointer: blockEndPointer, 
        character: readingCharacter
    }
};

const doesBlockFit : (block: Block) => Block = (block: Block) => {
    let checkPointer : number = 0;
    let blockStartPointer : number = 0;

    while (checkPointer <= readPointer) {
        while (memory[checkPointer] !== '.') checkPointer++;
        
        blockStartPointer = checkPointer;
        
        while (memory[checkPointer] === '.') checkPointer++;

        if ((checkPointer - 1) - blockStartPointer >= block.endPointer - block.startPointer) return {
            startPointer: blockStartPointer,
            endPointer: checkPointer - 1,
            character: '.'
        }
    }

    return null;
};

const moveBlock : (from: Block, to: Block) => void = (from: Block, to: Block) => {
    for (let i = 0; i <= (from.endPointer - from.startPointer); i++) {
        memory[to.startPointer + i] = memory[from.startPointer + i];
        memory[from.startPointer + i] = '.';
    }
}

while (readPointer >= 0) {
    const from : Block = readBlock();
    if (from.character === '.') continue;

    const to : Block = doesBlockFit(from);
    if (to === null) continue;

    if (from.startPointer <= to.startPointer) continue;

    if (parseInt(from.character) >= lowestID) break;
    lowestID = parseInt(from.character);

    moveBlock(from, to);
}


// Calculate checksum
let checksum : number = 0;

for (let i = 0; i < memory.length; i++) {
    if (memory[i] === '.') continue;

    checksum += i * parseInt(memory[i]);
}

console.log(checksum);