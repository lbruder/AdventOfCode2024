import fs from "node:fs";
import { assertEquals } from "jsr:@std/assert";

const testInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

class Report {
    private readonly levels: number[];

    constructor(levels: number[]) {
        this.levels = levels;
    }

    getLevels(): number[] {
        return [...this.levels];
    }

    isSafe(allowSingleSkip: boolean): boolean {
        const safeWithout = Report.isSafeWithoutDampener(this.levels);

        if (safeWithout) return safeWithout;
        if (!allowSingleSkip) return safeWithout;

        // PERFORMANCE: Horribly slow, but simple to implement. Improve algorithm if necessary.
        for (let i=0; i<this.levels.length; i++) {
            const tmpLevels = [...this.levels];
            tmpLevels.splice(i, 1);
            if (Report.isSafeWithoutDampener(tmpLevels)) return true;
        }

        return false;
    }

    static isSafeWithoutDampener(levels: number[]): boolean {
        if (levels.length < 2) return true;

        let allAscending = true;
        let allDescending = true;
        let lastNumber = levels[0];
        for (const i of levels.slice(1)) {
            const diff = Math.abs(i - lastNumber);
            if (diff < 1 || diff > 3) return false;
            if (i > lastNumber) allDescending = false;
            if (i < lastNumber) allAscending = false;
            lastNumber = i;
        }
        return allAscending || allDescending;
    }
}

function getReports(input: string): Report[] {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line != "");
    return lines.map(line => new Report(line.split(/\s+/).map(i => parseFloat(i))));
}

Deno.test("getReports should return the correct values for the test input", () => {
    const reports = getReports(testInput);

    assertEquals(reports.length, 6);

    assertEquals(reports[0].getLevels(), [7, 6, 4, 2, 1]);
    assertEquals(reports[1].getLevels(), [1, 2, 7, 8, 9]);
    assertEquals(reports[2].getLevels(), [9, 7, 6, 2, 1]);
    assertEquals(reports[3].getLevels(), [1, 3, 2, 4, 5]);
    assertEquals(reports[4].getLevels(), [8, 6, 4, 4, 1]);
    assertEquals(reports[5].getLevels(), [1, 3, 6, 7, 9]);

    assertEquals(reports[0].isSafe(false), true);
    assertEquals(reports[1].isSafe(false), false);
    assertEquals(reports[2].isSafe(false), false);
    assertEquals(reports[3].isSafe(false), false);
    assertEquals(reports[4].isSafe(false), false);
    assertEquals(reports[5].isSafe(false), true);

    assertEquals(reports.filter(report => report.isSafe(false)).length, 2);
});

const reports = getReports(fs.readFileSync("input.txt").toString());
console.log(reports.filter(report => report.isSafe(false)).length);

// Part 2

Deno.test("isSafePart2 should return the correct values for the test input ", () => {
    const reports = getReports(testInput);

    assertEquals(reports.length, 6);

    assertEquals(reports[0].isSafe(true), true);
    assertEquals(reports[1].isSafe(true), false);
    assertEquals(reports[2].isSafe(true), false);
    assertEquals(reports[3].isSafe(true), true);
    assertEquals(reports[4].isSafe(true), true);
    assertEquals(reports[5].isSafe(true), true);

    assertEquals(reports.filter(report => report.isSafe(true)).length, 4);
});

console.log(reports.filter(report => report.isSafe(true)).length);
