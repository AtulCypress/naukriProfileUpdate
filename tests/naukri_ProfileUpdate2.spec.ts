import { test, expect } from '@playwright/test';

test('Naukri Profile Update', async ({ page }) => {
    await page.goto('https://www.naukri.com/');
    await page.getByRole('link', { name: 'Login', exact: true }).click();
    await page.getByRole('textbox', { name: 'Enter your active Email ID /' }).click();
    await page.getByRole('textbox', { name: 'Enter your active Email ID /' }).fill('atul44sharma@gmail.com');
    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('9893123115');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForTimeout(5000);

    await expect(page.getByRole('link', { name: 'View profile' })).toBeVisible();
    await page.getByRole('link', { name: 'View profile' }).click();
    await expect(page.getByText('Resume headlineeditOneTheme')).toBeVisible();
    await page.locator('#lazyResumeHead').getByText('editOneTheme').click();
    await page.getByRole('textbox', { name: 'Minimum 5 words. Sample' }).click();


    const textBoxLocator = page.getByRole('textbox', { name: 'Minimum 5 words. Sample' });

    // 2. Read the current text
    const currentText: string = await textBoxLocator.inputValue();

    // 3. Find out how many dots are at the end of the text
    // The regex /\.+$/ matches all consecutive dots at the very end of the string
    const dotMatch = currentText.match(/\.+$/);
    const dotCount: number = dotMatch ? dotMatch[0].length : 0;

    let updatedText: string;

    // 4. Apply the condition: reset to 1 dot if we have 5 (or more), else add 1 dot
    if (dotCount >= 5) {
        // Replace all trailing dots with a single dot (effectively removing the last 4)
        updatedText = currentText.replace(/\.+$/, '.');
    } else {
        // Append a single dot
        updatedText = `${currentText}.`;
    }

    // 5. Fill the textbox with the updated string
    await textBoxLocator.fill(updatedText);

    // 6. Assert the text was filled correctly
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
});


