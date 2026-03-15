import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const STORIES = [
  { id: 'components-button--primary', name: 'Button_Primary' },
  { id: 'components-button--normal', name: 'Button_Normal' },
];

const OUTPUT_DIR = path.resolve(__dirname, '../../../docs/static/img/components');

test.describe('Storybook Debug', () => {
  for (const story of STORIES) {
    test(`debug capture ${story.name}`, async ({ page }) => {
      const url = `http://localhost:6006/iframe.html?id=${story.id}&viewMode=story`;
      console.log(`Navigating to ${url}`);
      await page.goto(url);

      // Wait for everything
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Give it extra time just in case

      const content = await page.content();
      console.log(`Page content length for ${story.name}: ${content.length}`);

      // Look for any text on the page
      const bodyText = await page.innerText('body');
      console.log(`Body text for ${story.name}: "${bodyText.substring(0, 100)}"`);

      // Take a full page screenshot
      const shotPath = path.join(OUTPUT_DIR, `${story.name}_DEBUG.png`);
      await page.screenshot({ path: shotPath });
      console.log(`Screenshot saved to ${shotPath}`);
    });
  }
});
