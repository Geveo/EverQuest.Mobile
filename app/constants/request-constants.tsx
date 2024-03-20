const RequestTypes = { 
    ACCOUNTS: "Accounts",  
    ADMIN: "Admin",  
}

const AccountsRequestSubTypes =  { 
    IS_ACCOUNT_EXIST: "IsAccountExist", 
    ADD_FUNDS_TRANSACTIONS: "AddFundsTransactions",
    GET_TRANSACTION_HISTORY: "GetTransactionHistory",
    GET_TRANSACTION_STATUS : "GetTransactionStatus",
    GET_PLAYER_ID: "GetPlayerID",
    GET_PLAYER_NAME: "GetPlayerName",
    UPDATE_TRANSACTION_RECORD: "UpdateTransactionRecord",
    GET_TRANSACTION_RECORD: "GetTransactionRecord",
    ADD_TOTAL_WINNING_RECORD: "AddTotalWinningRecord",
    GET_TOTAL_WINNING_RECORD: "GetTotalWinnings"
} 

module.exports = {
    RequestTypes,
    AccountsRequestSubTypes,
}