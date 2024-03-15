import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import PageTitle from "../../../components/page-title/page-title";
import CountryComponent from "../../../components/country-component/country-component";
import axios from "axios";
import SCButton from "../../../components/button/button";
const {
  GameEngineApiParameters,
} = require(".../../../app/constants/constants");

export default function AllRoundsPage({ navigation, route }) {
  const { gameName, LeagueName, GameID, VQGameID, VQPlayerID } = route.params;

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [rightFlag, setRightFlag] = useState(true);
  const [leftFlag, setLeftFlag] = useState(true);
  const [roundNumber, setRoundNumber] = useState(1);
  const [maxRoundNumber, setMaxRoundNumber] = useState(0);

  const [activeTab, setActiveTab] = useState("Teams");

  const [isFinished, setIsFinished] = useState(false);
  const [sucessful, setSucessful] = useState(true);
  const [hasWonRound, setHasWonRound] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(0);

  const [hasTippedRound, setHasTippedRound] = useState(false);

  const [roundMatches, setRoundMatches] = useState([]);

  const [shuffleTimePassed, setShuffleTimePassed] = useState(false);
  const [shuffleTime, setShuffleTime] = useState(null);

  const [hasWonVQGame, setHasWonVQGame] = useState(false);

  const countryImages = {
    "Sri Lanka": require("../../../assets/images/sri_lanka.png"),
    Australia: require("../../../assets/images/australia.png"),
    Ireland: require("../../../assets/images/Ireland.png"),
    Argentina: require("../../../assets/images/Argentina.png"),
    England: require("../../../assets/images/england.png"),
    France: require("../../../assets/images/France.png"),
    Afganistan: require("../../../assets/images/afganistan.png"),
    Bangladesh: require("../../../assets/images/bangladesh.png"),
    India: require("../../../assets/images/india.png"),
    Netherlands: require("../../../assets/images/netherlands.png"),
    "New-Zealand": require("../../../assets/images/new_zealand.png"),
    "New Zealand": require("../../../assets/images/new_zealand.png"),
    Pakistan: require("../../../assets/images/Pakistan.png"),
    "South Africa": require("../../../assets/images/south_africa.png"),
    WestIndies: require("../../../assets/images/australia.png"),
    Zimbabwe: require("../../../assets/images/australia.png"),
    Italy: require("../../../assets/images/Zimbabwe.png"),
    Japan: require("../../../assets/images/Japan.png"),
    Belgium: require("../../../assets/images/Belgium.png"),
    Brazil: require("../../../assets/images/Brazil.png"),
    Portugal: require("../../../assets/images/Portugal.png"),
    Spain: require("../../../assets/images/Spain.png"),
  };

  const handleTabSelection = (tabName) => {
    setActiveTab(tabName);
  };

  const handleCountryPress = (coutnryName, countryId) => {
    console.log("Country pressed in challenge screen");
    setSelectedCountry(coutnryName);
    setSelectedCountryId(countryId);
  };

  const rightbuttonclick = () => {
    if (roundNumber === maxRoundNumber) {
      setRightFlag(false);
      setLeftFlag(true);
      return;
    }
    setRoundNumber(roundNumber + 1);
    if (roundNumber + 1 === maxRoundNumber) {
      setRightFlag(false);
    }
    setLeftFlag(true);
  };

  const leftbuttonclick = () => {
    if (roundNumber === 1) {
      setLeftFlag(false);
      setRightFlag(true);
      return;
    }
    setRoundNumber(roundNumber - 1);
    if (roundNumber - 1 === 1) {
      setLeftFlag(false);
    }
    setRightFlag(true);
  };

  const getAllgames = async () => {
    try {
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getTippingsByUser?vqGameID=${VQGameID}&vqPlayerID=${VQPlayerID}&userID=3472`
      );
      setRoundMatches(response.data.AvailableTippings);
      //console.log("Response from getAllgames:", response.data.AvailableTippings);

      response.data.AvailableTippings.forEach((tipping) => {
        if (tipping.RoundNumber > maxRoundNumber) {
          setMaxRoundNumber(tipping.RoundNumber);
        }
      });

      const gamesForRound = response.data.AvailableTippings.filter(
        (game) => game.RoundNumber === roundNumber
      );
      let hasTipped = false;
      for (const game of gamesForRound) {
        if (game.IsTeamLeftTipped || game.IsTeamRightTipped) {
          hasTipped = true;
          break;
        }
      }
      setHasTippedRound(hasTipped);
    } catch (error) {
      console.log(error);
    }
  };

  const getShuffleTime = async () => {
    try {
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getGameInfoByGameID?gameId=${GameID}`
      );
      const shuffleTime = new Date(response.data.GameAllInfo[0].ShuffleTime);
      const shuffleTimeValue = new Date(
        response.data.GameAllInfo[0].ShuffleTime
      );
      setShuffleTime(shuffleTimeValue);
      const currentTime = new Date();
      if (currentTime > shuffleTime) {
        setShuffleTimePassed(true);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  {
    /*
  const getVQRelatedData = async () => {
    try {
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getAllGamesForUser?userId=3472`
      );
      console.log("Response from VQ related data:", response.data);
      
      const relevantGame = response.data.Feeds.filter(
        (game) => game.VQGameID === VQGameID && game.VQPlayerID === VQPlayerID && game.RoundName === `Round ${roundNumber}`
      );
      console.log("Relevant game:", relevantGame);

      // setGameIdVQ(relevantGame[0].VQGameID);
      // setPlayerIdVQ(relevantGame[0].VQPlayerID);
      

      if(relevantGame[0].VQPlayerStatus==="WON"){
        console.log("VQPlayerStatus:", relevantGame[0].VQPlayerStatus);
        
        setHasWonRound(true);
        setIsFinished(true);
        console.log("IsFinished:", isFinished.toString());
      }
      else if(relevantGame[0].VQPlayerStatus==="LOST"){
        console.log("VQPlayerStatus:", relevantGame[0].VQPlayerStatus);
        setHasWonRound(false);
        setIsFinished(true);
        console.log("IsFinished:", isFinished.toString());
      }
      else if(relevantGame[0].VQPlayerStatus===undefined){
        
        setIsFinished(false);
        console.log("IsFinished:");
        console.log("VQPlayerStatus:", relevantGame[0].VQPlayerStatus);
      }
    } catch (error) {
      console.log("Error fetching VQ related data:", error);
    }
  };
*/
  }

  const getGameResults = async () => {
    try {
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getPlayerTeamSelectionForRoundsByVQGameID?vqGameId=${VQGameID}&userID=3472`
      );

      const relevantGame = response.data.GameHistory.filter(
        (game) =>
          game.vqgameid === VQGameID &&
          game.roundnumber === roundNumber &&
          game.userid === 3472
      );
      console.log("Relevant game:", relevantGame);

      if (relevantGame.length === 0) {
        setIsFinished(false); // Set to false when the array is empty
      } else {
        if (relevantGame[0].IsVQWin === true) {
          setIsFinished(true);
          setHasWonRound(true);
          console.log("IsFinished:", isFinished.toString());
        } else if (relevantGame[0].IsVQWin === false) {
          setIsFinished(true);
          setHasWonRound(false);
          console.log("IsFinished:", isFinished.toString());
        }
      }
      const userWins = response.data.GameHistory.filter(
        (game) =>
          game.roundnumber === maxRoundNumber &&
          game.IsVQWin === true &&
          game.userid === 3472
      );
      if (userWins.length > 0) {
        setHasWonVQGame(true);
      }

      const userWinsBeforeEnds = response.data.GameHistory.filter(
        (game) =>
          game.IsVQWin === true &&
          game.roundnumber === roundNumber &&
          game.roundnumber < maxRoundNumber
      );
      console.log("User wins before ends:", userWinsBeforeEnds);
      if (userWinsBeforeEnds.length === 1) {
        setHasWonVQGame(true);
      }
    else{
      setHasWonVQGame(false);
    }
      //console.log("Response from getGameResults:", response.data);
    } catch (error) {
      console.log("Error fetching game results:", error);
    }
  };

  const confirmTippings = async (matchTeamId) => {
    try {
      const response = await axios.post(
        `${GameEngineApiParameters.URL}/api/games/SaveTippings?vqGameId=${VQGameID}&matchTeamId=${matchTeamId}&vqPlayerID=${VQPlayerID}&userID=3472`
      );
      console.log("Response from confirmTippings:", response);
    } catch (error) {
      console.log("Error confirming tippings:", error);
    }
  };

  const handleSubmitButtonPress = async () => {
    if (selectedCountry === "") {
      console.log("Please select a country");
      return;
    }
    console.log("Selected country:", selectedCountry);
    console.log("Selected country ID:", selectedCountryId);

    await confirmTippings(selectedCountryId);
    setSucessful(true);
  };

  useEffect(() => {
    //getVQRelatedData();
    getGameResults();
    getShuffleTime();
    getAllgames();
  }, [roundNumber]);

  // useEffect(() => {
  //   getGameResults();
  //   getShuffleTime();
  //   getAllgames();
  // }, []);

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title={LeagueName} navigation={navigation} />

      <Text style={styles.heading}> {gameName} </Text>

      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={leftbuttonclick}>
            {leftFlag ? <FontAwesomeIcon icon={faArrowLeft} size={25} /> : null}
          </TouchableOpacity>
          <Text style={styles.roundName}>Round {roundNumber}</Text>
          <TouchableOpacity onPress={rightbuttonclick}>
            {rightFlag ? (
              <FontAwesomeIcon icon={faArrowRight} size={25} />
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
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
              {shuffleTimePassed ? (
                <Text style={styles.textResult}>
                  Lock down time has been passed
                </Text>
              ) : (
                <>
                  {sucessful && hasTippedRound ? (
                    <>
                      <Text style={styles.textResult}>
                        Your selection has been submitted
                      </Text>
                    </>
                  ) : (
                    <>
                      {shuffleTime && (
                        <Text style={styles.textResult}>
                          Voting will be close in:{" "}
                          {`${shuffleTime.toLocaleDateString()} ${shuffleTime.toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}`}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.submitButtonContainer}
                        onPress={() => {
                          //handleSubmitButtonPress();
                        }}
                      >
                        <Text style={styles.submitButtonText}>Submit</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

              <ScrollView style={styles.tabContent1}>
                {roundMatches
                  .filter((match) => match.RoundNumber === roundNumber)
                  .map((match, index) => {
                    return (
                      <View key={index}>
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
                            countryImage={
                              !countryImages[match.TeamNameLeft]
                                ? require("../../../assets/images/DummyCountry.png")
                                : countryImages[match.TeamNameLeft]
                            }
                            active={
                              selectedCountry === match.TeamNameLeft
                                ? true
                                : false
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
                            countryImage={
                              !countryImages[match.TeamNameRight]
                                ? require("../../../assets/images/DummyCountry.png")
                                : countryImages[match.TeamNameRight]
                            }
                            active={
                              selectedCountry === match.TeamNameRight
                                ? true
                                : false
                            }
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
              {isFinished ? (
                <>
                  {hasWonRound ? (
                    <>
                      {hasWonVQGame ? (
                        <>
                          <Text style={styles.GameWinningText}>
                            Congratulations !!!
                          </Text>
                          <View>
                            <Image
                              source={require("../../../assets/images/Crown.png")} // Replace "your_image.png" with the actual image file name
                              style={styles.imageStyle}
                            />
                            <Text style={styles.GameWinningResultText}>You are the Winner</Text>
                            <Text style={styles.priceText}>
                              Total Prize: 1000 EVR
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("RoundDetails", {
                                  VQGameID,
                                  maxRoundNumber,
                                  roundNumber,
                                });
                              }}
                            >
                            <Text style={styles.detailsText}>
                              Round details
                            </Text>
                            </TouchableOpacity>
                            
                          </View>
                        </>
                      ) : (
                        <>
                          <Text style={styles.resultGreet}>
                            Congratulations !!!
                          </Text>
                          <Text style={styles.textResult}>You have won</Text>
                          <Text style={styles.roundNumber}>
                            Round {roundNumber}
                          </Text>

                          {/* <SCButtonWithoutArrow text={`Round ${roundNumber}`} /> */}
                          <View
                            style={{
                              marginTop: 80,
                              width: "100%",
                              height: 75,
                            }}
                          >
                            <SCButton
                              text="Round Details"
                              showRightArrow={true}
                              onTap={() =>
                                navigation.navigate("RoundDetails", {
                                  VQGameID,
                                  maxRoundNumber,
                                  roundNumber,
                                })
                              }
                            />
                          </View>
                        </>
                      )}
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
                          navigation.navigate("RoundDetails", {
                            VQGameID,
                            maxRoundNumber,
                            roundNumber,
                          });
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
        </View>
      </View>
    </AuthorizedLayout>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  heading: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "500",
    color: AppTheme.colors.emailGreen,
    marginTop: 20,
  },
  mainContainer: {},
  topContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
  bottomContainer: {},
  roundName: {
    fontSize: 20,
    fontWeight: "500",
    color: AppTheme.colors.black,
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
    height: 600,
    marginBottom: 50,
  },
  resultContainer: {
    marginVertical: 20,
    alignSelf: "center",
    width: "80%",
  },
  resultGreet: {
    fontSize: 30,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.splashGreen,
  },
  roundNumber: {
    fontSize: 25,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.black,
  },
  resultWrong: {
    fontSize: 30,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.red,
    marginBottom: 40,
  },
  textResult: {
    marginVertical: 20,
    fontSize: 20,
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
    fontSize: 20,
    alignSelf: "center",
    color: AppTheme.colors.textGrey,
    marginTop: 30,
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
  imageStyle: {
    marginVertical: 40,
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  GameWinningText: {
    fontSize: 40,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.buttonGreen,
  },
  GameWinningResultText: {
    fontSize: 25,
    fontWeight: "500",
    alignSelf: "center",
    color: AppTheme.colors.black,
  },
  priceText: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.lightGrey,
  },
});
