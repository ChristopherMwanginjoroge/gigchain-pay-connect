/**
 * Browser polyfills for Node.js APIs used by Solana libraries
 * This file must be imported before any Solana imports
 */
import { Buffer } from "buffer";

// Set Buffer on globalThis and window
globalThis.Buffer = Buffer;
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

export { Buffer };
