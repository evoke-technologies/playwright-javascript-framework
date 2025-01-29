import { test as base, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { Buffer } from 'buffer';

export class TestHelper {
  /**
   * Logs a message to Allure reports
   * @param {string} message - The message to log
   */
  static log(message: string): void {
    allure.logStep(message);
    console.log(`[INFO]: ${message}`);
  }

  /**
   * Attaches a screenshot to Allure reports
   * @param {string} name - Screenshot name
   * @param {Buffer} screenshot - The screenshot buffer
   */
  static async attachScreenshot(name: string, screenshot: Buffer): Promise<void> {
    await allure.attachment(name, screenshot.toString('base64'), 'image/png');
  }

  /**
   * Captures a screenshot of the current page
   * @param {string} name - Name of the screenshot for Allure
   * @param {import('@playwright/test').Page} page - The Playwright page object
   */
  static async captureScreenshot(name: string, page: any): Promise<void> {
    const screenshot = await page.screenshot();
    await this.attachScreenshot(name, screenshot);
  }

  /**
   * Logs a step and takes a screenshot
   * @param {string} stepName - Step description
   * @param {import('@playwright/test').Page} page - The Playwright page object
   */
  static async logStep(stepName: string, page: any): Promise<void> {
    // Log step in Allure
    allure.step(stepName, async () => {
      await this.captureScreenshot(stepName, page);
    });
  }
}
