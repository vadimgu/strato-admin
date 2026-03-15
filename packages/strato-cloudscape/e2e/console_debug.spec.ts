import { test, expect } from '@playwright/test';
import path from 'path';

const STORIES = [{ id: 'components-button--primary', name: 'Button_Primary' }];

test.describe('Storybook Console Debug', () => {
  for (const story of STORIES) {
    test(`debug capture ${story.name}`, async ({ page }) => {
      page.on('console', (msg) => {
        console.log(`BROWSER CONSOLE [${msg.type()}]: ${msg.text()}`);
      });
      page.on('pageerror', (err) => {
        console.log(`BROWSER PAGE ERROR: ${err.message}`);
      });

      const url = `http://localhost:6006/iframe.html?id=${story.id}&viewMode=story`;
      console.log(`Navigating to ${url}`);

      try {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 });
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000); // 5 seconds to be sure
      } catch (e) {
        console.log(`FAILED TO LOAD PAGE: ${e.message}`);
      }

      const bodyText = await page.innerText('body');
      console.log(`Final body text: "${bodyText.substring(0, 500)}"`);
    });
  }
});
