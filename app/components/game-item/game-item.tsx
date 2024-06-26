import React from "react";
import {
    Dimensions,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import AppTheme from "../../helpers/theme";

export default function GameItem({ gameName, gameStatus, gameStartDate, gameEndDate , ImageSource}) {

  const Cricket = require("../../assets/images/CricketLeague.png");
  const FootBall = require("../../assets/images/FootBallLeague.png");

  return (
    <View style={styles.gameContainer}>
        <View style={styles.gameImage}>
        <Image
              style={styles.gameInsideImage}
              source={ImageSource}
            />
        </View>
        <View>
        <View style={styles.gameText}>
          <Text style={styles.gameTitle}>{gameName}</Text>
          <Text style={[styles.gameStatus, gameStatus === "Active" && styles.activeStatus]}>
            Status: {gameStatus}
          </Text>
          <Text style={styles.gameStartDate}>Start Date: {gameStartDate}</Text>
          <Text style={styles.gameEndDate}>End Date: {gameEndDate}</Text>
        </View> 
        <View style={styles.horizontal} />
        </View>
      </View>
  );

}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
    gameContainer: {
        marginTop: 10,
        marginHorizontal: 20,
        display: "flex",
        flexDirection: "row",
      },
      gameImage: {
        backgroundColor: AppTheme.colors.tabGrey,
        height: 80,
        width: 80,
        borderRadius: 10,
        marginRight: 20,
        alignItems: "center",
        justifyContent: "center",
      },
      gameInsideImage:{
        height: 50,
        width: 50,
        borderRadius: 10,
      },
      gameText: {
    
      },
      gameTitle: {
        fontSize: 19,
        fontWeight: "bold",
        color: AppTheme.colors.emailGreen,
      },
      gameStatus: {
        color: AppTheme.colors.textGrey,
      },
      gameStartDate: {
        color: AppTheme.colors.dateGrey,
      },
      gameEndDate: {
        color: AppTheme.colors.dateGrey,
      },
      horizontal: {
        borderBottomWidth: 1,
        width: screen.width * 0.6,  
        borderBlockColor: AppTheme.colors.tabGrey,
        marginVertical: 5,
      },
      activeStatus: {
        color: AppTheme.colors.black,
        fontWeight: "bold",
      },
});