#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as gettextParser from 'gettext-parser';
import { generateMessageId } from '@strato-admin/i18n';

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
  'title',
  'placeholder',
  'emptyText',
  'helperText',
  'description',
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

function getJSXElementName(node: t.JSXOpeningElement['name']): string {
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
  const positionalArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--format' && i + 1 < args.length) {
      format = args[i + 1];
      i++;
    } else if (args[i].startsWith('--format=')) {
      format = args[i].split('=')[1];
    } else if (args[i] === '--config' && i + 1 < args.length) {
      config = args[i + 1];
      i++;
    } else if (args[i].startsWith('--config=')) {
      config = args[i].split('=')[1];
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

  return { srcPattern, outDir, localeArgs, format, config };
}

function main() {
  const { srcPattern, outDir, localeArgs, format: formatArg, config: configPath } = parseArgs();
  const { components, translatableProps } = loadConfig(configPath);

  console.log(`Extracting messages from ${srcPattern} (using Babel)...`);

  const files = globSync(srcPattern, { absolute: true });
  const extractedMessages = new Set<string>();

  files.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'decorators-legacy'],
      });

      traverse(ast, {
        JSXOpeningElement(path) {
          const tagName = getJSXElementName(path.node.name);

          const baseNameMatch =
            components.has(tagName) || Array.from(components).some((c) => tagName.startsWith(c + '.') || tagName === c);

          if (baseNameMatch) {
            path.node.attributes.forEach((attr) => {
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
                        textValue = expr.quasis[0].value.raw;
                      }
                    }
                  }
                }

                if (textValue && textValue.trim() !== '') {
                  extractedMessages.add(textValue);
                }
              }
            });
          }
        },
      });
    } catch (e: any) {
      console.error(`Failed to parse ${file}:`, e.message);
    }
  });

  console.log(`Found ${extractedMessages.size} translatable strings.`);

  const targets: { outFile: string; locale: string; format: string }[] = [];

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

  if (targets.length === 0) {
    console.error('No target files found or specified.');
    process.exit(1);
  }

  targets.forEach(({ outFile, locale, format }) => {
    let existingTranslations: Record<string, { defaultMessage: string; translation: string }> = {};

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

    const updatedTranslations: Record<string, { defaultMessage: string; translation: string }> = {};
    let addedCount = 0;

    extractedMessages.forEach((msg) => {
      const msgid = generateMessageId(msg);
      if (existingTranslations[msgid]) {
        updatedTranslations[msgid] = { ...existingTranslations[msgid] };
        updatedTranslations[msgid].defaultMessage = msg;
      } else {
        updatedTranslations[msgid] = {
          defaultMessage: msg,
          translation: '',
        };
        addedCount++;
      }
    });

    Object.keys(existingTranslations).forEach((key) => {
      if (!updatedTranslations[key]) {
        updatedTranslations[key] = existingTranslations[key];
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
        poData.translations[''][data.defaultMessage] = {
          msgid: data.defaultMessage,
          msgstr: [data.translation],
          comments: {
            extracted: `id: ${hash}`,
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

if (require.main === module) {
  main();
}
