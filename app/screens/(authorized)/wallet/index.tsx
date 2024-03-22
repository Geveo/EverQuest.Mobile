import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import PageTitle from "../../../components/page-title/page-title";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccountService from "../../../services/services-domain/account-service";
import axios from "axios";
const xrpl = require("xrpl");
const {
  GameEngineApiParameters,
  TransactionConstants,
} = require(".../../../app/constants/constants");

export default function WalletScreen({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [availableFunds, setAvailableFunds] = useState(0);
  const [xrpPriceInUSDOllars, setXrpPriceInUSDollars] = useState(0);
  const [transactionList, setTransactionList] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(0);

  const [plyaerID, setPlayerID] = useState("10002");

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  const getCredentials = async () => {
    try {
      const XRP_Address = await AsyncStorage.getItem("XRP_Address");
      const playerId = await AsyncStorage.getItem("playerId");
      setPlayerID(playerId);
      console.log("XRP Address: ", XRP_Address);
      const secret = await AsyncStorage.getItem("secret");
      console.log("Secret: ", secret);
      return { XRP_Address, secret };
    } catch (error) {
      console.error("Error getting credentials:", error);
    }
  };

  async function fetchXrpPrice() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd"
      );
      const data = await response.json();
      const xrpPriceInUSD = data.ripple.usd;
      return xrpPriceInUSD;
    } catch (error) {
      console.error("Error fetching XRP price:", error);
      return null;
    }
  }
  
  async function getTransactionHistory(playerID){
    var acountService = new AccountService();
    var msgObj = {
      Player_ID: playerID
    }
    acountService.getTransactionHistory(msgObj)
      .then((response) => {
        if (response.data != undefined) {
          setShowLoadingIndicator(false);
          const transactions = response.data.map((item, index) => ({
            key: index,
            date: item.Transaction_Date.substring(0, 10),
            gameId: item.Game_ID.toString(),
            amount: item.Amount,
            status: item.Transaction_Status,
          }));
          console.log("Transaction List", transactions);

          setTransactionList(transactions)
        }
      })
      .catch((error) => {
        console.error("Error while getting transaction records:", error);
      });
  }

  const getEvernodeValue = async () => {
    try {
      const response:any = await axios.get('https://api.coinranking.com/v2/coin/k71c5qIRt/price', {
        headers: {
          'x-access-token': 'coinrankingef9d1323eced6841d03361917b386e39d4201d3e79fa8e2c'
        },
      }) 
      console.log("Evernode Price", response.data.data.price);
      
      const priceAsFloat = parseFloat(response.data.data.price);
      
      setExchangeRate(priceAsFloat);
      
    } catch (error) {
      console.error("Error fetching Evernode price:", error);
      return null;
    }
  };

  async function checkIssuedCurrencyBalance(account, currencyCode, issuer) {
    // Connect to the XRP Ledger
    const client = new xrpl.Client("wss://xahau.network/");
    await client.connect();

    // Request the account lines (trust lines) for the specified account
    const response = await client.request({
      command: "account_lines",
      account: account,
      ledger_index: "validated",
    });

    // Disconnect from the client
    await client.disconnect();

    // Filter the trust lines to find balances for the specified currency and issuer
    const currencyBalances = response.result.lines.filter(
      (line) =>
        line.currency === currencyCode &&
        (issuer ? line.account === issuer : true)
    );

    if (currencyBalances.length > 0) {
      //console.log(`Balances for ${currencyCode}:`);
      currencyBalances.forEach((line) => {
        //console.log(`Issuer: ${line.account}, Balance: ${line.balance}, Limit: ${line.limit}`);
        setAvailableFunds(line.balance);
      });
    } else {
      console.log(`No balance found for ${currencyCode} issued by ${issuer}`);
    }
  }

  useEffect(() => {
    getCredentials().then((credentials) => {
      checkIssuedCurrencyBalance(
        credentials.XRP_Address,
        TransactionConstants.CURRENCY,
        TransactionConstants.ISSUER_ADDRESS
      );
      const fetchData = async () => {
        const xrpPriceInUSD = await fetchXrpPrice();
        if (xrpPriceInUSD) {
          checkIssuedCurrencyBalance(
            credentials.XRP_Address,
            TransactionConstants.CURRENCY,
            TransactionConstants.ISSUER_ADDRESS
          );
          setXrpPriceInUSDollars(xrpPriceInUSD);
        }
        getTransactionHistory(plyaerID);
      };
      fetchData();
      
      getEvernodeValue();
    }
    );

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.isFocused()) {
          BackHandler.exitApp();
          return true;
        }
        return false;
      }
    );

    return () => {
      if (backHandler.remove) {
        backHandler.remove();
      }
    };
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View key={item.key} style={styles.transactionItem}>
      <Text>{item.date}</Text>
      <Text>{item.gameId}</Text>
      <Text>
        {item.amount} EVR  
      </Text>
      <Text>{item.status != "JOINED" ? ( <Text style={{ color: 'green' }}>▲</Text>): (<Text style={{ color: 'red' }}> ▼</Text>)}</Text>
    </View>
  );
  
    return (
      <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="My Wallet" navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.headingText}>EverQuest Wallet</Text>
        <Text style={styles.amountText}>{availableFunds} EVR</Text>
        <Text style={styles.usdText}>{exchangeRate * availableFunds} USD</Text>
        </View>
        <View style={styles.transactionHistorycontainer}>
          <Text style={styles.historyHeading}>Transaction History</Text>
          {transactionList.length > 0 ? (
            <FlatList
              data={transactionList}
              renderItem={renderItem}
              keyExtractor={item => item.key}
            />
          ) : (
            <Text>No transactions found.</Text>
          )}
        </View>

        <EQBottomNavigationBar
          navigation={navigation}
          selectedTab={BottomNavigationButtons.Wallet}
          onTapCallback={onBottomNavigationTapped}
        />
        </AuthorizedLayout>
    );
  };

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alighItems: "right",
    padding: 40,
    justifyContent: "space-between",
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.bottomNavGreen,
  },
  transactionHistorycontainer:{
    alighItems: "right",
    padding: 40,
    justifyContent: "space-between",
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.bottomNavGreen,
    marginBottom: 150,
  },
  headingText: {
    fontSize: 30,
    color: AppTheme.colors.darkGrey,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 50,
    color: AppTheme.colors.darkGrey,
    marginTop: 20,
  },
  usdText: {
    fontSize: 20,
    color: AppTheme.colors.darkGrey,
    marginTop: 20,
    fontWeight: "bold",
  },
  historyHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
});
