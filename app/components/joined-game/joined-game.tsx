import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import AppTheme from "../../helpers/theme";

export default function JoinedGame({
  navigation,
  gameName,
  LeagueName,
  destination,
  GameID,
  VQGameID,
  VQPlayerID,
  hasWonLeague = false,
  hasLeagueCompleted = true,
}) {
  const gameContainerStyle = [
    styles.gameContainer,
    hasWonLeague && hasLeagueCompleted && styles.wonGameContainer,
    !hasWonLeague && hasLeagueCompleted && styles.lossGameContainer,
  ];

  return (
    <TouchableOpacity
      style={gameContainerStyle}
      onPress={() =>
        navigation.navigate(destination, {
          gameName,
          LeagueName,
          GameID,
          VQGameID,
          VQPlayerID,
        })
      }
    >{
        hasLeagueCompleted? (<Image
            style={styles.rightImageIcon}
              source={ hasWonLeague ? require("../../assets/images//WinningIcon.png"): require("../../assets/images//LoosenIcon.png") }
            />): (
<Image
            style={styles.rightImageIcon}
              source={ require("../../assets/images//Incomeplete.png")}
            />)
    }
        
      <View style={styles.inisdeContainer}>
        <Text style={styles.mainText}>{LeagueName}</Text>
        <Text style={styles.SubText}>{gameName}</Text>
      </View>
    </TouchableOpacity>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  gameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 80,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.roughWhite,
    marginBottom: 20,
    elevation: 4,
    // borderWidth: 1,
    // borderColor: AppTheme.colors.black,
  },
  wonGameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 80,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.hasWonGreen,
    marginBottom: 20,
    elevation: 4,
    //borderWidth: 1,
    //borderColor: AppTheme.colors.black,
  },
  lossGameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 80,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.hasLostRed,
    marginBottom: 20,
    //borderWidth: 1,
    //borderColor: AppTheme.colors.black,
    elevation: 4,
  },
  inisdeContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 20,
  },
  rightImageIcon: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: AppTheme.colors.tabGrey,
    alignSelf: "center",
    marginLeft: 30,
  },
  mainText: {
    marginLeft: 10,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "500",
    color: AppTheme.colors.black,
  },
  SubText: {
    marginLeft: 15,
    fontSize: 16,
    color: AppTheme.colors.black,
  },
});
