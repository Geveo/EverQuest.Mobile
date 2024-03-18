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
        console.log("xrpaddress", message);
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.IS_ACCOUNT_EXIST,
            data: message
        };

        var hasAccount = await this.submitToContract(messageObj);
        return hasAccount.success;
    }

    async getPlayerID(xrpaddress) {
        console.log("Gettting player Id")
        var message = {
            XRP_Address: xrpaddress,
        };
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.GET_PLAYER_ID,
            data: message
        };
        var response = await this.submitToContract(messageObj);
        console.log("PlayerID response: ", response)
        return response.success;
    }

    async getPlayerName(xrpaddress) {
        console.log("Gettting player Name")
        var message = {
            XRP_Address: xrpaddress,
        };
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.GET_PLAYER_NAME,
            data: message
        };
        var response = await this.submitToContract(messageObj);
        console.log("PlayerName response: ", response)
        return response.success;
    }

    async addFundsTransactions(message){
        console.log("Creating a transaction record:", message);
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.ADD_FUNDS_TRANSACTIONS,
            data: message
        };

        var response = await this.SubmitInputToContract(messageObj);
        return response;
    }

    async getTransactionHistory(message){
        console.log("Geting a transaction history record:", message);
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.GET_TRANSACTION_HISTORY,
            data: message
        };

        var response = await this.submitToContract(messageObj);
        return response;
    }

    async getTransactionRecord(message){
        console.log("Geting a transaction record:", message);
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.GET_TRANSACTION_RECORD,
            data: message
        };

        var response = await this.submitToContract(messageObj);
        return response;
    }

    async getTransactionStatus(message){
        console.log("Getiing a transaction record:", message);
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.GET_TRANSACTION_STATUS,
            data: message
        };

        var response = await this.submitToContract(messageObj);
        return response;
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

    async SubmitInputToContract(messageObj) {
        try {
            console.log("AllRequests", messageObj);
            var response = await HotPocketClientService.submitInputToContract(messageObj);
            console.log("AllResponse", response);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateTransactionStatus(message){
        console.log("Updating Transaction Status:", message);
        const messageObj = {
            service: requestConstants.RequestTypes.ACCOUNTS,
            action: requestConstants.AccountsRequestSubTypes.UPDATE_TRANSACTION_RECORD,
            data: message
        };

        var response = await this.SubmitInputToContract(messageObj);
        return response;
    }
}