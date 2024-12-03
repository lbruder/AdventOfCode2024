import fs from "node:fs";
import { assertEquals } from "jsr:@std/assert";

const testInput = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

interface Multiplication {
    a: number,
    b: number,
}

const reMuls = /(mul\((\d{1,3}),(\d{1,3})\))|(do\(\))|(don't\(\))/g;

function findMuls(input: string, handleDoDont: boolean): Multiplication[] {
    const ret: Multiplication[] = [];
    let enableMuls = true;
    for (let m = reMuls.exec(input); m; m = reMuls.exec(input)) {
        if (m[0] == "do()") {
            if (handleDoDont) enableMuls = true;
        } else if (m[0] == "don't()") {
            if (handleDoDont) enableMuls = false;
        } else {
            if (enableMuls) ret.push({ a: parseInt(m[2]), b: parseInt(m[3]) });
        }
    }
    return ret;
}

Deno.test("findMuls should return the correct values for the test input ", () => {
    const muls = findMuls(testInput, false);

    assertEquals(muls.length, 4);

    assertEquals(muls[0], { a: 2, b: 4 });
    assertEquals(muls[1], { a: 5, b: 5 });
    assertEquals(muls[2], { a: 11, b: 8 });
    assertEquals(muls[3], { a: 8, b: 5 });
});

const muls = findMuls(fs.readFileSync("input.txt").toString(), false);
console.log(muls.map(i => i.a * i.b).reduce((a, b) => a + b));

// Part 2

const muls2 = findMuls(fs.readFileSync("input.txt").toString(), true);
console.log(muls2.map(i => i.a * i.b).reduce((a, b) => a + b));
