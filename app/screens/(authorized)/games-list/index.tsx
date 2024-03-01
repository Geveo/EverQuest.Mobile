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

export default function GamesList({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  useEffect(() => {
    getAllGames();
  }, []);

  async function getAllGames() {
    try {
      console.log(" Before requst: ");
      const response = await axios.get("http://192.168.8.101:7189/api/games/getAllSportsLeagesAndGames");
      
      console.log("Response: ", JSON.stringify(response));
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
      <PageTitle title="Cricket" navigation={navigation}/>

      <ScrollView style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="ICC Cricket World Cup 2024"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Active"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="Indian Premier League 2023"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Inactive"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="Asia Cup 2023"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Inactive"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="Ashes 2022"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Inactive"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="ICC T-20 World Cup 2022"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Inctive"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="Lankan Premier League 2023"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Inactive"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="Lankan Premier League 2022"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Inactive"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Tournament")}>
        <GameItem
          gameName="Lankan Premier League 2021"
          //gameImage={require("../../../assets/images/evernode.png")}
          gameStatus="Inactive"
          gameStartDate="Jan 01, 2024"
          gameEndDate="March 31, 2024"
        />
      </TouchableOpacity>

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
  }
});
