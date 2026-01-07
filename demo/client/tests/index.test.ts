import { expect, test } from "vitest";
import { doCalculate } from "../src";

test("doCalculate", async () => {
  const answer = await doCalculate();
  expect(answer).toMatch(/^12$/);
});
