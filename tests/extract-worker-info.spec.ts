import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Extract Worker Information', () => {
  test.use({ 
    launchOptions: { 
      headless: false 
    } 
  });

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

    // Wait for the name field to be present
    await page.waitForSelector('#wknFamilienaam', { timeout: 300000 });
    
    console.log('✅ Worker page detected! Starting extraction...\n');

    // Extract the worker name
    const workerName = await page.inputValue('#wknFamilienaam');

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

    // Keep the browser open indefinitely
    await page.waitForTimeout(999999999);
  });
});
