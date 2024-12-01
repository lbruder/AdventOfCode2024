import fs from "node:fs";
import { assertEquals } from "jsr:@std/assert";

const testInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`;

function getLists(input: string): { list1: number[], list2: number[] } {
    const lines = input.split("\n").map(line => line.trim());
    const lists = lines.map(line => line.split(/\s+/)).filter(items => items.length === 2);
    const list1 = lists.map(items => parseFloat(items[0]));
    const list2 = lists.map(items => parseFloat(items[1]));
    list1.sort();
    list2.sort();
    return { list1, list2 };
}

Deno.test("getLists returns the correct lists for the test input", () => {
    const lists = getLists(testInput);
    assertEquals(lists.list1, [1, 2, 3, 3, 3, 4]);
    assertEquals(lists.list2, [3, 3, 3, 4, 5, 9]);
});

function getDistances(list1: number[], list2: number[]): number[] {
    if (list1.length != list2.length) throw new Error("list1 and list2 have different lengths");
    const ret: number[] = [];
    for (let i = 0; i < list1.length; i++) {
        ret.push(Math.abs(list1[i] - list2[i]));
    }
    return ret;
}

Deno.test("getDistances returns the correct distances for the test input", () => {
    const lists = getLists(testInput);
    const distances = getDistances(lists.list1, lists.list2);
    assertEquals(distances, [2, 1, 0, 1, 2, 5]);
});

Deno.test("example yields correct value for first part", () => {
    const lists = getLists(testInput);
    const distances = getDistances(lists.list1, lists.list2);
    assertEquals(distances.reduce((a, b) => a + b), 11);
});

const lists = getLists(fs.readFileSync("input.txt").toString());
const distances = getDistances(lists.list1, lists.list2);
console.log(distances.reduce((a, b) => a + b));

// Part 2

function getSimilarityScores(list1: number[], list2: number[]): number[] {
    if (list1.length != list2.length) throw new Error("list1 and list2 have different lengths");
    const ret: number[] = [];
    for (const i of list1) {
        const score = list2.filter(j => i == j).length * i; // PERFORMANCE: Speed up with a dictionary if necessary
        ret.push(score);
    }
    return ret;
}

Deno.test("getSimilarityScores returns the correct distances for the test input", () => {
    const lists = getLists(testInput);
    const similarityScores = getSimilarityScores(lists.list1, lists.list2);
    assertEquals(similarityScores, [0, 0, 9, 9, 9, 4]);
});

Deno.test("example yields correct value for second part", () => {
    const lists = getLists(testInput);
    const similarityScores = getSimilarityScores(lists.list1, lists.list2);
    assertEquals(similarityScores.reduce((a, b) => a + b), 31);
});

const similarityScores = getSimilarityScores(lists.list1, lists.list2);
console.log(similarityScores.reduce((a, b) => a + b));
