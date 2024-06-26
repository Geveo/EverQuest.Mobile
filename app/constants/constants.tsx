const UrlConstants = {
    XRPL_URL: "wss://s.altnet.rippletest.net:51233",
    CONTRACT_URLS: ["wss://dapps-dev.geveo.com:26313"]
}

const TransactionConstants = {
    //ISSUER_ADDRESS: "rM1fW221wzo8DW3CvXBgmCVahQ8cxxfLNz",
    ISSUER_ADDRESS: "rEvernodee8dJLaFsujS6q1EiXvZYmHXr8",
    ADMIN_ADDRESS: "rm2yHK71c5PNnS8JdFbYf29H3YDEa5Y6y",
    ADMIN_SECRET: "shEqqDcto7dsCb9toeB6QPPNQRXKM",
    CURRENCY: "EVR",
    URI_TOKEN_TNX_URL: "http://192.168.94.123:3000"
}

const GameEngineApiParameters = {
    URL: "http://192.168.94.123:7189"
}

const TransactionStatus = {
    JOINED: "JOINED",
    SOLD: "SOLD",
    REDEEMED: "REDEEMED",
    BURNED: "BURNED"
}

module.exports = {
    UrlConstants,
    TransactionConstants,
    GameEngineApiParameters,
    TransactionStatus,
}