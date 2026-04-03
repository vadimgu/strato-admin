import { describe, it, expect } from 'vitest';
import * as gettextParser from 'gettext-parser';
import { buildCompiledMapping, parsePoContent } from './compile';

describe('buildCompiledMapping', () => {
  it('uses translation field when present', () => {
    const result = buildCompiledMapping({
      hash1: { translation: 'Hello', defaultMessage: 'Hello' },
    });
    expect(result).toEqual({ hash1: 'Hello' });
  });

  it('falls back to defaultMessage when translation is empty', () => {
    const result = buildCompiledMapping({
      hash1: { translation: '', defaultMessage: 'Default text' },
    });
    expect(result).toEqual({ hash1: 'Default text' });
  });

  it('falls back to defaultMessage when translation is whitespace-only', () => {
    const result = buildCompiledMapping({
      hash1: { translation: '   ', defaultMessage: 'Default text' },
    });
    expect(result).toEqual({ hash1: 'Default text' });
  });

  it('handles formatjs string-value format', () => {
    const result = buildCompiledMapping({ key: 'Hello world' });
    expect(result).toEqual({ key: 'Hello world' });
  });

  it('returns empty object for empty input', () => {
    expect(buildCompiledMapping({})).toEqual({});
  });

  it('returns keys in sorted order', () => {
    const result = buildCompiledMapping({
      zzz: { translation: 'Last', defaultMessage: 'Last' },
      aaa: { translation: 'First', defaultMessage: 'First' },
      mmm: { translation: 'Middle', defaultMessage: 'Middle' },
    });
    expect(Object.keys(result)).toEqual(['aaa', 'mmm', 'zzz']);
  });

  it('normalizes whitespace in translation values', () => {
    const result = buildCompiledMapping({
      hash1: { translation: 'Hello   World', defaultMessage: '' },
    });
    expect(result).toEqual({ hash1: 'Hello World' });
  });

  it('normalizes whitespace in defaultMessage fallback', () => {
    const result = buildCompiledMapping({
      hash1: { translation: '', defaultMessage: 'Hello\n  World' },
    });
    expect(result).toEqual({ hash1: 'Hello World' });
  });
});

describe('parsePoContent', () => {
  function buildPo(entries: Array<{ msgid: string; msgstr: string; msgctxt?: string; extractedComment?: string }>) {
    const translations: Record<string, Record<string, any>> = {
      '': { '': { msgid: '', msgstr: [''] } },
    };

    for (const entry of entries) {
      const context = entry.msgctxt ?? '';
      if (!translations[context]) translations[context] = {};
      translations[context][entry.msgid] = {
        msgid: entry.msgid,
        msgctxt: entry.msgctxt,
        msgstr: [entry.msgstr],
        comments: entry.extractedComment ? { extracted: entry.extractedComment } : undefined,
      };
    }

    return gettextParser.po.compile({
      charset: 'utf-8',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      translations,
    });
  }

  it('uses #. id: comment hash as key', () => {
    const buf = buildPo([{ msgid: 'Hello', msgstr: 'Bonjour', extractedComment: 'id: abc123' }]);
    const result = parsePoContent(buf);
    expect(result['abc123']).toBeDefined();
    expect(result['abc123'].translation).toBe('Bonjour');
  });

  it('falls back to msgctxt when no #. id: comment', () => {
    const buf = buildPo([{ msgid: 'Hello', msgstr: 'Bonjour', msgctxt: 'greetings' }]);
    const result = parsePoContent(buf);
    expect(result['greetings']).toBeDefined();
    expect(result['greetings'].translation).toBe('Bonjour');
  });

  it('falls back to msgid when no context and no comment', () => {
    const buf = buildPo([{ msgid: 'Hello', msgstr: 'Bonjour' }]);
    const result = parsePoContent(buf);
    expect(result['Hello']).toBeDefined();
    expect(result['Hello'].translation).toBe('Bonjour');
  });

  it('sets empty translation when msgstr is empty', () => {
    const buf = buildPo([{ msgid: 'Untranslated', msgstr: '' }]);
    const result = parsePoContent(buf);
    expect(result['Untranslated'].translation).toBe('');
  });

  it('skips the PO header entry (empty msgid)', () => {
    const buf = buildPo([{ msgid: 'Hello', msgstr: 'Bonjour' }]);
    const result = parsePoContent(buf);
    expect(result['']).toBeUndefined();
  });

  it('stores defaultMessage from msgid', () => {
    const buf = buildPo([{ msgid: 'Hello', msgstr: 'Bonjour' }]);
    const result = parsePoContent(buf);
    expect(result['Hello'].defaultMessage).toBe('Hello');
  });
});
