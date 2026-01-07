import { expect, test } from "vitest";
import { fetchSSEAnswer } from "../src";

export const doCalculate = async () => {
  const answer = await fetchSSEAnswer("http://0.0.0.0:8080/sse/chat", {
    query: "Compute the product of 3 and 4",
  });
  return answer;
};

test("doCalculate", async () => {
  const answer = await doCalculate();
  expect(answer).toMatch(/^12$/);
});
