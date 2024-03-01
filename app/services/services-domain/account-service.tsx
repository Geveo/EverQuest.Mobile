import HotPocketClientService from "../hp-client-service";
const requestConstants = require('../../constants/request-constants');

export default class AccountService {

    static instance = null;

    constructor() {
        if (!AccountService.instance) {
            AccountService.instance = this;
        }
    }

    async hasAccount(message) {
        console.log("message", message);
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.IS_ACCOUNT_EXIST,
            data: message
        };

        var hasAccount = await this.submitToContract(messageObj);
        return hasAccount;
    }

    /*
     * Sample Submit Input To Contract Request.
     */
    async submitToContract(messageObj) {
        try {
            console.log("AllRequests", messageObj);
            var response = await HotPocketClientService.submitContractReadRequest(messageObj);
            console.log("AllResponse", response);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}