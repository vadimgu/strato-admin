#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as gettextParser from 'gettext-parser';
import { generateMessageId, normalizeMessage, prettyPrintICU } from '@strato-admin/i18n';
import { minimatch } from 'minimatch';

// Components whose JSX children text is the translatable string (source-as-key)
const CHILDREN_AS_KEY_COMPONENTS = new Set(['Message', 'RecordMessage']);

// List of Strato Admin components to extract from
const DEFAULT_STRATO_COMPONENTS = new Set([
  'ArrayField',
  'AttributeEditor',
  'AutocompleteInput',
  'BooleanField',
  'BulkDeleteButton',
  'Button',
  'Create',
  'CreateButton',
  'DateField',
  'Edit',
  'EditButton',
  'FormField',
  'List',
  'NumberField',
  'NumberInput',
  'ReferenceField',
  'ReferenceInput',
  'ReferenceManyField',
  'Resource',
  'ResourceSchema',
  'SaveButton',
  'SelectInput',
  'Show',
  'StatusIndicatorField.Label',
  'Table',
  'Table.Col',
  'TextAreaInput',
  'TextField',
  'TextInput',
]);

// List of translatable props
const DEFAULT_TRANSLATABLE_PROPS = new Set([
  'label',
  'listLabel',
  'createLabel',
  'editLabel',
  'detailLabel',
  'title',
  'listTitle',
  'createTitle',
  'editTitle',
  'detailTitle',
  'placeholder',
  'emptyText',
  'helperText',
  'description',
  'listDescription',
  'createDescription',
  'editDescription',
  'detailDescription',
  'saveButtonLabel',
  'successMessage',
  'errorMessage',
]);

interface Config {
  components?: string[];
  translatableProps?: string[];
}

function loadConfig(configPath?: string): { components: Set<string>; translatableProps: Set<string> } {
  const components = new Set(DEFAULT_STRATO_COMPONENTS);
  const translatableProps = new Set(DEFAULT_TRANSLATABLE_PROPS);

  const resolvedConfigPath = configPath || path.join(process.cwd(), 'strato-i18n.config.json');

  if (fs.existsSync(resolvedConfigPath)) {
    try {
      const config: Config = JSON.parse(fs.readFileSync(resolvedConfigPath, 'utf8'));

      if (config.components) {
        config.components.forEach((c) => components.add(c));
      }
      if (config.translatableProps) {
        config.translatableProps.forEach((p) => translatableProps.add(p));
      }
      console.log(`Loaded configuration from ${resolvedConfigPath}`);
    } catch (e: any) {
      console.error(`Failed to parse configuration file at ${resolvedConfigPath}:`, e.message);
    }
  }

  return { components, translatableProps };
}

export function getJSXElementName(node: t.JSXOpeningElement['name']): string {
  if (t.isJSXIdentifier(node)) {
    return node.name;
  }
  if (t.isJSXMemberExpression(node)) {
    return `${getJSXElementName(node.object)}.${node.property.name}`;
  }
  if (t.isJSXNamespacedName(node)) {
    return `${node.namespace.name}:${node.name.name}`;
  }
  return '';
}

