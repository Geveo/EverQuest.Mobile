import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import PageTitle from "../../../components/page-title/page-title";
import CountryComponent from "../../../components/country-component/country-component";
import SCButtonWithoutArrow from "../../../components/button-without-arrow/button-without-arrow";
import axios from "axios";
import { set } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import XummApiService from "../../../services/xumm-api-service";

const {
  GameEngineApiParameters,
  TransactionConstants
} = require(".../../../app/constants/constants");
const  xrpl = require("xrpl");

export default function Challenge({ navigation, route }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState("Teams");
  const [RoundNumber, setRoundNumber] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [roundMatches, setRoundMatches] = useState([]);
  const [gameParticipantID, setGameParticipantID] = useState(0);
  const [VQGameId, setVQGameId] = useState(0);

  const [isFinished, setIsFinished] = useState(false);
  const [sucessful, setSucessful] = useState(false);
  const [hasWonRound, setHasWonRound] = useState(false);
  const [fromAddress, setFromAddress] = useState("");
  const [playerXrpAddress, setPlayerXrpAddress] = useState("");
  const [secret, setSecret] = useState("");
  const [playerID, setPlayerId] = useState(0);
  const [gameAmount, setGameAmount] = useState(0);

  const countryImages = {
    "Sri Lanka": require("../../../assets/images/sri_lanka.png"),
    "Australia": require("../../../assets/images/australia.png"),
    "Ireland": require("../../../assets/images/Ireland.png"),
    "Argentina": require("../../../assets/images/Argentina.png"),
    "England": require("../../../assets/images/england.png"),
    "France": require("../../../assets/images/France.png"),
    "Afganistan": require("../../../assets/images/afganistan.png"),
    "Bangladesh": require("../../../assets/images/bangladesh.png"),
    "India": require("../../../assets/images/india.png"),
    "Netherlands": require("../../../assets/images/netherlands.png"),
    "New-Zealand": require("../../../assets/images/new_zealand.png"),
    "New Zealand": require("../../../assets/images/new_zealand.png"),
    "Pakistan": require("../../../assets/images/Pakistan.png"),
    "South Africa": require("../../../assets/images/south_africa.png"),
    "WestIndies": require("../../../assets/images/australia.png"),
    "Zimbabwe": require("../../../assets/images/australia.png"),
    "Italy": require("../../../assets/images/Zimbabwe.png"),
    "Japan": require("../../../assets/images/Japan.png"),
    "Belgium": require("../../../assets/images/Belgium.png"),
    "Brazil": require("../../../assets/images/Brazil.png"),
    "Portugal": require("../../../assets/images/Portugal.png"),
    "Spain": require("../../../assets/images/Spain.png"),
    "Germany": require("../../../assets/images/Germany.png"),
  };
  const { gameType, gameName, gameId } = route.params;

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  const handleCountryPress = (coutnryName, countryId) => {
    console.log("Country pressed in challenge screen");
    setSelectedCountry(coutnryName);
    setSelectedCountryId(countryId);
  };

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

  // Function to handle tab selection
  const handleTabSelection = (tabName) => {
    setActiveTab(tabName);
  };

  const getCountryDetails = async () => {
    console.log("Getting country details for player: ", playerID, " Game Id: ", gameId)
    try {
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/GetMatchesForRound?gameId=${gameId}&userId=${playerID}&gameParticipantID=0`
      );
      console.log("After getting countries", response.data);
      if (response.data && response.data.RoundMatches) {
        setRoundMatches(response.data.RoundMatches);
        var amount = response.data.RoundMatches[0].GameAmount;
        const value = Number(amount.split(" ")[0]);
        setGameAmount(value)
      } else {
        console.log("RoundMatches not found in response");
      }
    } catch (error) {
      console.log("Error getting countries", error);
    }
  };

  const submitUserResponse = async () => {
    console.log("saving gameparticipation: ", playerID, " ", gameId, " ", gameAmount, " ", selectedCountryId)
    try {
      const response = await axios.post(
        `${GameEngineApiParameters.URL}/api/games/saveGameParticipants?gameId=${gameId}&userId=${playerID}&newMatchTeamId=${selectedCountryId}&gameAmount=${gameAmount}`
      );
      console.log("After selecting a country", response.data);
      if (response.data && response.data.gameParticipantId) {
        setGameParticipantID(response.data.gameParticipantId);
        setSucessful(true);
      } else {
        console.log("RoundMatches not found in response");
      }
    } catch (error) {
      console.log("Error getting countries", error);
    }
  };

  const handleCompleletedState = async () => {
    try {
      const response = await axios.get(`${GameEngineApiParameters.URL}/api/games/getGameInfoByGameID?gameId=${gameId}`);
      if (response.data && response.data.Rounds) {
        // Check if any round is completed
        const completedRound = response.data.Rounds.find(round => round.IsCompleted === 1);
        setIsFinished(completedRound !== undefined);
        console.log("IsFinished", isFinished); 
      }
    } catch (error) {
      console.error('Error fetching game info:', error);
    }
  };

  const getCredentials = async () => {
    try {
      const XRP_Address = await AsyncStorage.getItem("XRP_Address");
      console.log("XRP Address: ", XRP_Address);
      const secret = await AsyncStorage.getItem("secret");
      const playerID = await AsyncStorage.getItem("playerId");
      console.log("Secret: ", secret);
      setFromAddress(XRP_Address);
      setPlayerXrpAddress(XRP_Address);
      setSecret(secret);
      const playerIdInt = parseInt(playerID, 10); // Convert playerId to integer
      setPlayerId(playerIdInt);
      return { XRP_Address, secret };
    } catch (error) {
      console.error("Error getting credentials:", error);
    }
  };

  const stringToHex = (str) => {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex.toUpperCase();
  };

  async function makePayment() {
    const url = `${TransactionConstants.URI_TOKEN_TNX_URL}/createAndSellUriToken`;
    var uniqueId = `${playerXrpAddress}${gameId}${playerID}`
    
    const hexString = stringToHex(uniqueId);
    console.log("Hexadecimal string:", hexString);
    const data = {
      sourceAccount: TransactionConstants.ADMIN_ADDRESS,
      sourceSecret: TransactionConstants.ADMIN_SECRET,
      destinationAccount: playerXrpAddress,
      uri: hexString,
      amount: {
        "currency": TransactionConstants.CURRENCY,
        "issuer": TransactionConstants.ISSUER_ADDRESS,
        "value": gameAmount.toString()
      }
    };
    try {
      const response = await axios.post(url, data);
      console.log(response.data.result)

      var uRITokenID = response.data.result;
      var xummApiService = new XummApiService();
      xummApiService.buyUriToken(playerXrpAddress, gameAmount.toString(), uRITokenID, gameId, playerID);
      return response.data.result; 
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
    }

    

    const handleSubmitButtonPress = () => {
      console.log("Submit button pressed");
      submitUserResponse();
      makePayment();
      console.log("GameParticipantID", gameParticipantID);
      navigation.replace("AllJoinedGamespage", {playerID});
    };

  useEffect(() => {
    getCredentials();
    getCountryDetails();
    handleCompleletedState();
    //getVQGameId();
  }, [activeTab]);

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title={`${gameName}`} navigation={navigation} />
      <Text style={styles.roundHeading}>Round 1</Text>
      <Text style={styles.roundText}>Choose a team that you think</Text>
      <Text style={styles.roundText}>is going to win</Text>

      <View style={styles.mainTabContainer}>
        <View style={styles.tabContainerHeading}>
          <TouchableOpacity
            style={[
              styles.teamsTab,
              activeTab === "Teams" && styles.activeTab, // Apply active style if active tab //added as a change
            ]}
            onPress={() => handleTabSelection("Teams")} // Handle tab selection //added as a change
          >
            <Text
              style={[
                styles.teamsTabText,
                activeTab === "Teams" && styles.activeTabText, // Apply active text color if active tab //added as a change
              ]}
            >
              Teams
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.resultTab,
              activeTab === "Result" && styles.activeTab, // Apply active style if active tab //added as a change
            ]}
            onPress={() => handleTabSelection("Result")} // Handle tab selection //added as a change
          >
            <Text
              style={[
                styles.resultTabText,
                activeTab === "Result" && styles.activeTabText, // Apply active text color if active tab //added as a change
              ]}
            >
              Result
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "Teams" ? (
        <View style={styles.tabContent1}>
          { sucessful ? (
            <>
            <Text style={styles.textResult}>
              Your selection has been submitted
              </Text>
            </>
          ): (<>
          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={() => {
              handleSubmitButtonPress();
            }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity></>)}
          

          <ScrollView style={styles.tabContent1}>
            {roundMatches.map((match, index) => {
              return (
                <View key={index} style={styles.countrySideBySide}>
                  <View style={styles.countrySideBySideInside}>
                  <TouchableOpacity
                    onPress={() => {
                      handleCountryPress(
                        match.TeamNameLeft,
                        match.MatchTeamIDLeft
                      );
                    }}
                  >
                    <CountryComponent
                      countryName={match.TeamNameLeft}
                      countryImage={!countryImages[match.TeamNameLeft]? require("../../../assets/images/DummyCountry.png") : countryImages[match.TeamNameLeft]}
                      active={
                        selectedCountry === match.TeamNameLeft ? true : false
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.vsTExt}> vs </Text>

                  <TouchableOpacity
                    onPress={() => {
                      handleCountryPress(
                        match.TeamNameRight,
                        match.MatchTeamIDRight
                      );
                    }}
                  >
                    <CountryComponent
                      countryName={match.TeamNameRight}
                      countryImage={!countryImages[match.TeamNameRight]? require("../../../assets/images/DummyCountry.png") : countryImages[match.TeamNameRight]}
                      active={
                        selectedCountry === match.TeamNameRight ? true : false
                      }
                    />
                  </TouchableOpacity>
                  </View>
                  <View style={styles.horizontalDivider} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {isFinished ? (
            <>
              {hasWonRound ? (
                <>
                  <Text style={styles.resultGreet}>Congratulations !!!</Text>
                  <Text style={styles.textResult}>
                    You have won Round {RoundNumber}
                  </Text>

                  <SCButtonWithoutArrow text="Round 2" />
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("RoundDetails");
                    }}
                  >
                    <Text style={styles.detailsText}> Round Details </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.resultWrong}>Wrong guess !!!</Text>
                  <Text style={styles.textDisqualified}>
                    Sorry, You have been disqualified 
                  </Text>
                  <Text style={styles.textDisqualified}>
                    from the competition
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("RoundDetails");
                    }}
                  >
                    <Text style={styles.detailsText}> Round Details </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.textResult}>
                Round has not been finished yet
              </Text>
              <Text style={styles.textResult}>
                Wait till the round finishes to see the result
              </Text>
            </>
          )}
        </View>
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
  tabContent1: {
    marginBottom: 210,
  },
  resultContainer: {
    marginVertical: 20,
    alignSelf: "center",
    width: "80%",
  },
  resultGreet: {
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.splashGreen,
  },
  resultWrong: {
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.red,
    marginBottom: 40,
  },
  textResult: {
    marginVertical: 20,
    fontSize: 16,
    alignSelf: "center",
    color: AppTheme.colors.darkGrey,
    
  },
  textDisqualified: {
    marginTop: 10,
    fontSize: 16,
    alignSelf: "center",
    color: AppTheme.colors.darkGrey,
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
  submitButtonContainer: {
    backgroundColor: AppTheme.colors.emailGreen,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 30,
    marginTop: 0,
    marginBottom: 20,
  },
  submitButtonText: {
    color: AppTheme.colors.white,
    fontWeight: "600",
    alignSelf: "center",
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
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",
  },
  countrySideBySide: {
    
  },
  countrySideBySideInside: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    marginHorizontal: 20,
  },
});

