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
let writePointer : number = 0;

while (writePointer < readPointer) {
    while (writePointer < readPointer && memory[writePointer] !== '.')
        writePointer++;

    while (writePointer < readPointer && memory[readPointer] === '.')
        readPointer--;

    if (writePointer >= readPointer) break;

    memory[writePointer] = memory[readPointer];
    memory[readPointer] = '.';
}


// Calculate checksum
let checksum : number = 0;

for (let i = 0; i < memory.length; i++) {
    if (memory[i] === '.') continue;

    checksum += i * parseInt(memory[i]);
}

console.log(checksum);