function parseArgs() {
  const args = process.argv.slice(2);
  let format: string | undefined = undefined;
  let config: string | undefined = undefined;
  let outFile: string | undefined = undefined;
  let locale: string | undefined = undefined;
  const ignorePatterns: string[] = [];
  const positionalArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--format' || args[i] === '-f') && i + 1 < args.length) {
      format = args[i + 1];
      i++;
    } else if (args[i].startsWith('--format=')) {
      format = args[i].split('=')[1];
    } else if (args[i] === '--config' && i + 1 < args.length) {
      config = args[i + 1];
      i++;
    } else if (args[i].startsWith('--config=')) {
      config = args[i].split('=')[1];
    } else if ((args[i] === '--out-file' || args[i] === '-o') && i + 1 < args.length) {
      outFile = args[i + 1];
      i++;
    } else if (args[i].startsWith('--out-file=')) {
      outFile = args[i].split('=')[1];
    } else if ((args[i] === '--locale' || args[i] === '-l') && i + 1 < args.length) {
      locale = args[i + 1];
      i++;
    } else if (args[i].startsWith('--locale=')) {
      locale = args[i].split('=')[1];
    } else if ((args[i] === '--ignore' || args[i] === '-i') && i + 1 < args.length) {
      ignorePatterns.push(args[i + 1]);
      i++;
    } else if (args[i].startsWith('--ignore=')) {
      ignorePatterns.push(args[i].split('=')[1]);
    } else {
      positionalArgs.push(args[i]);
    }
  }

  const srcPattern = positionalArgs[0] || 'src/**/*.{ts,tsx}';
  let outDir = 'locales';
  let localeArgs: string[] = [];

  if (positionalArgs.length > 1) {
    if (positionalArgs[1].includes('*')) {
      // First target is a glob, so we treat ALL subsequent args as targets
      outDir = '.';
      localeArgs = positionalArgs.slice(1);
    } else {
      // First target is a directory
      outDir = positionalArgs[1];
      localeArgs = positionalArgs.slice(2);
      if (localeArgs.length === 0) {
        localeArgs = ['en'];
      }
    }
  } else {
    localeArgs = ['en'];
  }

  return { srcPattern, outDir, localeArgs, format, config, outFile, ignorePatterns, locale };
}

export interface ExtractedMessage {
  msgid: string;
  msgctxt?: string;
  /** Pre-computed hash or explicit id, written to `#. id:` and used as the compiled JSON key. */
  precomputedHash?: string;
  locations: Set<string>;
  translatorComment?: string;
}

