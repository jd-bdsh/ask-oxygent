import { expect, test } from "vitest";
import { myFunction } from "../src";

test("myFunction", async () => {
  const answer = await myFunction();
  expect(answer).toMatch(/^12$/);
});
