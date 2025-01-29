import {getConfig} from '../../utils/configUtils';
import {expect} from '@playwright/test';

class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginButton = page.getByLabel('Login');
    } 

    async navigateTo(baseUrl) {
        await this.page.goto(baseUrl);
    }

    async clickLoginButton() {
        await this.loginButton.waitFor();
        await this.loginButton.click();
    }

    async loginToApplication() {
        // Retrieve configuration data for the base URL
        const {baseUrl} = getConfig();
        
        // Navigate to the base URL
        await this.navigateTo(baseUrl); 

        // Click on Login Button
        await this.clickLoginButton(); 

        // Assert that the current URL is the dashboard URL
        await expect(this.page).toHaveURL(`${baseUrl}/dashboard`);
    }
}

export default LoginPage;
