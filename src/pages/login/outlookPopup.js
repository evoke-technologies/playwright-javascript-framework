import { expect } from '@playwright/test';

class outlookPopup {
    constructor(page) {
        this.page = page;
        this.txtbox_email = page.locator(`//input[@type='email']`);
        this.button_next = page.locator(`//input[@value='Next']`);
    }
}
export default outlookPopup;