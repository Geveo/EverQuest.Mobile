import { StyleSheet, Image, Text, View, BackHandler } from "react-native";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import React, { useEffect, useState } from "react";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AppTheme from "../../../helpers/theme";
import SCButton from "../../../components/button/button";
import HotPocketClientService from "../../../services/hp-client-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {

  const [playerID, setPlayerID] = useState(0);
  const [xrpaddress, setXrpAddress] = useState("");

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
    async function initializeHotPocketClient() {
      try {
        // Get the HotPocketClient instance
        const hotPocketClient = await HotPocketClientService.getInstance();
        console.log('HotPocketClient instance initialized:', hotPocketClient);
      } catch (error) {
        console.error('Error initializing HotPocketClient:', error);
      }
    }
    initializeHotPocketClient();

    return () => {
    };
  }, []);


  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  const getCredentials = async () => {
    try {
      const XRP_Address = await AsyncStorage.getItem("XRP_Address");
      const playerId = await AsyncStorage.getItem("playerId");
      const playerIdInt = parseInt(playerId, 10); // Convert playerId to integer
      setPlayerID(playerIdInt);
      setXrpAddress(XRP_Address);
      console.log("Player ID:", playerId);
    } catch (error) {
      console.error("Error getting credentials:", error);
    }
  };

  useEffect(() => {
    getCredentials();
  }, []);

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <Text style={styles.headingText}>EverQuest</Text>
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.infoTextHeading}>Beat the rest - EverQuest</Text>
      <Text style={styles.infoText}>
        EverQuest is a brand new concept
      </Text>
      <Text style={styles.infoText}>in playing on your favorite sport!
      </Text>
      <Text style={styles.infoText}>
        EverQuest is a simple yet 
      </Text>
      <Text style={styles.infoText}>
        strategic game. 
      </Text>
      <Text style={styles.infoText}>
      You, as a player, challenge other players in a unique knock-out game
      </Text>
      <Text style={styles.infoText}>
        based on your favorite real life 
      </Text>
      <Text style={styles.infoText}>
        sporting competition. 
      </Text>
      <View style={styles.button}>
        <SCButton
          text="Joined Games"
          showRightArrow={true}
          onTap={() => navigation.navigate("AllJoinedGamespage", { playerID })}
        />
      </View>
      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Home}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

const styles = StyleSheet.create({
  headingText: {
    marginTop: "15%",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 40,
    color: AppTheme.colors.darkerGreen,
  },
  welcomeText: {
    marginTop: "20%",
    marginBottom: 5,
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 40,
  },
  infoTextHeading: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: 0.7,
    fontWeight: "400", 
    color: AppTheme.colors.descriptionFont,
  },
  infoText: {
    fontFamily: "inter",
    textAlign: "center",
    fontWeight: "400", 
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 0.7,
    paddingHorizontal: 20,
    color: AppTheme.colors.descriptionFont,
  },
  button: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    height: 75,
  },
});
