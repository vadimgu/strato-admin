#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';
import * as gettextParser from 'gettext-parser';

function main() {
  const args = process.argv.slice(2);
  const pattern = args[0] || 'locales';

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

  let processedCount = 0;

  files.forEach((filePath) => {
    const compiledFilePath = filePath.replace(/\.(json|po)$/, '.compiled.json');
    const fileName = path.basename(filePath);

    let translations: Record<string, { defaultMessage: string; translation: string }> = {};

    try {
      if (filePath.endsWith('.po')) {
        const parsed = gettextParser.po.parse(fs.readFileSync(filePath));

        Object.entries(parsed.translations).forEach(([context, entries]) => {
          Object.entries(entries).forEach(([msgid, data]: [string, any]) => {
            if (msgid === '') return; // skip header

            // Find the hash: check context (v2), then comment (v3), then msgid (v1)
            const commentHash = data.comments?.extracted?.match(/id: (\w+)/)?.[1];
            const hash = context || commentHash || msgid;

            translations[hash] = {
              defaultMessage: data.msgid || data.comments?.extracted || '',
              translation: data.msgstr[0] || '',
            };
          });
        });
      } else {
        translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (e: any) {
      console.error(`Failed to parse translation file at ${filePath}:`, e.message);
      return;
    }

    const compiledMapping: Record<string, string> = {};

    Object.entries(translations).forEach(([msgid, data]) => {
      // If translation is empty or whitespace, fallback to defaultMessage
      if (data.translation && data.translation.trim() !== '') {
        compiledMapping[msgid] = data.translation;
      } else {
        compiledMapping[msgid] = data.defaultMessage;
      }
    });

    fs.writeFileSync(compiledFilePath, JSON.stringify(compiledMapping, null, 2));
    console.log(
      `Compiled ${fileName} -> ${path.basename(compiledFilePath)} (${Object.keys(compiledMapping).length} messages)`,
    );
    processedCount++;
  });

  console.log(`Successfully compiled ${processedCount} files.`);
}

if (require.main === module) {
  main();
}
