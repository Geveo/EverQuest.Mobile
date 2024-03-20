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
import GameItem from "../../../components/game-item/game-item";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { useRoute, RouteProp  } from '@react-navigation/native';
const { GameEngineApiParameters } = require(".../../../app/constants/constants");


export default function GamesList({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [games, setGames] = useState([]);
  const route = useRoute() as RouteProp<any, any>
  const { sportName } = route.params;



  const LeagueImages = {
    "Cricket": require("../../../assets/images/CricketLeague.png"),
    "Football": require("../../../assets/images/FootBallLeague.png"),
    "Rugby": require("../../../assets/images/RugbyLeauge.png"),
  };


  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  interface RouteParams {
    sportId: number; // Assuming sportId is a number
    // Add other parameters here if needed
  }

  useEffect(() => {
    const { sportId } = route.params; // Accessing the sportId parameter
    getAllGames(sportId);
  }, []);

  async function getAllGames(sportId) {
    try {
      console.log(" Before request: ");
      const response = await axios.get(`${GameEngineApiParameters.URL}/api/games/getLeaguesBySportID?sportID=${sportId}`);
      if(response){
        setShowLoadingIndicator(false);
      }
      //console.log("Response: ", response.data);
      if(Object.keys(response.data).length !== 0) {
        const sortedGames = response.data.Leagues.map(game => ({
          ...game,
          StartDate: game.StartDate.substring(0, 10),
          EndDate: game.EndDate.substring(0, 10),
        })).sort((a: any, b: any) => new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime());
        setGames(sortedGames);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
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

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title={sportName} navigation={navigation}/>

      <ScrollView style={styles.mainContainer}>
        {
          games.length > 0 ? (<>{games.map((game, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate("Tournament", { title: game.LeagueName, gameId: game.LeagueID })}>
              <GameItem
                gameName={game.LeagueName}
                gameStatus={game.IsActive ? "Active" : "Inactive"}
                gameStartDate={game.StartDate}
                gameEndDate={game.EndDate}
                ImageSource={LeagueImages[sportName]}
              />
            </TouchableOpacity>
          ))}</>): (
          <View style={styles.container}>
            <Text style={styles.title}>No active games found</Text>
          </View>)
        }
       
      

      </ScrollView>

      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Sports}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 30,
    marginBottom: 100,
  },
  container: {
    alignItems: "center",
  },
  title: {
    marginTop: 300,
    fontWeight: "500",
    fontSize: 25,
    alignSelf: "center",
    color: AppTheme.colors.textGrey,
  },
});
