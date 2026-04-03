import { describe, it, expect } from 'vitest';
import * as t from '@babel/types';
import { generateMessageId, normalizeMessage } from '@strato-admin/i18n';
import { getJSXElementName, extractMessagesFromSource } from './extract';

const DEFAULT_CONFIG = {
  components: new Set([
    'Button',
    'TextField',
    'TextInput',
    'Table',
    'Table.Col',
    'ResourceSchema',
    'List',
    'Create',
    'Edit',
  ]),
  translatableProps: new Set(['label', 'title', 'placeholder', 'emptyText', 'helperText']),
};

describe('getJSXElementName', () => {
  it('returns name for JSXIdentifier', () => {
    const node = t.jsxIdentifier('Button');
    expect(getJSXElementName(node)).toBe('Button');
  });

  it('returns dotted name for JSXMemberExpression', () => {
    const node = t.jsxMemberExpression(t.jsxIdentifier('Table'), t.jsxIdentifier('Col'));
    expect(getJSXElementName(node)).toBe('Table.Col');
  });

  it('returns colon-separated name for JSXNamespacedName', () => {
    const node = t.jsxNamespacedName(t.jsxIdentifier('ns'), t.jsxIdentifier('name'));
    expect(getJSXElementName(node)).toBe('ns:name');
  });
});

describe('extractMessagesFromSource — function calls', () => {
  it('extracts from translate("Hello")', () => {
    const src = `translate("Hello");`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const values = [...messages.values()];
    expect(values).toHaveLength(1);
    expect(values[0].msgid).toBe('Hello');
    expect(values[0].msgctxt).toBeUndefined();
  });

  it('extracts from translateLabel("Click me")', () => {
    const src = `translateLabel("Click me");`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const values = [...messages.values()];
    expect(values).toHaveLength(1);
    expect(values[0].msgid).toBe('Click me');
  });

  it('extracts default text from translate("key.id", { _: "Default text" })', () => {
    const src = `translate("key.id", { _: "Default text" });`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const values = [...messages.values()];
    expect(values).toHaveLength(1);
    expect(values[0].msgid).toBe('Default text');
    expect(values[0].msgctxt).toBe('key.id');
  });

  it('extracts from template literal translate(`Hello`)', () => {
    const src = 'translate(`Hello`);';
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const values = [...messages.values()];
    expect(values).toHaveLength(1);
    expect(values[0].msgid).toBe('Hello');
  });

  it('does not extract from non-matching function t("Hello")', () => {
    const src = `t("Hello");`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect(messages.size).toBe(0);
  });

  it('records the source file and line in locations', () => {
    const src = `translate("Hello");`;
    const messages = extractMessagesFromSource(src, 'src/comp.tsx', DEFAULT_CONFIG);
    const [msg] = [...messages.values()];
    expect([...msg.locations][0]).toMatch(/^src\/comp\.tsx:\d+$/);
  });
});

describe('extractMessagesFromSource — JSX props', () => {
  it('extracts string literal prop: <Button label="Click me" />', () => {
    const src = `<Button label="Click me" />;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const values = [...messages.values()];
    expect(values).toHaveLength(1);
    expect(values[0].msgid).toBe('Click me');
  });

  it('extracts expression container string: <Button label={"Click me"} />', () => {
    const src = `<Button label={"Click me"} />;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect([...messages.values()][0].msgid).toBe('Click me');
  });

  it('extracts template literal prop: <Button label={`Click me`} />', () => {
    const src = 'const x = <Button label={`Click me`} />;';
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect([...messages.values()][0].msgid).toBe('Click me');
  });

  it('does not extract empty string prop: <Button label="" />', () => {
    const src = `<Button label="" />;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect(messages.size).toBe(0);
  });

  it('does not extract from unlisted component: <div label="test" />', () => {
    const src = `<div label="test" />;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect(messages.size).toBe(0);
  });

  it('extracts from member expression component: <Table.Col label="Name" />', () => {
    const src = `<Table.Col label="Name" />;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect([...messages.values()][0].msgid).toBe('Name');
  });

  it('extracts from a custom component added via config', () => {
    const config = {
      components: new Set([...DEFAULT_CONFIG.components, 'MyWidget']),
      translatableProps: new Set([...DEFAULT_CONFIG.translatableProps]),
    };
    const src = `<MyWidget label="Custom label" />;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', config);
    expect([...messages.values()][0].msgid).toBe('Custom label');
  });
});

describe('extractMessagesFromSource — JSX children components', () => {
  it('extracts from <Message>Hello world</Message>', () => {
    const src = `<Message>Hello world</Message>;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect(messages.size).toBe(1);
    expect([...messages.values()][0].msgid).toBe('Hello world');
  });

  it('uses explicit id as precomputedHash: <Message id="action.save">Save</Message>', () => {
    const src = `<Message id="action.save">Save</Message>;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const [msg] = [...messages.values()];
    expect(msg.precomputedHash).toBe('action.save');
    expect(msg.msgctxt).toBeUndefined();
  });

  it('computes context hash: <Message context="nav">Home</Message>', () => {
    const src = `<Message context="nav">Home</Message>;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const [msg] = [...messages.values()];
    const expectedHash = generateMessageId(`nav\x04${normalizeMessage('Home')}`);
    expect(msg.precomputedHash).toBe(expectedHash);
    expect(msg.msgctxt).toBe('nav');
  });

  it('captures translator comment: <Message comment="Hint">Submit</Message>', () => {
    const src = `<Message comment="Hint for translators">Submit</Message>;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    const [msg] = [...messages.values()];
    expect(msg.translatorComment).toBe('Hint for translators');
  });

  it('extracts from <RecordMessage>Delete record</RecordMessage>', () => {
    const src = `<RecordMessage>Delete record</RecordMessage>;`;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect(messages.size).toBe(1);
    expect([...messages.values()][0].msgid).toBe('Delete record');
  });
});

describe('extractMessagesFromSource — deduplication', () => {
  it('deduplicates the same message appearing twice in one file, accumulating locations', () => {
    const src = `
      translate("Hello");
      translate("Hello");
    `;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect(messages.size).toBe(1);
    const [msg] = [...messages.values()];
    expect(msg.locations.size).toBe(2);
  });

  it('treats messages with different context as distinct', () => {
    const src = `
      translate("action.save", { _: "Save" });
      translate("action.cancel", { _: "Save" });
    `;
    const messages = extractMessagesFromSource(src, 'src/test.tsx', DEFAULT_CONFIG);
    expect(messages.size).toBe(2);
  });
});

describe('extractMessagesFromSource — error handling', () => {
  it('returns empty map for unparseable content without throwing', () => {
    const src = `this is not valid typescript !!!@@@`;
    expect(() => extractMessagesFromSource(src, 'src/bad.ts', DEFAULT_CONFIG)).not.toThrow();
    const messages = extractMessagesFromSource(src, 'src/bad.ts', DEFAULT_CONFIG);
    expect(messages.size).toBe(0);
  });
});
