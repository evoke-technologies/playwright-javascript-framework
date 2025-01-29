class DashboardPage {

    constructor(page) {
        this.page = page;
        this.vehiclesMenu = page.locator('a').filter({ hasText: 'Vehicles' }).nth(1);
        this.changeRetailerButton = page.locator('//a[@role="button"]');
    }

}
export default DashboardPage;
