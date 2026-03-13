import { test, expect } from '@playwright/test';
import path from 'path';

const STORIES = [
  { id: 'components-button--debug', name: 'Button_Debug' },
];

test.describe('Storybook Debug Story', () => {
  for (const story of STORIES) {
    test(`debug capture ${story.name}`, async ({ page }) => {
      const url = `http://localhost:6006/iframe.html?id=${story.id}&viewMode=story`;
      console.log(`Navigating to ${url}`);
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(5000); // 5 seconds

      const bodyText = await page.innerText('body');
      console.log(`Final body text for ${story.name}: "${bodyText}"`);
    });
  }
});
