// Importing necessary libraries
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import PageTitle from "../../../components/page-title/page-title";
import ChallengeItem from "../../../components/challenge-item/challenge-item";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { Wallet } from "xrpl";
const xrpl = require("xrpl");

// Define the Tournament component
export default function Tournament({ navigation, route }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const { title, gameId } = route.params;
  const [availableFunds, setAvailableFunds] =useState(0);

  // Function to handle bottom navigation tapped event
  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
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
    const currencyBalances = response.result.lines.filter(line => 
      line.currency === currencyCode && (issuer ? line.account === issuer : true)
    );
  
    if (currencyBalances.length > 0) {
      console.log(`Balances for ${currencyCode}:`);
      currencyBalances.forEach(line => {
        console.log(`Issuer: ${line.account}, Balance: ${line.balance}, Limit: ${line.limit}`);
        setAvailableFunds(line.balance);
      });
    } else {
      console.log(`No balance found for ${currencyCode} issued by ${issuer}`);
    }
  }

  async function sendXRP(fromAddress, secret, toAddress, amount) {
    // Connect to the XRP Ledger
    const client = new xrpl.Client("wss://xahau-test.net/")
    await client.connect()
  
    // Autofill the transaction to get the proper sequence, fee, and lastLedgerSequence
    const preparedTx = await client.autofill({
      "TransactionType": "Payment",
      "Account": fromAddress,
      "Amount": {
        currency: "EVR", // The currency code, e.g., "EVR"
        issuer: "rM1fW221wzo8DW3CvXBgmCVahQ8cxxfLNz",     // The issuer's address of the currency
        value: amount       // The amount of the currency to send
      }, // Convert the amount to drops
      "Destination": toAddress
    })
  
    // Sign the transaction with the secret key of the sender
    //const {signedTransaction, id} = xrpl.sign(preparedTx, secret)

    const wallet = xrpl.Wallet.fromSeed(secret, { algorithm: xrpl.ECDSA});

    //console.log(wallet);
  
    // Submit the signed blob to the ledger
    const result = await client.submitAndWait(preparedTx,{
        autofill: true, // Adds in fields that can be automatically set like fee and last_ledger_sequence
        wallet: wallet
      })
  
    console.log('Transaction result:', result)
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      navigation.navigate("Challenge")
      //console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${id}`)
    } else {
      console.log("Transaction failed:", result.result.meta.TransactionResult)
    }
  
    // Disconnect from the client
    await client.disconnect()
  }

  // Function to handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Effect hook to handle hardware back press
  useEffect(() => {
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call your functions here
      checkIssuedCurrencyBalance("rEALPVCk8pwkDLJemLQd4TN3hrphTZWdJY", "EVR", "rM1fW221wzo8DW3CvXBgmCVahQ8cxxfLNz");
      getAllChallenges(gameId);
    });
  
    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  }, [navigation]); // Add navigation as a dependency

  async function getAllChallenges(gameId) {
    try {
      console.log(" Before request: ");
      const response = await axios.get(
        `http://192.168.1.15:7189/api/games/getLeagueGamesByLeagueId?leagueId=${gameId}`
      );
      console.log("Response: ", response.data.Games);
      setChallenges(response.data.Games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }
  const fromAddress = "rEALPVCk8pwkDLJemLQd4TN3hrphTZWdJY"
  const secret = "shyjUnWWT8ZxzSboDPti3qoqQxVgP"
  const toAddress = "rm2yHK71c5PNnS8JdFbYf29H3YDEa5Y6y"
  const amount = "20" // Amount of EVR to send
  
  //sendXRP(fromAddress, secret, toAddress, amount).catch(console.error)
  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <View>
            <TouchableOpacity onPress={handleBackPress}>
              <Text style={styles.backButtonLeft}>Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.titleContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
          </View>

          <View>
            <TouchableOpacity onPress={handleBackPress}>
              <Text style={styles.backButtonRight}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userContainer}>
          <View style={styles.leftSide}>
            <Image
              style={styles.profileImage}
              resizeMethod="resize"
              resizeMode="contain"
              // source={{
              //   uri: userObj
              //     ? userObj.ImageURL === ""
              //       ? "https://via.placeholder.com/250"
              //       : userObj.ImageURL
              //     : "https://via.placeholder.com/250",
              // }}
              source={require("../../../assets/images/Avatar.png")}
            />
            <Text style={styles.userName}>Test User</Text>
            <Text style={styles.userEmail}>test@test.com</Text>
          </View>
          <View style={styles.rightSide}>
            <View style={styles.top}>
              <Text style={styles.RightHeading}> Available Amount</Text>
              <Text style={styles.RightSubHeading}>{availableFunds} EVR</Text>
            </View>
            <View style={styles.bottom}>
              <Text style={styles.RightHeading}>Total Winnings</Text>
              <Text style={styles.RightSubHeading}>0 EVR</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.gamesContainer}>
        {challenges.map((challenge) => (
          <ChallengeItem
            key={challenge.GameId}
            navigation={navigation}
            amount={challenge.GameName} // Assuming GameName contains the amount
            playerCount={12} // You may update these values as needed
            minimumPlayerCount={6} // You may update these values as needed
            callParentMethod={() =>  sendXRP(fromAddress, secret, toAddress, amount) }
            //pathOnPress={"Challenge"} // Assuming this is the path onPress action
          />
        ))}
      </ScrollView>

      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Sports}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: AppTheme.colors.buttonGreen,
  },
  gamesContainer: {
    marginBottom: 100,
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    height: 130,
    width: screen.width * 0.9,
    backgroundColor: AppTheme.colors.white,
    padding: 20,
    marginVertical: 20,
    borderRadius: 15,
  },
  leftSide: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
  },
  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
  },
  top: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: 10,
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 10,
  },
  RightHeading: {
    fontSize: 14,
    fontWeight: "400",
  },
  RightSubHeading: {
    fontSize: 12,
    color: AppTheme.colors.textGrey,
    fontWeight: "bold",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  userName: {
    fontSize: 14,
    fontWeight: "400",
    color: AppTheme.colors.black,
  },
  userEmail: {
    fontSize: 12,
    color: AppTheme.colors.textGrey,
  },
  headingContainer: {
    width: screen.width,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: screen.height * 0.03,
  },
  titleContainer: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    fontWeight: "500",
    fontSize: 24,
    alignSelf: "center",
    textAlign: "center",
    flexWrap: "wrap",
    color: AppTheme.colors.white,
  },
  backButtonLeft: {
    fontSize: 16,
    alignSelf: "center",
    marginLeft: 20,
    marginRight: 50,
    marginTop: 5,
    color: AppTheme.colors.white,
  },
  backButtonRight: {
    fontSize: 16,
    color: AppTheme.colors.buttonGreen,
    marginTop: 5,
    alignSelf: "flex-start",
    marginRight: 20,
  },
});
