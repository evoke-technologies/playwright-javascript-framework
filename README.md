# playwright-javascript-framework
This project utilizes the Playwright framework for browser automation and testing using JavaScript and Node.js.

# Features

- **Automated Testing:** Playwright enables automated testing of the SNEDrive 2.0 Web App across multiple browsers to ensure functionality and reliability.
- **End-to-End Testing:** Write end-to-end tests that simulate real user interactions to validate the entire workflow of the SNEDrive 2.0 Web App.
- **Browser Compatibility:** Test the SNEDrive 2.0 Web App on different browsers such as Chrome, Firefox, and Safari to ensure consistent performance and user experience.

# Page Object Model
The SNEDrive 2.0 Web App e2e Automation project adopts the Page Object Model (POM) for organizing and managing test automation code.
This pattern abstracts the web pages into reusable classes called "page objects" that encapsulate the interaction with elements on specific pages.
Each page is represented by its own class, and tests interact with the page through its corresponding page object.

# Playwright Local Setup Guide
# 1. Install all the existing dependencies
  - check if package.json exists for the cloned repository
  - run npm i to install all the dependencies necessary to run the project
# 2. Write the test scripts under the src/tests always, and if you want to write the tests anywhere else and run them, change the testDir option in playwright.config.js. 
# 3. You can send the data using config.${environment}.file, as of now there are 4 environments - dev, prod, uat and qa.
# 4. The utlity file that handles data extraction from these files is configUtils.js, you need to import and set fetch required fields wherever required in your test to use them.
# 5. To run the test with specific environment and test type (smoke/regression), you need to annotate the test with @test-type:enviroment always, run the command npm run test:test-type:enviroment
# 6. Environments can be switched from one to another via NODE_ENV variable in .env file.
# 7. Once run, the azure reporter also starts for the configured user, and allure-reports are generated in a folder called reports, every new report is appended with the timestamp it was created on.
# 8. Inside each report, you have a allure-results folder that has all the screenshots/traces/videos captured and allure-report that has the generated allure-report, each report is opened directly after the test is run, if one needs to see the report individually, the command 
  npx allure open reports/{report-timestamp folder}/allure-report
# 9. Apart from these default reports as html and xml files created by playwright are available in test-results. 
# 10. Changes to report locations can be performed in playwright.config.js where the test run type based on headless can be set as well.