export function extractMessagesFromSource(
  content: string,
  relativeFile: string,
  config: { components: Set<string>; translatableProps: Set<string> },
): Map<string, ExtractedMessage> {
  const { components, translatableProps } = config;
  const extractedMessages = new Map<string, ExtractedMessage>();

  const addExtractedMessage = (
    msgid: string,
    msgctxt: string | undefined,
    location: string,
    translatorComment?: string,
    precomputedHash?: string,
  ) => {
    const normalizedMsgid = normalizeMessage(msgid);
    const prettyMsgid = prettyPrintICU(msgid);
    const key = precomputedHash ? `hash:${precomputedHash}` : msgctxt ? `ctx:${msgctxt}` : `msg:${normalizedMsgid}`;

    if (!extractedMessages.has(key)) {
      extractedMessages.set(key, {
        msgid: prettyMsgid,
        msgctxt,
        precomputedHash,
        locations: new Set(),
        translatorComment,
      });
    }
    extractedMessages.get(key)!.locations.add(location);
  };

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy'],
    });

    traverse(ast, {
      CallExpression(p) {
        const { callee, arguments: args } = p.node;
        if (
          t.isIdentifier(callee) &&
          (callee.name === 'translate' || callee.name === 'translateLabel') &&
          args.length > 0
        ) {
          const firstArg = args[0];
          let firstArgValue: string | null = null;
          if (t.isStringLiteral(firstArg)) {
            firstArgValue = firstArg.value;
          } else if (t.isTemplateLiteral(firstArg) && firstArg.quasis.length === 1) {
            firstArgValue = firstArg.quasis[0].value.cooked || firstArg.quasis[0].value.raw;
          }

          if (firstArgValue) {
            let msgid = firstArgValue;
            let msgctxt: string | undefined = undefined;

            // Check for second argument { _: "Default Text" }
            if (args.length > 1) {
              const secondArg = args[1];
              if (t.isObjectExpression(secondArg)) {
                const defaultProp = secondArg.properties.find((prop) => {
                  const isMatch = t.isObjectProperty(prop) && t.isIdentifier(prop.key) && prop.key.name === '_';
                  return isMatch;
                });
                if (defaultProp && t.isObjectProperty(defaultProp)) {
                  if (t.isStringLiteral(defaultProp.value)) {
                    msgid = defaultProp.value.value;
                    msgctxt = firstArgValue; // The first arg is the explicit ID
                  } else if (t.isTemplateLiteral(defaultProp.value) && defaultProp.value.quasis.length === 1) {
                    msgid = defaultProp.value.quasis[0].value.cooked || defaultProp.value.quasis[0].value.raw;
                    msgctxt = firstArgValue;
                  }
                }
              }
            }

            const line = p.node.loc?.start.line || 0;
            const location = `${relativeFile}:${line}`;
            addExtractedMessage(msgid, msgctxt, location);
          }
        }
      },
      JSXOpeningElement(p) {
        const tagName = getJSXElementName(p.node.name);

        const baseNameMatch =
          components.has(tagName) || Array.from(components).some((c) => tagName.startsWith(c + '.') || tagName === c);

        if (baseNameMatch) {
          p.node.attributes.forEach((attr) => {
            if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && translatableProps.has(attr.name.name)) {
              let textValue: string | null = null;

              if (attr.value) {
                if (t.isStringLiteral(attr.value)) {
                  textValue = attr.value.value;
                } else if (t.isJSXExpressionContainer(attr.value)) {
                  const expr = attr.value.expression;
                  if (t.isStringLiteral(expr) || t.isTemplateLiteral(expr)) {
                    if (t.isStringLiteral(expr)) {
                      textValue = expr.value;
                    } else if (expr.quasis.length === 1) {
                      textValue = expr.quasis[0].value.cooked || expr.quasis[0].value.raw;
                    }
                  }
                }
              }

              if (textValue && textValue.trim() !== '') {
                const line = attr.loc?.start.line || 0;
                const location = `${relativeFile}:${line}`;
                addExtractedMessage(textValue, undefined, location);
              }
            }
          });
        }
      },
      JSXElement(p) {
        const tagName = getJSXElementName(p.node.openingElement.name);
        if (!CHILDREN_AS_KEY_COMPONENTS.has(tagName)) return;

        // Extract text from children: JSXText or StringLiteral in JSXExpressionContainer
        let textValue: string | null = null;
        for (const child of p.node.children) {
          if (t.isJSXText(child) && child.value.trim()) {
            textValue = child.value.trim();
            break;
          }
          if (t.isJSXExpressionContainer(child)) {
            const expr = child.expression;
            if (t.isStringLiteral(expr)) {
              textValue = expr.value;
              break;
            } else if (t.isTemplateLiteral(expr) && expr.quasis.length === 1) {
              textValue = expr.quasis[0].value.cooked || expr.quasis[0].value.raw;
              break;
            }
          }
        }
        if (!textValue) return;

        // Extract id, context, and comment from opening element attributes
        let explicitId: string | undefined;
        let msgctxt: string | undefined;
        let translatorComment: string | undefined;
        for (const attr of p.node.openingElement.attributes) {
          if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name)) continue;
          const val = t.isStringLiteral(attr.value)
            ? attr.value.value
            : t.isJSXExpressionContainer(attr.value) && t.isStringLiteral(attr.value.expression)
              ? attr.value.expression.value
              : undefined;
          if (val === undefined) continue;
          if (attr.name.name === 'id') explicitId = val;
          if (attr.name.name === 'context') msgctxt = val;
          if (attr.name.name === 'comment') translatorComment = val;
        }

        // Compute the hash written to `#. id:` and used as the compiled JSON key:
        //   id present   → literal id (e.g. "action.archive"), no msgctxt
        //   context only → hash(context + \x04 + message), msgctxt = context
        //   neither      → hash(message), no msgctxt
        let precomputedHash: string | undefined;
        if (explicitId) {
          precomputedHash = explicitId;
          msgctxt = undefined; // id supersedes context; no msgctxt in PO
        } else if (msgctxt) {
          precomputedHash = generateMessageId(`${msgctxt}\x04${normalizeMessage(textValue)}`);
        }

        const line = p.node.loc?.start.line || 0;
        addExtractedMessage(textValue, msgctxt, `${relativeFile}:${line}`, translatorComment, precomputedHash);
      },
    });
  } catch (e: any) {
    console.error(`Failed to parse ${relativeFile}:`, e.message);
  }

  return extractedMessages;
}

