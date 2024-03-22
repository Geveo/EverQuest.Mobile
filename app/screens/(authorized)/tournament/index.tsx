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
import AsyncStorage from "@react-native-async-storage/async-storage";
import JoinedGame from "../../../components/joined-game/joined-game";
import AccountService from "../../../services/services-domain/account-service";
const xrpl = require("xrpl");
const {
  GameEngineApiParameters,
  TransactionConstants,
} = require(".../../../app/constants/constants");

// Define the Tournament component
export default function Tournament({ navigation, route }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [joinedGamesPreviously, setJoinedGamesPreviously] = useState([]);
  const { title, gameId } = route.params;
  const [availableFunds, setAvailableFunds] = useState(0);
  const [activeTab, setActiveTab] = useState("All Games");

  const [shuffleTime, setShuffleTime] = useState(null);
  const [shuffleTimePassed, setShuffleTimePassed] = useState(false);
  const [playerID, setPlayerID] = useState(0);

  const [userName, setUsername] = useState("Emily Johnson");
  const [totalWinnings, setTotalWinnings] = useState(0);
  var acountService = new AccountService();
  const getCredentials = async () => {
    try {
      const XRP_Address = await AsyncStorage.getItem("XRP_Address");
      console.log("XRP Address: ", XRP_Address);
      const secret = await AsyncStorage.getItem("secret");
      console.log("Secret: ", secret);
      const playerId = await AsyncStorage.getItem("playerId");
      const playerIdInt = parseInt(playerId, 10); // Convert playerId to integer
      setPlayerID(playerIdInt);
      return { XRP_Address, secret };
    } catch (error) {
      console.error("Error getting credentials:", error);
    }
  };

  const handleTabSelection = (tabName) => {
    setActiveTab(tabName);
  };

  // Function to handle bottom navigation tapped event
  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  async function getTotalWinningAmount() {
    var msgObj = {
      Player_ID: playerID
    }
    var totalAmount = 0;
    acountService.getTotalWinnings(msgObj)
    .then((totalWinnings) => {
      console.log("total winning records: ", totalWinnings)
      if(totalWinnings.success){
        totalWinnings.data.forEach(element => {
          totalAmount =+ element.Winning_Amount;
          setTotalWinnings(totalAmount);
        });
      }
    })
    .catch((error) => {
      console.log("Error while getting total winnings: ", error)
    })
  }

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
      console.log(`Balances for ${currencyCode}:`);
      currencyBalances.forEach((line) => {
        console.log(
          `Issuer: ${line.account}, Balance: ${line.balance}, Limit: ${line.limit}`
        );
        setAvailableFunds(line.balance);
      });
    } else {
      console.log(`No balance found for ${currencyCode} issued by ${issuer}`);
    }
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
    getCredentials().then((credentials) => {
      checkIssuedCurrencyBalance(
        credentials.XRP_Address,
        TransactionConstants.CURRENCY,
        TransactionConstants.ISSUER_ADDRESS
      );
    });

    getAllChallenges(gameId);
    joinedGames();
    getUsername();
    getTotalWinningAmount();
  }, []);

  async function getAllChallenges(gameId) {
    try {
      console.log(" Before request of Joined Games: ");
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getLeagueGamesByLeagueId?leagueId=${gameId}`
      );
      if(response){
        setShowLoadingIndicator(false);
      }
      const shuffleTime = new Date(response.data.Games[0].ShuffleTime);
      const shuffleTimeValue = new Date(
        response.data.Games[0].ShuffleTime
      );
      setShuffleTime(shuffleTimeValue);
      const currentTime = new Date();
      if (currentTime > shuffleTime) {
        setShuffleTimePassed(true);
      }
      setChallenges(response.data.Games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }

  const joinedGames = async () => {
    try {
      console.log("Before getting joinedGames");
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getAllGamesForUser?userId=${playerID}`
      );
      console.log("After getting joinedGames", response.data);
      if (response.data) {
        const { Feeds } = response.data;
        setJoinedGamesPreviously(Feeds);
      } else {
        console.log("RoundMatches not found in response");
      }
    } catch (error) {
      console.log("Error getting countries", error);
    }
  };

  async function getUsername() {
    try {
      var acountService = new AccountService();
      const XRP_Address = await AsyncStorage.getItem("XRP_Address");
      var response = await acountService.getPlayerName(XRP_Address);
      
      setUsername(response)
    }
    catch (error) {
      console.error("Error occurred while getting username:", error);
    }
  }

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
              source={require("../../../assets/images/Avatar.png")}
            />
            <Text style={styles.userName}>{userName}</Text>
            {/* <Text style={styles.userEmail}>test@test.com</Text> */}
          </View>
          <View style={styles.rightSide}>
            <View style={styles.top}>
              <Text style={styles.RightHeading}> Available Amount</Text>
              <Text style={styles.RightSubHeading}>{availableFunds} EVR</Text>
            </View>
            <View style={styles.bottom}>
              <Text style={styles.RightHeading}>Total Winnings</Text>
              <Text style={styles.RightSubHeading}>{totalWinnings} EVR</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mainTabContainer}>
        <View style={styles.tabContainerHeading}>
          <TouchableOpacity
            style={[
              styles.teamsTab,
              activeTab === "All Games" && styles.activeTab, // Apply active style if active tab //added as a change
            ]}
            onPress={() => handleTabSelection("All Games")} // Handle tab selection //added as a change
          >
            <Text
              style={[
                styles.teamsTabText,
                activeTab === "All Games" && styles.activeTabText, // Apply active text color if active tab //added as a change
              ]}
            >
              All Games
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.resultTab,
              activeTab === "Joined Games" && styles.activeTab, // Apply active style if active tab //added as a change
            ]}
            onPress={() => handleTabSelection("Joined Games")} // Handle tab selection //added as a change
          >
            <Text
              style={[
                styles.resultTabText,
                activeTab === "Joined Games" && styles.activeTabText, // Apply active text color if active tab //added as a change
              ]}
            >
              Joined Games
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {activeTab === "All Games" ? (
        <ScrollView style={styles.tabContent1}>
          {challenges
          .filter(game => game.RoundNumber === 1) // Filter games based on title match
          .map((challenge) => (
            <ChallengeItem
              key={challenge.GameId}
              navigation={navigation}
              amount={challenge.GameName} // Assuming GameName contains the amount
              shuffleTime={shuffleTime ? shuffleTime.toLocaleString() : ""} 
              minimumPlayerCount={6}
              pathOnPress={shuffleTimePassed ? undefined  : "Challenge"}
              gameName={challenge.GameName}
              gameId={challenge.GameId}
              gameType={challenge.GameType}
            />
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.resultContainer}>
          {joinedGamesPreviously && joinedGamesPreviously
            .filter(game => game.LeagueName.toLowerCase() === title.toLowerCase())
            .map((game, index) => (
              <JoinedGame
                key={index} 
                gameName={game.GameName} 
                LeagueName={game.LeagueName}
                destination={"AllRoundsPage"} 
                navigation={navigation}
                GameID={game.GameID}
                VQGameID={game.VQGameID}
                VQPlayerID={game.VQPlayerID}
                playerID={playerID}
              />
            ))}
        </ScrollView>
      )}

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
  roundHeading: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: screen.height * 0.02,
    alignSelf: "center",
    color: AppTheme.colors.splashGreen,
    marginBottom: 5,
  },
  roundText: {
    fontSize: 16,
    alignSelf: "center",
    flexWrap: "wrap",
  },
  mainTabContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  tabContainerHeading: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: AppTheme.colors.tabGrey,
    borderRadius: 30,
    color: AppTheme.colors.textGrey,
    alignItems: "center",
    marginBottom: 20,
  },
  teamsTab: {
    flex: 1,
    alignItems: "center",
  },
  resultTab: {
    flex: 1,
    alignItems: "center",
  },
  teamsTabText: {
    color: AppTheme.colors.textGrey,
    fontWeight: "600",
  },
  resultTabText: {
    color: AppTheme.colors.textGrey,
    fontWeight: "600",
  },
  activeTab: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 30,
    margin: 2,
    padding: 15,
    alignContent: "center",
  },
  activeTabText: {
    color: AppTheme.colors.backButtonGreen, // Set text color for active tab //added as a change
  },
  vsTExt: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "600",
    color: AppTheme.colors.textGrey,
  },
  horizontalDivider: {
    borderBottomColor: AppTheme.colors.buttonGreen,
    borderBottomWidth: 0.5,
    marginVertical: 15,
    width: "80%",
    alignSelf: "center",
  },
  tabContent1: {
    marginBottom: 100,
  },
  resultContainer: {
    marginVertical: 20,
    alignSelf: "center",
    width: "80%",
    marginBottom: 100,
  },
  resultGreet: {
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.splashGreen,
  },
  textResult: {
    marginVertical: 20,
    fontSize: 16,
    alignSelf: "center",
    color: AppTheme.colors.darkGrey,
    marginBottom: 40,
  },
  detailsText: {
    fontSize: 16,
    alignSelf: "center",
    color: AppTheme.colors.textGrey,
    marginTop: 60,
    fontWeight: "800",
    borderBottomColor: AppTheme.colors.textGrey,
    borderBottomWidth: 1,
  },
});
