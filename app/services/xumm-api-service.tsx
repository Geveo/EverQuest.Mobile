import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Xumm} from 'xumm';
import {XummSdkJwt} from 'xumm-sdk';
import AccountService from './services-domain/account-service';
const {
  TransactionConstants,
} = require(".../../../app/constants/constants");

export default class XummApiService {
  private apiUrl: string = 'https://xumm.app/api/v1/platform';
  private xumm: Xumm;
  private token: string;

  constructor() {}

  async init() {
    this.token = await AsyncStorage.getItem('token');
    console.log("Token: ", this.token)
    await this.getXummInstance();
  }

  async getXummInstance(): Promise<Xumm> {
    this.xumm = new Xumm(this.token);
    return this.xumm;
  }

  private getCommonRequestHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.token,
      accept: 'application/json',
    };
  }

  ping() {
    return axios.get(this.apiUrl + '/ping', {
      headers: this.getCommonRequestHeaders(),
    });
  }

  async getCurrentExchangeRate(currencyCode: string) {
    return axios.get(this.apiUrl + '/rates/' + currencyCode, {
      headers: this.getCommonRequestHeaders(),
    });

    // sample response
    // {
    //   "USD": 1,
    //   "XRP": 0.627231,
    //   "XAH": 0.1135,
    //   "__meta": {
    //     "currency": {
    //       "en": "US Dollar",
    //       "code": "USD",
    //       "symbol": "$",
    //       "isoDecimals": 2
    //     }
    //   }
    // }
  }

  /**
   * Get account profile avatar image url
   */
  // async getAvatar(rAddress: string) {
  //   return 'https://xumm.app/avatar/' + rAddress + '.png';
  // }

  /**
   * Get account profile
   */
  async getAccountProfile(rAddress: string) {
    return axios.get(this.apiUrl + '/account-meta/' + rAddress, {
      headers: this.getCommonRequestHeaders(),
    });

    // sample response
    // {
    //   "account": "rM9J9GskMWkDEU5yarJzYkqgXPwLQw4QqQ",
    //   "kycApproved": false,
    //   "xummPro": false,
    //   "blocked": false,
    //   "force_dtag": false,
    //   "avatar": "https://xumm.app/avatar/rM9J9GskMWkDEU5yarJzYkqgXPwLQw4QqQ.png",
    //   "xummProfile": {
    //     "accountAlias": null,
    //     "ownerAlias": null,
    //     "slug": null,
    //     "profileUrl": null,
    //     "accountSlug": null,
    //     "payString": null
    //   },
    //   "thirdPartyProfiles": [],
    //   "globalid": {
    //     "linked": null,
    //     "profileUrl": null
    //   }
    // }
  }

  async buyUriToken(playerAddress: string, amount: string, uriTokenId: any) {
    // amount = 1 = 0.000001 XAH
    var acountService = new AccountService();
    try {
      this.token = await AsyncStorage.getItem('token');
      const Sdk = new XummSdkJwt(this.token);
      const pong = await Sdk.ping();
      console.log(pong.application);

      const payload = Sdk.payload.createAndSubscribe(
        {
          TransactionType: 'URITokenBuy',
          URITokenID: uriTokenId,
          Fee: "10",
          NetworkID: 21338,
          Amount: {
            currency: TransactionConstants.CURRENCY,
            value: amount,
            issuer: TransactionConstants.ISSUER_ADDRESS
          },
        },
        e => {
          console.log(e.data);

          // todo: save the payload uuid to database along with the transaction details

          if (typeof e.data.signed !== 'undefined') {
            return e.data;
          }
        },
      );

      console.log((await payload).created.next.always);
      await payload;
      console.log('Payment request submission completed.');

      var transactionObject = {
        Player_ID: 10001,
        Game_ID: 2151,
        Transaction_Date: new Date().toISOString(),
        URI_Token_Index: uriTokenId,
        Amount: "5"
      }
      var response = await acountService.addFundsTransactions(transactionObject);
      console.log(response)
    } catch (e) {
      console.log({error: e.message, stack: e.stack});
    }
  }

  async SellUriToken(amount: string, uriTokenId: any) {
    // amount = 1 = 0.000001 XAH
    var acountService = new AccountService();
    try {
      this.token = await AsyncStorage.getItem('token');
      const Sdk = new XummSdkJwt(this.token);
      const pong = await Sdk.ping();
      console.log(pong.application);

      const payload = Sdk.payload.createAndSubscribe(
        {
          TransactionType: 'URITokenCreateSellOffer',
          URITokenID: uriTokenId,
          Fee: "10",
          Destination: TransactionConstants.ADMIN_ADDRESS,
          NetworkID: 21338,
          Amount: {
            currency: TransactionConstants.CURRENCY,
            value: amount,
            issuer: TransactionConstants.ISSUER_ADDRESS
          },
        },
        e => {
          console.log(e.data);

          // todo: save the payload uuid to database along with the transaction details

          if (typeof e.data.signed !== 'undefined') {
            return e.data;
          }
        },
      );

      console.log((await payload).created.next.always);
      await payload;
      console.log('Payment request submission completed.');

      var transactionObject = {
        Player_ID: 10002,
        Game_ID: 1130,
        URI_Token_Index: uriTokenId,
        Amount: "1"
      }
      var response = await acountService.addFundsTransactions(transactionObject);
      console.log(response)
    } catch (e) {
      console.log({error: e.message, stack: e.stack});
    }
  }

  /**
   * This will make a payment request in Xaman, user must approve it via Xaman app
   */
  async makePaymentRequest(destinationRAddress: string, amount: string) {
    // amount = 1 = 0.000001 XAH
    var acountService = new AccountService();
    try {
      this.token = await AsyncStorage.getItem('token');
      const Sdk = new XummSdkJwt(this.token);
      const pong = await Sdk.ping();
      console.log(pong.application);

      const payload = Sdk.payload.createAndSubscribe(
        {
          TransactionType: 'Payment',
          Destination: destinationRAddress,
          Amount: {
            currency: TransactionConstants.CURRENCY,
            value: amount,
            issuer: TransactionConstants.ISSUER_ADDRESS
          },
        },
        e => {
          console.log(e.data);

          // todo: save the payload uuid to database along with the transaction details

          if (typeof e.data.signed !== 'undefined') {
            return e.data;
          }
        },
      );

      console.log((await payload).created.next.always);
      await payload;
      var transactionObject = {
        Player_ID: "10002",
        Transaction_Date: new Date,
        Description: "Payment for Test Leaugue 5 - 20 EVR game.",
        Amount: 5
      }
      var response = await acountService.addFundsTransactions(transactionObject);
      console.log(response)
      console.log('Payment request submission completed.');
    } catch (e) {
      console.log({error: e.message, stack: e.stack});
    }
  }

  /**
   * Get transaction details by using payload uuid
   */
  async getTransactionDetails(payload_uuid: string) {
    return axios.get(this.apiUrl + '/payload/' + payload_uuid, {
      headers: this.getCommonRequestHeaders(),
    });

    // sample response
    // {
    //   "meta": {
    //     "exists": true,
    //     "uuid": "8d9da6a3-ffdc-4e73-ae31-75ab74d290bd",
    //     "multisign": false,
    //     "submit": true,
    //     "pathfinding": false,
    //     "pathfinding_fallback": false,
    //     "force_network": null,
    //     "destination": "rM9J9GskMWkDEU5yarJzYkqgXPwLQw4QqQ",
    //     "resolved_destination": "rM9J9GskMWkDEU5yarJzYkqgXPwLQw4QqQ",
    //     "resolved": true,
    //     "signed": true,
    //     "cancelled": false,
    //     "expired": false,
    //     "pushed": true,
    //     "app_opened": true,
    //     "opened_by_deeplink": true,
    //     "return_url_app": null,
    //     "return_url_web": null,
    //     "is_xapp": false,
    //     "signers": null
    //   },
    //   "application": {
    //     "name": "RoadRush",
    //     "description": "Evernode network based taxi service app to demonstrate distributed computing and crypto currency features for a codeathon organised by Evernode.",
    //     "disabled": 0,
    //     "uuidv4": "ac9f5053-cf7a-41a4-b6a4-15531f05b822",
    //     "icon_url": "https://cdn.xumm.pro/cdn-cgi/image/width=500,height=500,quality=75,fit=crop/app-logo/c3214b53-f3bd-4ef1-9b88-ad04c61028f3.png",
    //     "issued_user_token": "6dd95b33-0794-4f61-ab47-eeb0c4ee9751"
    //   },
    //   "payload": {
    //     "tx_type": "Payment",
    //     "tx_destination": "rM9J9GskMWkDEU5yarJzYkqgXPwLQw4QqQ",
    //     "tx_destination_tag": null,
    //     "request_json": {
    //       "TransactionType": "Payment",
    //       "Destination": "rM9J9GskMWkDEU5yarJzYkqgXPwLQw4QqQ",
    //       "Amount": "1",
    //       "Account": "rpkjaCPXbT5i7Vb1BnwozNp8E67o3s5AFD"
    //     },
    //     "origintype": "EVENT_LIST",
    //     "signmethod": "PIN",
    //     "created_at": "2024-03-08T04:02:54Z",
    //     "expires_at": "2024-03-09T04:02:54Z",
    //     "expires_in_seconds": 85938
    //   },
    //   "response": {
    //     "hex": "120000210000535A242D7C1191201B00B0C1D161400000000000000168400000000000000C73210204854EF6AC3B774455A0058C76C8958923204655DC2971A46610EE46D15F1C0374473045022100C6A969A2C30B98AA7D41C37B1FBBE1ED6A9BB591A348B119CA8473037A58BFE302200D0296DB08B15E6D0307FE521EA9A16C6D31F5B63F2030D3FA77D47BD6734D558114133D274957DCA896146F7904A9C87139C02C09DE8314DCF42733685F79A6F26A1909EAA7474304A5A2AA",
    //     "txid": "F4F09CE88D366A26499BBC3767D50FD73371A40624833A56C96AA604F3E0E265",
    //     "resolved_at": "2024-03-08T04:05:20Z",
    //     "dispatched_to": "wss://xahau-test.net",
    //     "dispatched_nodetype": "XAHAUTESTNET",
    //     "dispatched_result": "tesSUCCESS",
    //     "dispatched_to_node": true,
    //     "environment_nodeuri": "wss://xahau-test.net",
    //     "environment_nodetype": "XAHAUTESTNET",
    //     "multisign_account": "",
    //     "account": "rpkjaCPXbT5i7Vb1BnwozNp8E67o3s5AFD",
    //     "signer": "rpkjaCPXbT5i7Vb1BnwozNp8E67o3s5AFD",
    //     "user": "de59d86b-72b0-4c61-b3b7-3498ad5af056",
    //     "environment_networkid": 21338
    //   },
    //   "custom_meta": {
    //     "identifier": null,
    //     "blob": null,
    //     "instruction": null
    //   }
    // }
  }
}
