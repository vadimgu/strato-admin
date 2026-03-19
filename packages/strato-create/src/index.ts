#!/usr/bin/env node
import { intro, outro, text, select, spinner, note, cancel, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  intro(pc.bgCyan(pc.black(' create-strato-admin ')));

  let argProjectName = process.argv[2];

  const projectName =
    argProjectName ||
    (await text({
      message: 'What is the name of your project?',
      placeholder: 'my-strato-admin',
      validate(value) {
        if (value.length === 0) return `Project name is required!`;
        if (fs.existsSync(path.resolve(process.cwd(), value))) {
          return `Directory ${value} already exists!`;
        }
      },
    }));

  if (isCancel(projectName)) {
    cancel('Operation cancelled');
    process.exit(0);
  }

  const template = await select({
    message: 'Select a template',
    options: [{ value: 'basic', label: 'Basic', hint: 'A minimal project with a simple Admin setup' }],
  });

  if (isCancel(template)) {
    cancel('Operation cancelled');
    process.exit(0);
  }

  const s = spinner();
  s.start('Scaffolding your project...');

  const targetDir = path.resolve(process.cwd(), projectName as string);
  const templateDir = path.resolve(__dirname, '..', 'templates', template as string);

  try {
    // Copy template files
    await fs.copy(templateDir, targetDir);

    // Update package.json name
    const pkgPath = path.join(targetDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    // Rename _gitignore to .gitignore (to avoid npm issues during publishing)
    const gitignorePath = path.join(targetDir, '_gitignore');
    if (await fs.pathExists(gitignorePath)) {
      await fs.move(gitignorePath, path.join(targetDir, '.gitignore'));
    }

    s.stop('Project scaffolded successfully!');

    const cdCommand = projectName === '.' ? '' : `cd ${projectName}\n  `;

    note(`${pc.bold('Next steps:')}\n\n  ${pc.cyan(`${cdCommand}pnpm install\n  pnpm dev`)}`, 'Ready to start!');

    outro(`Happy hacking!`);
  } catch (err) {
    s.stop('Scaffolding failed');
    console.error(err);
    process.exit(1);
  }
}

main().catch(console.error);
