# Ask OxyGent

A Node.js toolkit for interacting with OxyGent framework

## Usage

```bash
npm i @bdsh/ask-oxygent
```

```typescript
import { fetchSSEAnswer } from "@bdsh/ask-oxygent";

export const doCalculate = async () => {
  const answer = await fetchSSEAnswer("http://you_ip:host/sse/chat", {
    query: "Compute the product of 3 and 4",
  });
  return answer;
};
```

## Development

- start the server

```bash
cd demo/server
uv run main.py
```

- run test

```bash
pnpm test run
```