function main() {
  const {
    srcPattern,
    outDir,
    localeArgs,
    format: formatArg,
    config: configPath,
    outFile: explicitOutFile,
    ignorePatterns,
    locale: explicitLocale,
  } = parseArgs();
  const { components, translatableProps } = loadConfig(configPath);

  console.log(`Extracting messages from ${srcPattern} (using Babel)...`);
  if (ignorePatterns.length > 0) {
    console.log(`Ignoring patterns: ${ignorePatterns.join(', ')}`);
  }

  let files = globSync(srcPattern, { absolute: true });

  if (ignorePatterns.length > 0) {
    files = files.filter((file) => {
      const relativeFile = path.relative(process.cwd(), file);
      const isIgnored = ignorePatterns.some((pattern) => minimatch(relativeFile, pattern));
      return !isIgnored;
    });
  }

  console.log(`Processing ${files.length} files...`);
  if (files.length < 10) {
    console.log('Files:', files);
  } else {
    console.log('Sample files:', files.slice(0, 5));
  }

  const extractedMessages = new Map<string, ExtractedMessage>();

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativeFile = path.relative(process.cwd(), file);
      const fileMessages = extractMessagesFromSource(content, relativeFile, { components, translatableProps });
      fileMessages.forEach((data, key) => {
        if (!extractedMessages.has(key)) {
          extractedMessages.set(key, data);
        } else {
          data.locations.forEach((loc) => extractedMessages.get(key)!.locations.add(loc));
        }
      });
    } catch (e: any) {
      console.error(`Failed to parse ${file}:`, e.message);
    }
  });

  console.log(`Found ${extractedMessages.size} translatable strings.`);

  const targets: { outFile: string; locale: string; format: string }[] = [];

  if (explicitOutFile) {
    const ext = path.extname(explicitOutFile).slice(1);
    const format = formatArg || (ext === 'po' ? 'po' : 'json');
    targets.push({ outFile: explicitOutFile, locale: explicitLocale || 'en', format });
  } else {
    localeArgs.forEach((arg) => {
      if (arg.includes('*')) {
        const matchedFiles = globSync(arg, { absolute: true });
        matchedFiles.forEach((file) => {
          const ext = path.extname(file).slice(1);
          const format = formatArg || (ext === 'po' ? 'po' : 'json');

          // Guess locale from path: locales/en.po -> en, locales/en/messages.po -> en
          let locale = path.basename(file, '.' + ext);
          if (locale === 'messages' || locale === 'translations' || locale === 'LC_MESSAGES') {
            const parts = file.split(path.sep);
            locale = parts[parts.length - 2];
          }
          targets.push({ outFile: file, locale, format });
        });
      } else {
        let outFile: string;
        let locale: string;
        let format: string;

        if (arg.includes('.') || arg.includes('/') || arg.includes('\\')) {
          outFile = arg;
          const ext = path.extname(arg).slice(1);
          format = formatArg || (ext === 'po' ? 'po' : 'json');

          locale = path.basename(arg, '.' + ext);
          if (locale === 'messages' || locale === 'translations' || locale === 'LC_MESSAGES') {
            const parts = path.resolve(arg).split(path.sep);
            locale = parts[parts.length - 2];
          }
        } else {
          format = formatArg || 'json';
          const extension = format === 'po' ? 'po' : 'json';
          outFile = path.join(outDir, `${arg}.${extension}`);
          locale = arg;
        }
        targets.push({ outFile, locale, format });
      }
    });
  }

  if (targets.length === 0) {
    console.error('No target files found or specified.');
    process.exit(1);
  }

  targets.forEach(({ outFile, locale, format }) => {
    let existingTranslations: Record<string, any> = {};

    if (fs.existsSync(outFile)) {
      try {
        if (format === 'po') {
          const fileContent = fs.readFileSync(outFile);
          const parsedPo = gettextParser.po.parse(fileContent);

          Object.entries(parsedPo.translations).forEach(([context, entries]) => {
            Object.entries(entries).forEach(([msgid, data]: [string, any]) => {
              if (msgid === '') return;

              // Find the hash: check context (v2), then comment (v3), then msgid (v1)
              const commentHash = data.comments?.extracted?.match(/id: (\w+)/)?.[1];
              const hash = context || commentHash || msgid;

              existingTranslations[hash] = {
                defaultMessage: data.msgid || data.comments?.extracted || '',
                translation: data.msgstr[0] || '',
              };
            });
          });
        } else {
          existingTranslations = JSON.parse(fs.readFileSync(outFile, 'utf8'));
        }
      } catch (e: any) {
        console.error(`Failed to parse existing translation file at ${outFile}:`, e.message);
        return; // Skip this file
      }
    } else {
      const parentDir = path.dirname(outFile);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
    }

    const updatedTranslations: Record<
      string,
      {
        defaultMessage: string;
        translation: string;
        locations?: string[];
        msgctxt?: string;
        translatorComment?: string;
      }
    > = {};
    let addedCount = 0;

    extractedMessages.forEach((data) => {
      const hash = data.precomputedHash ?? (data.msgctxt ? data.msgctxt : generateMessageId(data.msgid));
      if (existingTranslations[hash]) {
        const existing = existingTranslations[hash];
        updatedTranslations[hash] = {
          defaultMessage: data.msgid,
          translation: existing.translation || (existing.description ? '' : ''),
          locations: Array.from(data.locations),
          msgctxt: data.msgctxt,
          translatorComment: data.translatorComment,
        };
      } else {
        updatedTranslations[hash] = {
          defaultMessage: data.msgid,
          translation: '',
          locations: Array.from(data.locations),
          msgctxt: data.msgctxt,
          translatorComment: data.translatorComment,
        };
        addedCount++;
      }
    });

    // Keep hardcoded keys (like ra.*)
    Object.keys(existingTranslations).forEach((key) => {
      if (!updatedTranslations[key]) {
        const existing = existingTranslations[key];
        updatedTranslations[key] = {
          defaultMessage: existing.defaultMessage || '',
          translation: existing.translation || '',
        };
      }
    });

    if (format === 'po') {
      const poData: any = {
        charset: 'utf-8',
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          language: locale,
        },
        translations: {
          '': {
            '': { msgid: '', msgstr: [''] }, // Header
          },
        },
      };

      Object.entries(updatedTranslations).forEach(([hash, data]) => {
        const context = data.msgctxt || '';
        if (!poData.translations[context]) {
          poData.translations[context] = {};
        }

        // To achieve multi-line PO visual without \n, we must ensure the strings
        // themselves don't have newlines before gettext-parser sees them.
        // However, we WANT the structured look.
        // If we want gettext-parser to wrap, we usually can't control it.
        // Instead, we will use our previously successful "compiledPo.replace" approach
        // but with a better regex that actually works on the serialized output.

        poData.translations[context][data.defaultMessage] = {
          msgid: data.defaultMessage,
          msgctxt: data.msgctxt ? data.msgctxt : undefined,
          msgstr: [data.translation],
          comments: {
            ...(data.translatorComment ? { translator: data.translatorComment } : {}),
            extracted: `id: ${hash}`,
            reference: data.locations?.join('\n'),
          },
        };
      });

      const compiledPo = gettextParser.po.compile(poData);
      fs.writeFileSync(outFile, compiledPo);
    } else {
      fs.writeFileSync(outFile, JSON.stringify(updatedTranslations, null, 2));
    }

    console.log(`Updated ${outFile} (${locale}): Added ${addedCount} new messages.`);
  });
}

const scriptName = path.basename(process.argv[1] ?? '');
if (scriptName === 'extract.js' || scriptName === 'extract.ts') {
  main();
}
