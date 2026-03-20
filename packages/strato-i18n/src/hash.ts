/**
 * Simple FNV-1a hash for generating stable message IDs.
 * This is lightweight and works identically in Node and the Browser.
 */
export function generateMessageId(msg: string): string {
  const normalized = normalizeMessage(msg);
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    // FNV-1a prime multiplication (hash * 16777619)
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  // Convert to a base36 string for a compact, stable ID
  return (hash >>> 0).toString(36);
}

/**
 * Normalizes a message string by collapsing multiple whitespaces and newlines.
 * This ensures that formatting changes in the source code do not change the message ID.
 */
export function normalizeMessage(msg: string): string {
  return msg.replace(/\s+/g, ' ').trim();
}
