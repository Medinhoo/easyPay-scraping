import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Extract Worker Information', () => {

  test('should extract worker name', async ({ page, context }) => {
    // Configuration
    const outputDir = path.join(process.cwd(), 'output');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(outputDir, `worker-data-${timestamp}.json`);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Navigate to EasyPay
    console.log('\n🌐 Navigating to http://pceasy/...');
    await page.goto('http://pceasy/');

    // Wait for manual login - user should navigate to the worker page
    console.log('⏳ Please log in manually and navigate to the worker page...');
    console.log('⏳ The script will wait for the page to be ready...\n');

    //Wait for loginPage
    await page.waitForSelector('#user', { timeout: 10000 });
    
    await page.fill("#user", 'ILHAME')
    await page.fill("#password", 'ILHAME')
    await page.click("#butLogin")
    
    // Click on "Données de base travailleurs" menu item
    await page.locator('iframe[name="targetFrame"]').contentFrame().locator('div').filter({ hasText: /^Données de base travailleurs$/ }).click()

    // Extract the worker name
    const workerName = await page.locator('iframe[name="targetFrame"]').contentFrame().getByRole('textbox', { name: 'Nom', exact: true }).inputValue()

    // Create simple data object
    const workerData = {
      extractionDate: new Date().toISOString(),
      nom: workerName
    };

    // Save to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(workerData, null, 2), 'utf-8');

    console.log('✅ Extraction completed successfully!');
    console.log(`📁 Data saved to: ${outputFile}`);
    console.log(`📊 Worker name: ${workerName}\n`);
    console.log('🌐 Browser will remain open. Press Ctrl+C to close.\n');

    // Verify the file was created
    expect(fs.existsSync(outputFile)).toBeTruthy();

  });
});
