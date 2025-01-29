import LoginPage from '../login/loginPage';
import DashboardPage from '../dashboard/dashboardPage';
import InventoryPage from '../vehicle/inventoryPage';
import ApiUtils from '../../utils/apiUtils';
import Login from '../login/login'
import outlookPopup from '../login/outlookPopup';

class POMManager {
    constructor(page){
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.apiUtils = new ApiUtils(this.page);
        this.inventoryPage = new InventoryPage(this.page);
        this.login = new Login(this.page);
    }
    getLogin(){
        return this.login;
    }
    getLoginPage(){
        return this.loginPage;
    }
    getDashboardPage(){
        return this.dashboardPage;
    }
    getApiUtils(){
        return this.apiUtils;
    }
    getInventoryPage(){
        return this.inventoryPage;
    }
    getOutlookPopup(page){
        return new outlookPopup(page);
    }
}
export default POMManager;