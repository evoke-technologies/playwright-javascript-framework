import { expect } from '@playwright/test';

class InventoryPage {
    // Constructor to initialize the InventoryPage with the Playwright page instance
    constructor(page) {
        this.page = page;
        // Locators for various UI elements on the Inventory page
        this.inventoryTrimFilter = page.locator('[id="\\30 "] #multiselectDrop-1 div').first();
        this.inventoryColorFilter = page.locator('[id="\\30 "] #multiselectDrop-2 div').first();
        this.inventoryAllocationFilter = page.locator('[id="\\30 "] #multiselectDrop-3 div').first();
        this.inventoryTrimFilterliElements = 'ul#multiselectDrop-1_options li';
        this.inventoryColorFilterliElements = 'ul#multiselectDrop-2_options li';
        this.inventoryAllocationFilterliElements = 'ul#multiselectDrop-3_options li';
        this.gridModelColumn = page.locator('//*[@id="grid-0_content_table"]/tbody/tr/td[2]');
        this.gridColorColumn = page.locator('//*[@id="grid-0_content_table"]/tbody/tr/td[3]');
        this.gridAllocationColumn = page.locator('//*[@id="grid-0_content_table"]/tbody/tr/td[6]');
        this.gridModelValues = page.locator('span.cel-text');
        this.totalInventorycount = page.locator('a.nav-link.active');
        this.totalInventoryGridItem = page.locator('span.e-pagecountmsg').first();
        this.clearFilterButton = page.getByText(/Clear Filters \([1-5]\)/).nth(6);
        this.multiselectdropdown = page.getByLabel('multiselectDrop-').getByLabel('multiselect');
        this.applyButton = page.getByLabel('Apply');
        this.models = page.locator('//li[contains(@class,"vehicle-item")]');
        this.inventoryBreadcrumb = page.locator("//nav[@aria-label='breadcrumb']");
        this.inventoryTotalVehicle = page.locator('.nav-link.active');
        this.inventoryOnLotTab = page.locator('//a[@class="nav-link"]').nth(0);
        this.inventoryOnOrderTab = page.locator('//a[@class="nav-link"]').nth(1);
        this.inventoryInTransitTab = page.locator('//a[@class="nav-link"]').nth(2);
        this.inventorySoldVehiclesTab = page.locator('//a[@class="nav-link"]').nth(3);
        this.inventoryDemosToPurchaseTab = page.locator('//a[@class="nav-link"]').nth(4);
        this.inventorySSLPTab = page.locator('//a[@class="nav-link"]').nth(5);    
    }

    // Method to select the filter and apply it with the specified value
    async applyInventoryFilter(filterValue) {
        // Wait for the multiselect dropdown to be available
        await this.multiselectdropdown.waitFor();
        // Fill the dropdown with the specified value
        await this.multiselectdropdown.fill(`${filterValue}`);
        // Select the option that matches the value
        await this.page.getByRole('option', { name: `${filterValue}` }).click();
        // Wait for the 'Apply' button to be available and click it
        await this.applyButton.waitFor();
        await this.applyButton.click();
    }

    // Method to validate the values displayed in the grid against a given filter value
    async validateGridValues(selectors, filterValue, filterName) {
        // Variable to hold the actual filter value extracted from the filterValue
        let actualFilterValue;
        // Variable to hold the expected grid value obtained from the grid
        let expectedGridValue;
        // Extract actual filter value based on the filter name
        if(filterName === 'model'){
            // For 'model', format the text content to match the expected value
            actualFilterValue = (filterValue || "").replace(/\s*\(\d+\)\s*$/, '').trim();
        }else if(filterName === 'trim') {
            // For 'trim', get the first part before the hyphen
            actualFilterValue = filterValue.split(' - ')[0].trim();
        }else if (filterName === 'color') {
            // For 'color', get the second part after the hyphen
            actualFilterValue = filterValue.split(' - ')[1].trim();
        }else {
            // For 'allocation', trim the filter value directly
            actualFilterValue = filterValue.trim();
        }
        // Loop through each selector to validate the grid values
        for (let index = 0; index < await selectors.count(); index++) {
            // Check if the actual filter value is visible in the grid
            await expect(await selectors.nth(index).getByText(actualFilterValue)).toBeVisible();
            // Get the text content of the current selector
            const textContent = await selectors.nth(index).textContent();
            // Determine the expected grid value based on the filter name
            if(filterName === 'model'){
                // For 'trim', format the text content to match the expected value
                const match = (textContent || "").match(/^\w+\s+(\w+)/);
                expectedGridValue = match ? match[1].trim() : null;
            }
            else if(filterName === 'trim'){
                // For 'trim', format the text content to match the expected value
                expectedGridValue = (textContent || "").replace(/\d{4}(?= )/, " -").trim();
            }else if(filterName === 'color'){
                // For 'color', remove the first three characters from the text content
                expectedGridValue = (textContent || "").replace(/^.{3}/, "").trim();
            }else{
                // For 'allocation, just trim the text content
                expectedGridValue = (textContent || "").trim();
            }
            // Assert that the actual filter value matches the expected grid value
            if(filterName === 'trim'){
            expect(filterValue).toBe(expectedGridValue);
            }else{
                expect(actualFilterValue).toBe(expectedGridValue);
            }
        }
    }

    // Method to clear all applied filters
    async clearFilters() {
        // Wait for the 'Clear Filters' button to be available and click it
        await this.clearFilterButton.waitFor();
        await this.clearFilterButton.click();
    }

    // Method to validate the total number of items displayed in the inventory grid
    async validateInventoryGridItems(selector, filtername) {
        // Get the text content of the total inventory count from the specified selector
        const totalInventoryCountText = await selector.textContent();
        let totalInventory;
        // If the filter name is 'model', extract the numeric value from the text content using a regular expression
        if(filtername === 'model'){
        totalInventory = totalInventoryCountText.match(/\d+/)[0];
        } 
        // For others, extract the numeric value using a different regular expression method
        else {
        totalInventory = RegExp(/\d+/).exec(totalInventoryCountText)[0];
        }
        // Verify that the total inventory grid item with the extracted count is visible on the page
        if (totalInventory === '0' || totalInventory === '1'){
        await expect(await this.totalInventoryGridItem.getByText(`(${totalInventory} item)`)).toBeVisible();
        } else{
        await expect(await this.totalInventoryGridItem.getByText(`(${totalInventory} items)`)).toBeVisible();
        }
    }

}
export default InventoryPage;
