import { fetchSSEAnswer } from "../../../dist";

export const myFunction = async () => {
  const answer = await fetchSSEAnswer("http://0.0.0.0:8080/sse/chat", {
    query: `计算 3 和 4 的乘积`,
  });
  return answer;
};
