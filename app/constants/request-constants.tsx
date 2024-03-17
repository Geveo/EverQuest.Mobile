const RequestTypes = { 
    ACCOUNTS: "Accounts",  
    ADMIN: "Admin",  
}

const AccountsRequestSubTypes =  { 
    IS_ACCOUNT_EXIST: "IsAccountExist", 
    ADD_FUNDS_TRANSACTIONS: "AddFundsTransactions",
    GET_TRANSACTION_HISTORY: "GetTransactionHistory",
    GET_PLAYER_ID: "GetPlayerID",
    UPDATE_TRANSACTION_RECORD: "UpdateTransactionRecord",
} 

module.exports = {
    RequestTypes,
    AccountsRequestSubTypes,
}