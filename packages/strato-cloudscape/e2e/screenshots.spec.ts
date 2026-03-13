import { test, expect } from '@playwright/test';
import path from 'path';

const STORIES = [
  { id: 'components-button--primary', name: 'Button_Primary' },
  { id: 'components-button--normal', name: 'Button_Normal' },
  { id: 'components-table--basic', name: 'Table_Basic' },
];

const OUTPUT_DIR = path.resolve(__dirname, '../../../docs/static/img/components');

test.describe('Storybook Screenshots', () => {
  for (const story of STORIES) {
    test(`capture ${story.name}`, async ({ page }) => {
      // Go to the iframe directly for a clean screenshot without the Storybook UI
      const url = `http://localhost:6006/iframe.html?id=${story.id}&viewMode=story`;
      await page.goto(url);
      
      // Wait for the component to be rendered in the root
      await page.waitForLoadState('networkidle');
      const root = page.locator('#storybook-root');
      await expect(root).not.toBeEmpty();

      // Find the best element to screenshot
      // For tables/large components, we take the root or the first significant container
      // For buttons, we still want a tight crop
      let element;
      if (story.id.includes('button')) {
        element = root.locator('button, a[role="button"]').first();
      } else {
        // For tables and other layout components, the root container is better
        element = root.locator('> *').first();
      }
      
      await expect(element).toBeVisible();
      
      // Take a cropped screenshot of the element
      await element.screenshot({ 
        path: path.join(OUTPUT_DIR, `${story.name}.png`),
        animations: 'disabled',
      });
    });
  }
});
