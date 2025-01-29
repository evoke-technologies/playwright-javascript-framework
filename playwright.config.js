// Import required modules
import {defineConfig} from '@playwright/test';
import {getConfig} from './src/utils/configUtils';
import {devices} from "playwright";
import dotenv from 'dotenv';

dotenv.config();

const timestamp = process.env.TIMESTAMP;
console.log('TIMESTAMP:', process.env.TIMESTAMP);
if (!process.env.TIMESTAMP) {
  throw new Error('TIMESTAMP environment variable is required for generating reports.');
}


module.exports = defineConfig({
    testDir: './src/tests', 
    outputDir: 'artifacts', 
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    // retries: process.env.CI ? 0 : 3,
    /* Opt out of parallel tests on CI. */
    // workers: process.env.CI ? 1 : undefined,
    timeout: 360000, 
    reporter: [
        ['junit', { outputFile: 'test-results/xml/test-results.xml' }],
        ['html', { outputFolder: 'test-results/html/', outputFile: 'index.html', open: 'never' }],
        ['allure-playwright', {
            resultsDir: `reports/report--${timestamp}/allure-results`, 
          }],
        [
            '@alex_neo/playwright-azure-reporter',
            {
                orgUrl: 'https://dev.azure.com/dineshbukka/',
                token: process.env.AZURE_TOKEN,
                planId: 1,
                projectName: 'Automation Testing',
                environment: process.env.NODE_ENV,
                logging: true,
                testRunTitle: 'SNEDrive 2.0 Web App Test Run',
                publishTestResultsMode: 'testRun',
                uploadAttachments: true,
                attachmentsType: ['screenshot', 'trace', /test.*/],
                testRunConfig: {
                    configurationIds: [2],
                },
            }
        ],
     ],
    use: {
        headless: false, 
        browserName: 'chromium',
        channel: 'chrome',
        trace: 'retain-on-failure', 
        actionTimeout: 60000,
        acceptDownloads: true,
        ignoreHTTPSErrors: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        // launchOptions: {
        //     slowMo: 100,
        // },
        //headless: false,
        //storageState: './tests/common/storage_state.json',
        //viewport: { width: 1920, height: 1080 }, // Set the desired viewport size
        //testIdAttribute:'data-qa-id',
    },
    projects: [
        {
            name: process.env.NODE_ENV,
            use: {
                baseURL: getConfig().baseUrl,
                browserName: 'chromium', // Use Chrome browser
                ...devices['Desktop Chrome'], channel:'chrome',
                //viewport: { width: 1600, height: 800 },
            },
            retries: 0,

        },
    ],
});