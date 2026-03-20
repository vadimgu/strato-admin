import {
  parse,
  MessageFormatElement,
  isPluralElement,
  isSelectElement,
  isTagElement,
  isLiteralElement,
  isPoundElement,
} from '@formatjs/icu-messageformat-parser';
import { printAST } from '@formatjs/icu-messageformat-parser/printer.js';
import { normalizeMessage } from './hash';

/**
 * Pretty-prints an ICU message for better readability in translation files.
 * Uses newlines and indentation for nested structures.
 */
export function prettyPrintICU(msg: string): string {
  try {
    const ast = parse(msg);
    return printElement(ast, 0).trim();
  } catch (e) {
    return msg.trim();
  }
}

function printElement(elements: MessageFormatElement[], indent: number): string {
  const padding = '  '.repeat(indent);
  let result = '';

  elements.forEach((el) => {
    if (isLiteralElement(el)) {
      result += el.value;
    } else if (isPluralElement(el) || isSelectElement(el)) {
      const type = isPluralElement(el) ? 'plural' : 'select';
      result += `{${el.value}, ${type},\n`;
      const options = Object.entries(el.options);
      options.forEach(([key, opt], _) => {
        result += `${padding}  ${key} {${printElement(opt.value, indent + 2)}}\n`;
      });
      result += `${padding}}`;
    } else if (isTagElement(el)) {
      result += `<${el.value}>${printElement(el.children, indent)}</${el.value}>`;
    } else if (isPoundElement(el)) {
      result += '#';
    } else {
      // For arguments like {name}
      result += `{${(el as any).value || ''}}`;
    }
  });

  return result;
}

/**
 * Canonicalizes an ICU message using the official printer and normalization.
 * This ensures consistent spacing and a single-line format for hashing and compilation.
 */
export function canonicalizeMessage(msg: string): string {
  try {
    const ast = parse(msg);
    return normalizeMessage(printAST(ast));
  } catch (e) {
    return normalizeMessage(msg);
  }
}
