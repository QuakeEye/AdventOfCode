const fileName = process.argv[2];
const fs = require("fs");

const input = fs.readFileSync(fileName, "utf8");
fs.writeFileSync("02/debug_output.txt", "");        // Very unsafe relative path look this...

let reports = input.split("\n").map((report) => {
    return report.split(" ").map((level) => parseInt(level));
});

const safeDiff = [1, 2, 3];

const safeCheck = (report, safe) => {
    if (report[1] > report[0]) {
        for (let i = 1; i < report.length; i++) {
            if (report[i] === report[i-1]) safe = false;

            const diff = report[i] - report[i - 1];
            if (!safeDiff.includes(diff)) safe = false;
        }
    } else {
        for (let i = 1; i < report.length; i++) {
            if (report[i] === report[i - 1]) safe = false;

            const diff = report[i - 1] - report[i];
            if (!safeDiff.includes(diff)) safe = false;
        }
    }

    return safe;
};

// Map to either true or false for 'safe' property
reports = reports.map((report) => safeCheck(report, true))

const safes = reports.filter((report) => report === true);
console.log(safes.length);