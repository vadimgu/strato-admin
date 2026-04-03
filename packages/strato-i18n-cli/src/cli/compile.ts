#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';
import * as gettextParser from 'gettext-parser';
import { normalizeMessage } from '@strato-admin/i18n';

function parseArgs() {
  const args = process.argv.slice(2);
  let outFile: string | undefined = undefined;
  const positionalArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--out-file' || args[i] === '-o') && i + 1 < args.length) {
      outFile = args[i + 1];
      i++;
    } else if (args[i].startsWith('--out-file=')) {
      outFile = args[i].split('=')[1];
    } else {
      positionalArgs.push(args[i]);
    }
  }

  const pattern = positionalArgs[0] || 'locales';
  return { pattern, outFile };
}

export function parsePoContent(content: Buffer): Record<string, { defaultMessage: string; translation: string }> {
  const parsed = gettextParser.po.parse(content);
  const translations: Record<string, { defaultMessage: string; translation: string }> = {};

  Object.entries(parsed.translations).forEach(([context, entries]) => {
    Object.entries(entries).forEach(([msgid, data]: [string, any]) => {
      if (msgid === '') return; // skip header

      // Find the hash: #. id: comment is authoritative (covers explicit ids and
      // context-mangled hashes); fall back to msgctxt, then raw msgid.
      const commentHash = data.comments?.extracted?.match(/id: (\S+)/)?.[1];
      const hash = commentHash || context || msgid;

      translations[hash] = {
        defaultMessage: data.msgid || data.comments?.extracted || '',
        translation: data.msgstr[0] || '',
      };
    });
  });

  return translations;
}

export function buildCompiledMapping(translations: Record<string, any>): Record<string, string> {
  const compiledMapping: Record<string, string> = {};
  const sortedKeys = Object.keys(translations).sort();

  sortedKeys.forEach((hash) => {
    const data = translations[hash];
    // Support both strato-i18n-cli format and formatjs format (with translation or defaultMessage as translation)
    if (typeof data === 'string') {
      compiledMapping[hash] = normalizeMessage(data);
    } else if (data.translation && data.translation.trim() !== '') {
      compiledMapping[hash] = normalizeMessage(data.translation);
    } else {
      // Fallback to defaultMessage
      compiledMapping[hash] = normalizeMessage(data.defaultMessage || '');
    }
  });

  return compiledMapping;
}

function main() {
  const { pattern, outFile: explicitOutFile } = parseArgs();

  let files: string[] = [];

  if (fs.existsSync(pattern) && fs.statSync(pattern).isDirectory()) {
    // Original behavior: if a directory is passed, find .json and .po files inside it
    files = fs
      .readdirSync(pattern)
      .filter((file) => (file.endsWith('.json') || file.endsWith('.po')) && !file.endsWith('.compiled.json'))
      .map((file) => path.join(pattern, file));
  } else {
    // New behavior: support glob patterns
    files = globSync(pattern, { absolute: true }).filter(
      (file) => (file.endsWith('.json') || file.endsWith('.po')) && !file.endsWith('.compiled.json'),
    );
  }

  if (files.length === 0) {
    console.log(`No .json or .po files found matching: ${pattern}`);
    return;
  }

  // If explicitOutFile is provided, we only expect ONE input file or we combine them?
  // FormatJS compile behavior: formatjs compile <file> --out-file <outFile>
  if (explicitOutFile && files.length > 1) {
    console.warn(`Warning: Multiple input files found but only one --out-file specified. Using the first one.`);
    files = [files[0]];
  }

  let processedCount = 0;

  files.forEach((filePath) => {
    const compiledFilePath = explicitOutFile || filePath.replace(/\.(json|po)$/, '.compiled.json');
    const fileName = path.basename(filePath);

    let translations: Record<string, any> = {};

    try {
      if (filePath.endsWith('.po')) {
        translations = parsePoContent(fs.readFileSync(filePath));
      } else {
        translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (e: any) {
      console.error(`Failed to parse translation file at ${filePath}:`, e.message);
      return;
    }

    const compiledMapping = buildCompiledMapping(translations);

    const parentDir = path.dirname(compiledFilePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.writeFileSync(compiledFilePath, JSON.stringify(compiledMapping, null, 2));
    console.log(
      `Compiled ${fileName} -> ${path.basename(compiledFilePath)} (${Object.keys(compiledMapping).length} messages)`,
    );
    processedCount++;
  });

  console.log(`Successfully compiled ${processedCount} files.`);
}

const scriptName = path.basename(process.argv[1] ?? '');
if (scriptName === 'compile.js' || scriptName === 'compile.ts') {
  main();
}
