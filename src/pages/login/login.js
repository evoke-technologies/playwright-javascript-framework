const { getConfig } = require('../../utils/configUtils');
const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginButton = page.locator('//button[@aria-label="Login"]');
        this.welcomeText = page.locator('p', { hasText: "Welcome!" });
        this.email = getConfig();
        this.password = getConfig();
    }

    async navigateToURL() {
        const { baseUrl } = getConfig();
        await this.page.goto(baseUrl);
    }
}
module.exports = LoginPage;
