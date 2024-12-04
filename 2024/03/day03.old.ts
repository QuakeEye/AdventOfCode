// Old non-functional solution (stopped before finishing part 1)

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