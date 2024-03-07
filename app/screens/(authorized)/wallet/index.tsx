import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
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
const xrpl = require("xrpl");
const {
  GameEngineApiParameters,
  TransactionConstants,
} = require(".../../../app/constants/constants");

export default function WalletScreen({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [availableFunds, setAvailableFunds] = useState(0);
  const [xrpPriceInUSDOllars, setXrpPriceInUSDollars] = useState(0);

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  const getCredentials = async () => {
    try {
      const XRP_Address = await AsyncStorage.getItem("XRP_Address");
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

  async function checkIssuedCurrencyBalance(account, currencyCode, issuer) {
    // Connect to the XRP Ledger
    const client = new xrpl.Client("wss://xahau-test.net/");
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
      };
      fetchData();
    });

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
  }, [navigation, availableFunds]);

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="My Wallet" navigation={navigation} />

      <View style={styles.container}>
        <Text style={styles.headingText}>EverQuest Wallet </Text>
        <Text style={styles.amountText}>{availableFunds} EVR</Text>
        <Text style={styles.usdText}> {xrpPriceInUSDOllars*availableFunds} USD </Text>
      </View>

      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Wallet}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

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
});
