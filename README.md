# Ask OxyGent

A Node.js toolkit for interacting with OxyGent framework, supporting streaming AI responses via SSE (Server-Sent Events).

## Installation

```bash
npm i @bdsh/ask-oxygent
```

Or using pnpm:

```bash
pnpm add @bdsh/ask-oxygent
```

## Usage

```typescript
import { fetchSSEAnswer } from "@bdsh/ask-oxygent";

export const doCalculate = async () => {
  const answer = await fetchSSEAnswer("http://your_ip:port/sse/chat", {
    query: "Compute the product of 3 and 4",
  });
  return answer;
};
```

## API

### `fetchSSEAnswer(url, postData)`

Extracts answer content from SSE stream.

**Parameters:**

- `url` (string): SSE endpoint URL
- `postData` (Record<string, unknown>): POST request data, typically contains a `query` field

**Returns:**

- `Promise<string>`: Returns the answer content as a string

**Notes:**

- The function establishes a long connection and returns immediately when encountering data with `type=answer`, then closes the connection
- Throws an error if answer type data is not found

## Development

### Start the server

```bash
cd demo/server
uv run main.py
```

### Run tests

```bash
pnpm test
```

### Build

```bash
pnpm build
```

## License

MIT
