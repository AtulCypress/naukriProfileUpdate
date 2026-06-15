import { test, expect } from '@playwright/test';
// 1. Import the extra Playwright and Stealth libraries
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

// 2. Tell the chromium launcher to use the stealth plugin
chromium.use(stealth());

// 3. Remove '{ page }' from the test parameters, as we will launch it manually
test('Naukri Profile Update', async () => {
    
    // 4. Manually launch the stealthy browser, context, and page
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto('https://www.naukri.com/');
        await page.getByRole('link', { name: 'Login', exact: true }).click();
        await page.getByRole('textbox', { name: 'Enter your active Email ID /' }).click();
        await page.getByRole('textbox', { name: 'Enter your active Email ID /' }).fill('atul44sharma@gmail.com');
        await page.getByRole('textbox', { name: 'Enter your password' }).click();
        await page.getByRole('textbox', { name: 'Enter your password' }).fill('9893123115');
        await page.getByRole('button', { name: 'Login', exact: true }).click();
        
        // Note: It is highly recommended to replace these wait timeouts with web-first assertions
        await page.waitForTimeout(5000); 

        await expect(page.getByRole('link', { name: 'View profile' })).toBeVisible();
        await page.getByRole('link', { name: 'View profile' }).click();
        await expect(page.getByText('Resume headlineeditOneTheme')).toBeVisible();
        await page.locator('#lazyResumeHead').getByText('editOneTheme').click();
        await page.getByRole('textbox', { name: 'Minimum 5 words. Sample' }).click();

        const textBoxLocator = page.getByRole('textbox', { name: 'Minimum 5 words. Sample' });

        // Read the current text
        const currentText: string = await textBoxLocator.inputValue();

        // Find out how many dots are at the end of the text
        const dotMatch = currentText.match(/\.+$/);
        const dotCount: number = dotMatch ? dotMatch[0].length : 0;

        let updatedText: string;

        // Apply the condition: reset to 1 dot if we have 5 (or more), else add 1 dot
        if (dotCount >= 5) {
            updatedText = currentText.replace(/\.+$/, '.');
        } else {
            updatedText = `${currentText}.`;
        }

        // Fill the textbox with the updated string
        await textBoxLocator.fill(updatedText);

        // Assert the text was filled correctly
        await expect(textBoxLocator).toHaveValue(updatedText);

        await page.waitForTimeout(2000);

        await page.getByRole('button', { name: 'Save' }).click();
        await page.waitForTimeout(5000);
        
        await expect(page.getByText('Profile updated successfully')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.ltLayer.open')).toHaveCount(0);
        await page.getByRole('img', { name: 'naukri user profile img' }).click();
        await page.getByText('Logout').click();
        
        await page.waitForTimeout(2000);
        
    } finally {
        // 5. Ensure the browser always closes, even if the test fails
        await browser.close();
    }
});