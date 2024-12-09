const printStrArr = (arr: string[]) => {
    var output = "";
    for (let i = 0; i < arr.length; i++) output += arr[i];
    console.log(output);
}

export {
    printStrArr
}