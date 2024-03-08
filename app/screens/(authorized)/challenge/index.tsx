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
const {
  GameEngineApiParameters,
} = require(".../../../app/constants/constants");

export default function Challenge({ navigation, route }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState("Teams");
  const [RoundNumber, setRoundNumber] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [roundMatches, setRoundMatches] = useState([]);
  const [gameParticipantID, setGameParticipantID] = useState(0);
  //const { amount } = route.params;
  const amount = 100;

  const handleSubmitButtonPress = () => {
    console.log("Submit button pressed");
    submitUserResponse();
    console.log("GameParticipantID", gameParticipantID);
  };

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
    try {
      console.log("Before getting countries");
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/GetMatchesForRound?gameId=1122&userId=3472&gameParticipantID=0`
      );
      console.log("After getting countries", response.data);
      if (response.data && response.data.RoundMatches) {
        setRoundMatches(response.data.RoundMatches);
      } else {
        console.log("RoundMatches not found in response");
      }
    } catch (error) {
      console.log("Error getting countries", error);
    }
  };

  const submitUserResponse = async () => {
    try {
      console.log("Before getting countries");
      const response = await axios.post(
        `${GameEngineApiParameters.URL}/api/games/saveGameParticipants?gameId=1122&userId=3472&newMatchTeamId=${selectedCountryId}&gameAmount=50`
      );
      console.log("After getting countries", response.data);
      if (response.data && response.data.gameParticipantId) {
        setGameParticipantID(response.data.gameParticipantId);
      } else {
        console.log("RoundMatches not found in response");
      }
    } catch (error) {
      console.log("Error getting countries", error);
    }
  };

  useEffect(() => {
    getCountryDetails();
  }, []);

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title={`${amount}`} navigation={navigation} />
      <Text style={styles.roundHeading}>Round 1</Text>
      <Text style={styles.roundText}>Choose the team that you think</Text>
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
          <TouchableOpacity
            style={styles.submitButtonContainer}
            onPress={() => {
              handleSubmitButtonPress();
            }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <ScrollView style={styles.tabContent1}>
            {roundMatches.map((match, index) => {
              // Remove spaces from country names and convert to lowercase
              const teamNameLeftFormatted = match.TeamNameLeft.replace(
                /\s+/g,
                "_"
              ).toLowerCase();
              const teamNameRightFormatted = match.TeamNameRight.replace(
                /\s+/g,
                "_"
              ).toLowerCase();

              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={()=> {handleCountryPress(match.TeamNameLeft, match.MatchTeamIDLeft)}}
                  >
                  <CountryComponent
                    countryName={match.TeamNameLeft}
                    countryImage={require(`../../../assets/images/south_africa.png`)}
                    active={selectedCountry === match.TeamNameLeft ? true : false}
                  />
                  </TouchableOpacity>
                  <Text style={styles.vsTExt}> vs </Text>

                  <TouchableOpacity
                    onPress={()=> {handleCountryPress(match.TeamNameRight, match.MatchTeamIDRight)}}
                  >
                  <CountryComponent
                    countryName={match.TeamNameRight}
                    countryImage={require(`../../../assets/images/australia.png`)}
                    active={selectedCountry === match.TeamNameRight ? true : false}
                  />
                  </TouchableOpacity>
                  <View style={styles.horizontalDivider} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.resultContainer}>
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
    marginVertical: 30,
    width: "80%",
    alignSelf: "center",
  },
});
