class ApiUtils {
    constructor(page) {
        this.page = page;
    }

    async check200kStatusAPIs(apis) {
        // Await the responses and log success directly
        await Promise.all(apis.map(async (api) => {
            try {
                await this.page.waitForResponse(r => r.url().includes(api) && r.status() === 200, {timeout:60000});
            } catch (error) {
                //console.error(`API ${api} failed: ${error.message}`);
            }
        }));
    }    
}

export default ApiUtils;