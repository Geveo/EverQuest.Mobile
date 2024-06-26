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
import { ScrollView } from "react-native-gesture-handler";
const xrpl = require("xrpl");
const {
  GameEngineApiParameters,
  TransactionConstants,
} = require(".../../../app/constants/constants");
import axios from "axios";
import JoinedGame from "../../../components/joined-game/joined-game";
import { ActivityIndicator } from "react-native";

export default function AllJoinedGamespage({ navigation, route }) {
  const  { playerID } = route.params;

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [joinedGamesPreviously, setJoinedGamesPreviously] = useState([]);
  const [xrpaddress, setXrpAddress] = useState("");
  const [gameStatus, setGameStatus] = useState("");
  // const [hasWonLeague, setHasWonLeague] = useState(false);
  // const [hasLeagueCompleted, setHasLeagueCompleted] = useState(false);

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

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

  const joinedGames = async () => {
    try {
      console.log("Before getting joinedGames", playerID);
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getAllGamesForUser?userId=${playerID}`
      );
      console.log("After getting joinedGames", response.data);
      if (response.data) {
        
      }
      if (response) {
        setShowLoadingIndicator(false);
      }
      if (response.data) {
        const { Feeds } = response.data;
        setJoinedGamesPreviously(Feeds);
      } else {
        console.log("RoundMatches not found in response");
      }

      const feeds = response.data.Feeds;
      feeds.forEach(feed => {
        const { VQPlayerStatus, LeagueName, GameName } = feed;
        console.log(`Status: ${VQPlayerStatus}`);
        
        // Perform any additional logic or actions based on VQPlayerStatus here
      });


    } catch (error) {
      console.log("Error getting countries", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await joinedGames();
    };
  
    fetchData();
  
    // BackHandler and cleanup code remain unchanged
  }, []);

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="My Games" navigation={navigation} />

      

      <ScrollView style={styles.resultContainer}>
          {joinedGamesPreviously
            //.filter((game) => game.RoundName === "Round 1")
            .map((game, index) => {
              // Determine the hasWonLeague status based on VQPlayerStatus
              let hasWonLeague = game.VQPlayerStatus === "WON";
              let hasLeagueCompleted = game.VQPlayerStatus === "WON" || game.VQPlayerStatus === "LOST" ;
              if(game.GameID===1152){
                hasWonLeague = true;
                hasLeagueCompleted = true
              }
              if(game.GameID===1158){
                hasWonLeague = false;
                hasLeagueCompleted = true
              }
              return (
                <JoinedGame
                  key={index} 
                  gameName={game.GameName} 
                  LeagueName={game.LeagueName} 
                  destination={"AllRoundsPage"} 
                  navigation={navigation}
                  GameID={game.GameID} 
                  VQGameID={game.VQGameID}
                  VQPlayerID={game.VQPlayerID}
                  hasWonLeague={hasWonLeague} // Pass the determined status here
                  hasLeagueCompleted={hasLeagueCompleted}
                  playerID={playerID}
                />
              );
            })}
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
  container: {
    alighItems: "right",
    padding: 40,
    justifyContent: "space-between",
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.bottomNavGreen,
  },
  resultContainer: {
    marginTop: 40,
    marginVertical: 20,
    alignSelf: "center",
    width: "90%",
    marginBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
