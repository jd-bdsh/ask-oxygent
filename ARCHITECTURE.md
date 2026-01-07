# Architecture Documentation

## Overview

This module provides a utility function for extracting answer content from Server-Sent Events (SSE) streams. The main functionality is to establish a long connection, monitor the SSE stream in real-time, and immediately return the `content` field when encountering data of type `type=answer`, then close the connection.

## Core Design Principles

- **Early Return Optimization**: Immediately close the connection once the target answer is found, avoiding unnecessary resource consumption
- **Stream Processing**: Use ReadableStream to process data chunk by chunk, supporting large data streams
- **Type Safety**: Use TypeScript type guards to ensure runtime type safety
- **Error Handling**: Perform error checks and throw exceptions at critical points

## Architecture Components

### 1. Data Model

#### SSEData Interface

```typescript
interface SSEData {
  type?: string; // Data type identifier
  content?: string; // Content field
  [key: string]: unknown; // Allows other extended fields
}
```

### 2. Core Function Hierarchy

```
fetchSSEAnswer (Public API)
    ├── sendRequest (HTTP Request Layer)
    └── processSSEStream (Stream Processing Layer)
            ├── parseSSEDataLine (Data Parsing Layer)
            └── isAnswerType (Type Checking Layer)
```

### 3. Function Responsibilities

#### 3.1 `sendRequest` - HTTP Request Layer

- **Responsibility**: Send POST request and return response object
- **Input**: URL and POST data
- **Output**: Response object
- **Error Handling**: Check response status, throw error on failure

#### 3.2 `parseSSEDataLine` - SSE Data Parsing Layer

- **Responsibility**: Parse a single SSE data line and extract JSON object
- **Input**: SSE format string line
- **Output**: Parsed SSEData object or null
- **Processing Logic**:
  - Skip empty lines and comment lines (starting with `:`)
  - Only process data lines starting with `data: `
  - Return null on JSON parsing failure (fault-tolerant handling)

#### 3.3 `isAnswerType` - Type Guard

- **Responsibility**: Type-safely check if data is of answer type
- **Input**: SSEData or null
- **Output**: Type predicate, ensuring that when returning true, data contains content string
- **Check Conditions**:
  - data is not null
  - type === "answer"
  - content is of string type

#### 3.4 `processSSEStream` - Stream Processing Core

- **Responsibility**: Read and process SSE stream chunk by chunk, find answer data
- **Input**: ReadableStreamDefaultReader and TextDecoder
- **Output**: Answer content string or null
- **Key Mechanisms**:
  - **Buffer Management**: Use buffer to handle data lines across chunks
  - **Stream Decoding**: Use `stream: true` option to handle multi-byte characters
  - **Early Termination**: Immediately call `reader.cancel()` to close connection after finding answer

#### 3.5 `fetchSSEAnswer` - Public API

- **Responsibility**: Complete end-to-end process orchestration
- **Input**: URL and POST data
- **Output**: Answer content string
- **Process**:
  1. Send HTTP POST request
  2. Verify response body exists
  3. Create stream reader and text decoder
  4. Process SSE stream
  5. Verify answer exists and return

## Data Flow Diagram

```
User calls fetchSSEAnswer(url, postData)
    ↓
sendRequest: POST request → Get Response
    ↓
Verify response.body exists
    ↓
Create reader and decoder
    ↓
processSSEStream: Loop to read stream
    ↓
    Each read chunk → Decode → Split lines → Parse each line
    ↓
    parseSSEDataLine: Extract JSON data
    ↓
    isAnswerType: Check if it's an answer
    ↓
    Found answer → reader.cancel() → Return content
    ↓
Return answer or throw error
```

## Error Handling Strategy

1. **HTTP Request Failure**: `sendRequest` checks `response.ok`, throws status code error on failure
2. **Empty Response Body**: `fetchSSEAnswer` checks `response.body`, throws error if empty
3. **Answer Not Found**: When `processSSEStream` returns null, `fetchSSEAnswer` throws error
4. **JSON Parsing Failure**: `parseSSEDataLine` silently returns null, handled by upper layer

## Performance Optimizations

1. **Early Termination**: Immediately close connection after finding answer, avoiding reading unnecessary data
2. **Stream Processing**: Use ReadableStream to process chunk by chunk, controllable memory usage
3. **Buffer Management**: Properly handle data lines across chunks, avoiding data loss
4. **Fault-Tolerant Parsing**: Skip line on JSON parsing failure, doesn't affect overall flow

## Use Cases

- Extract specific type of response from SSE streams
- Scenarios requiring quick answer retrieval and connection closure
- Processing SSE streams that may contain multiple data types

## Dependencies

- **Runtime Dependencies**: fetch API (browser or Node.js 18+)
- **Type Dependencies**: TypeScript
- **No External Library Dependencies**: Pure native implementation

## Extensibility Considerations

- `SSEData` interface supports extended fields, adaptable to different SSE data formats
- Modular design facilitates individual testing of each function
- Type guard pattern facilitates future extension of other data type checks
