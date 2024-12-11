const printStrArr = (arr: string[]) => {
    let output = "";
    for (let i = 0; i < arr.length; i++) output += arr[i];
    console.log(output);
}

export {
    printStrArr
}