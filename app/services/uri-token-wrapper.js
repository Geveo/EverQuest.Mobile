const { sign, derive, XrplDefinitions, binary } = require('xrpl-accountlib');
const { XrplAccount, XrplApi, EvernodeConstants, Defaults } = require('evernode-js-client');
import axios from "axios";

const XAHAU_WSS_URL = 'wss://xahau-test.net';
const XAHAU_HTTP_URL = 'https://xahau-test.net';
const NETWORK_ID = 21338;

let xrplApi = null;

async function initXahau() {
  Defaults.set({
    networkID: NETWORK_ID
  });
  if (XAHAU_WSS_URL)
    Defaults.set({
      rippledServer: XAHAU_WSS_URL
    });
  // BEGIN - Connect to XRPL API
  xrplApi = new XrplApi();
  Defaults.set({
    xrplApi: xrplApi
  })
  await xrplApi.connect();
}

async function deinitXahau() {
  if (xrplApi)
    await xrplApi.disconnect();
}

async function getAccountInfo(account) {
  return await xrplApi.getAccountInfo(account);
}

async function httpPost(url, body) {
  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// function httpPost(url, body) {
//   return new Promise((resolve, reject) => {
//     // Convert the request body object to a string
//     const data = JSON.stringify(body);

//     // Parse the URL
//     const urlObj = new URL(url);
//     // Define the options for the request
//     const options = {
//       hostname: urlObj.hostname,
//       port: urlObj.port,
//       path: urlObj.pathname,
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': data.length
//       }
//     };

//     // Create the request
//     const req = https.request(options, (res) => {
//       let response = '';

//       // Collect response data
//       res.on('data', (chunk) => {
//         response += chunk;
//       });

//       // Resolve the promise on end
//       res.on('end', () => {
//         try {
//           // Attempt to parse JSON response
//           resolve(JSON.parse(response));
//         } catch (e) {
//           reject(e);
//         }
//       });
//     });

//     // Reject the promise on request error
//     req.on('error', (error) => {
//       reject(error);
//     });

//     // Write the request body and end the request
//     req.write(data);
//     req.end();
//   });
// }

async function getXahauDefinition() {
  const body = {
    "method": "server_definitions",
    "params": [{}]
  };

  let definition = await httpPost(XAHAU_HTTP_URL, body);

  const xrplDefinitions = new XrplDefinitions(definition.result);
  return xrplDefinitions;
}

async function getAccount(secret) {
  return derive.familySeed(secret);
}

async function prepareTx(uri, transactionType, sourceAccount, destinationAccount, flag, amount, fee, sequence, lastLedgerSequence) {
  var preparedTransaction = {
    "TransactionType": "URITokenMint",
    "Account": sourceAccount,
    "Flags": flag,
    "URI": uri,
    "Destination": destinationAccount,
    "Amount": amount,
    "Fee": fee,
    "Sequence": sequence,
    "LastLedgerSequence": lastLedgerSequence,
    "NetworkID": NETWORK_ID
  };
  return preparedTransaction;
}

async function signTx(preparedTx, account, definition) {
  const signed = sign(preparedTx, account, definition);

  const signedTxn = {
    hash: signed.id,
    tx_blob: signed.signedTransaction
  }

  return signedTxn;
}

async function getCurrentLedgerIndex() {
  try {
    const body = {
      "method": "server_info",
      "params": [{}]
    };

    let response = await httpPost(XAHAU_HTTP_URL, body);

    // Extract the current ledger index from the response
    const ledgerIndex = response.result.info.validated_ledger.seq;
    return ledgerIndex;
  } catch (error) {
    console.error('Error getting current ledger index:', error);
    throw error; // Rethrow or handle as needed
  }
}

async function uriTokenBurn(sourceAccount, sourceSecret, destinationAccount, uri) {
  await initXahau();

  const accointInfo = await getAccountInfo(sourceAccount);
  let lastLedgerSequence = ((await getCurrentLedgerIndex()) + 10);

  var xrpAccountDetails = new XrplAccount(destinationAccount);
  var uriToken = await xrpAccountDetails.getURITokenByUri(uri, true);

  console.log(uriToken);

  var preparedTx = {
    "TransactionType": "URITokenBurn",
    "Account": sourceAccount,
    "URITokenID": uriToken.index,
    "Fee": "10",
    "Sequence": accointInfo.Sequence,
    "LastLedgerSequence": lastLedgerSequence,
    "NetworkID": NETWORK_ID
  };

  const definition = await getXahauDefinition();
  const account = await getAccount(sourceSecret);
  const signedTx = await signTx(preparedTx, account, definition);
  const result = await xrplApi.submitAndWait(preparedTx, signedTx.tx_blob);

  console.log(result);

  await deinitXahau();
}

async function createAndSellUriToken(sourceAccount, sourceSecret, destinationAccount, uri, amount) {
  console.log("Inside uri token wrapper create and sell")
  await initXahau();

  const accointInfoFirst = await getAccountInfo(sourceAccount);
  let lastLedgerSequenceFirst = ((await getCurrentLedgerIndex()) + 10);

  var preparedTxMint = {
    "TransactionType": "URITokenMint",
    "Account": sourceAccount,
    "Flags": 1,
    "URI": uri,
    "Destination": destinationAccount,
    "Amount": amount,
    "Fee": "10",
    "Sequence": accointInfoFirst.Sequence,
    "LastLedgerSequence": lastLedgerSequenceFirst,
    "NetworkID": NETWORK_ID
  };

  const definition = await getXahauDefinition();
  const account = await getAccount(sourceSecret);
  const signedTxMint = await signTx(preparedTxMint, account, definition);
  const resultMint = await xrplApi.submitAndWait(preparedTxMint, signedTxMint.tx_blob);

  console.log(resultMint);

  const accointInfoSecond = await getAccountInfo(sourceAccount);
  let lastLedgerSequenceSecond = ((await getCurrentLedgerIndex()) + 10);

  var xrpAccountDetails = new XrplAccount(sourceAccount);
  var uriToken = await xrpAccountDetails.getURITokenByUri(uri, true);

  console.log(uriToken);

  var preparedTxSell = {
    "TransactionType": "URITokenCreateSellOffer",
    "Account": sourceAccount,
    "URITokenID": uriToken.index,
    "Destination": destinationAccount,
    "Amount": amount,
    "Fee": "10",
    "Sequence": accointInfoSecond.Sequence,
    "LastLedgerSequence": lastLedgerSequenceSecond,
    "NetworkID": NETWORK_ID
  };

  const signedTxSell = await signTx(preparedTxSell, account, definition);
  const resultSell = await xrplApi.submitAndWait(preparedTxSell, signedTxSell.tx_blob);

  console.log(resultSell);

  await deinitXahau();
}


async function buyUriToken(sourceAccount, destinationAccount, destinationSecret, uri, amount) {
  await initXahau();

  const accointInfo = await getAccountInfo(destinationAccount);
  let lastLedgerSequence = ((await getCurrentLedgerIndex()) + 10);

  var xrpAccountDetails = new XrplAccount(sourceAccount);
  var uriToken = await xrpAccountDetails.getURITokenByUri(uri, true);

  console.log(uriToken);

  var preparedTx = {
    "TransactionType": "URITokenBuy",
    "Account": destinationAccount,
    "URITokenID": uriToken.index,
    "Amount": amount,
    "Fee": "10",
    "Sequence": accointInfo.Sequence,
    "LastLedgerSequence": lastLedgerSequence,
    "NetworkID": NETWORK_ID
  };

  const definition = await getXahauDefinition();
  const account = await getAccount(destinationSecret);
  const signedTx = await signTx(preparedTx, account, definition);
  const result = await xrplApi.submitAndWait(preparedTx, signedTx.tx_blob);

  console.log(result);

  await deinitXahau();
}

const UriTokenHelper = {
  uriTokenBurn,
  createAndSellUriToken,
  buyUriToken,
};

//module.exports = UriTokenHelper;
export default UriTokenHelper;

/*const sourceAccount = "rEF6EoYPKiPBuBcuJ33dXV773adWQUBxEb";
const sourceSecret = "ssUaRpvSoGdkxM3HsczVfKXDGyxAC";
const destinationAccount="rJQWTGnJ6zYHtmymcohFCZAW7LqZEYMRrV";
const destinationSecret = "shQR4xwtVbr3ynsVyr8G2EfbSkWsp";
const buyerAccount = "rEALPVCk8pwkDLJemLQd4TN3hrphTZWdJY";
const buyerSecret = "shyjUnWWT8ZxzSboDPti3qoqQxVgP";
const sellerAccount = "rHMqT7UtJigHFGayDQPakyLFZRMaoQsvT9";
const sellerSecret = "ss5n83QF4tvwem3oScnEXaAXxkuG7";
const issuedCurrency = "EVR";
const issuerAccount = "rM1fW221wzo8DW3CvXBgmCVahQ8cxxfLNz";
const nativeCurrency = "XAH";
const uri = "476576656F74657374313233343536";


async function main() {
  try {
        //await createAndSellUriToken(sourceAccount, sourceSecret, destinationAccount, uri, "5");
        //await buyUriToken(sourceAccount,destinationAccount, destinationSecret, uri,"5");
        await uriTokenBurn(sourceAccount, sourceSecret, destinationAccount, uri);
          
      
  } catch (e) {
      console.log(e)
  }
}

main().catch((e) => { console.error(e); process.exit(1); });*/