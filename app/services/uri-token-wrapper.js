const { sign, derive, XrplDefinitions, binary } = require('xrpl-accountlib');
const { XrplAccount, XrplApi, EvernodeConstants, Defaults } = require('evernode-js-client');
import axios from "axios";

const XAHAU_WSS_URL = 'wss://xahau.network';
const XAHAU_HTTP_URL = 'https://xahau.network';
const NETWORK_ID = 21337;

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

export default UriTokenHelper;