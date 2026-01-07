import { fetchSSEAnswer } from "@bdsh/ask-oxygent";

export const doCalculate = async () => {
  const answer = await fetchSSEAnswer("http://0.0.0.0:8080/sse/chat", {
    query: "Compute the product of 3 and 4",
  });
  return answer;
};
