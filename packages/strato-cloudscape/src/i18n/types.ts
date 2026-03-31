export interface MessageProps {
  children: string;
  /**
   * Explicit stable message ID. Used directly as the lookup key — bypasses
   * hashing entirely. Takes priority over `context`. Written as `#. id: <id>`
   * in PO files so translators see the stable identifier alongside the source text.
   */
  id?: string;
  /**
   * Disambiguation context. Prepended to the message before hashing so that
   * the same string in different contexts produces different translation entries.
   * Ignored when `id` is provided. Stored as `msgctxt` in PO files.
   */
  context?: string;
  /** Translator note written into the PO file as a `#` comment. Ignored at runtime. */
  comment?: string;
  /** ICU variables substituted into the message at runtime. */
  vars?: Record<string, any>;
}
