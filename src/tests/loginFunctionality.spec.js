import { test, expect } from "@playwright/test";
import retailers from "../../fixtures/retailers.json";
import { TestHelper } from "../../TestHelper.ts";
import * as allure from "allure-js-commons";
import POMManager from "../pages/pageManager/POMManager.js";
import OutlookPopup from "../pages/login/outlookPopup.js";
import { getConfig } from "../utils/configUtils.js";

async function navigateToLoginPage(pomManager, page) {
  await pomManager.getLogin().navigateToURL();
  await page.waitForLoadState("domcontentloaded"); 
  await pomManager.getLogin().welcomeText.waitFor({ state: "visible" });
  TestHelper.logStep("Navigated to the URL", page);
}

async function handlePopupLogin(popup) {
  await popup.waitForLoadState("domcontentloaded");
  await popup.waitForTimeout(1000); 

  const popupTitle = await popup.title();
  expect(popupTitle).toBe("Sign in to your account");
  
  TestHelper.log(`Verified popup title: 'Sign in to your account'`);
  TestHelper.logStep("Verified popup title: 'Sign in to your account'", popup);

  const outlookPopup = new OutlookPopup(popup);

  await outlookPopup.txtbox_email.waitFor({ state: 'visible' });
  await outlookPopup.txtbox_email.fill(getConfig().email);
  TestHelper.log(`Entered email in the popup`);
  TestHelper.logStep("Entered email in the popup", popup);

  await outlookPopup.button_next.waitFor({ state: 'visible' });
  await outlookPopup.button_next.click();
  TestHelper.log("Clicked next on email input");
  TestHelper.logStep("Clicked next on email input", popup);

  await popup.waitForTimeout(12000); 

  return popup;
}

async function handleAuthPoint(popup) {
  const newTitle = await popup.title();
  if (newTitle === "Web single sign-on") {
    TestHelper.log("Navigated to Authpoint");
    TestHelper.logStep("Navigated to Authpoint", popup);
    await popup.locator(`//input[@name="loginForm.username"]`).waitFor({ state: 'visible' });
    await popup.locator(`//input[@name="loginForm.username"]`).fill(getConfig().email);
    TestHelper.log("Entered the email");
    TestHelper.logStep("Entered the email", popup);
    await popup.locator(`//button[@id="form-username-submit"]`).click();
    await popup.waitForTimeout(3000); 
    await popup.locator(`//button[text()="Scan QR Code"]`).waitFor({ state: 'visible' });
    await popup.locator(`//button[text()="Scan QR Code"]`).click();
    TestHelper.log("Navigated to scan a QR Code");
    TestHelper.logStep("Navigated to scan a QR Code", popup);
    await popup.waitForTimeout(6000);
    TestHelper.log("Scanned the QR and submitted the form");
    TestHelper.logStep("Scanned the QR and submitted the form", popup);
    await popup.locator(`//button[text()="FINISH"]`).click();
  }
}

async function handleLoginError(popup) {
  const errorMessageVisible = await popup.locator(`//p[@id="pageDescription"]`).isVisible();
  if (errorMessageVisible) {
    expect(errorMessageVisible).toBe(true); 
    TestHelper.log(`Login failed. Screenshot taken.`);
    TestHelper.logStep("Login failed. Screenshot taken.", popup);
  }
}

test.describe("Login Functionality for Subaru @smoke-prod", () => {
  retailers.forEach(({ id, name }) => {
    test(`Login for - RetailerID:${id} RetailerName:${name}`, async ({ page, context }) => {
      try {
        allure.feature("Login for");
        allure.story(`Retailer: ${name} (ID: ${id})`);
        allure.label("test-case", `Retailer_${id}`);

        const pomManager = new POMManager(page);
        TestHelper.log(`Starting test for Retailer: ${name} (ID: ${id})`);

        await navigateToLoginPage(pomManager, page);

        const [popup] = await Promise.all([
          context.waitForEvent("page"), 
          pomManager.getLogin().loginButton.click(), 
        ]);
        TestHelper.log(`Clicked on login button and detected new window`);
        TestHelper.logStep("Clicked on login button and detected new window", page);

        await handlePopupLogin(popup);
        const newTitle = await popup.title();

        if (newTitle === "Web single sign-on") {
          await handleAuthPoint(popup); // Handle Authpoint if title matches
        } else {
          await handleLoginError(popup); // Handle error if title does not match
        }

      } catch (error) {
        throw error;
      }
    });
  });
});
