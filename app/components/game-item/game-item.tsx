import React from "react";
import {
    Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTheme from "../../helpers/theme";

export default function GameItem({ gameName, gameStatus, gameStartDate, gameEndDate }) {

  return (
    <View style={styles.gameContainer}>
        <View style={styles.gameImage}>
          {/* <Image
            source={gameImage}
          /> */}
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
      },
      gameText: {
    
      },
      gameTitle: {
        fontSize: 16,
        fontWeight: "bold",
      },
      gameStatus: {
        color: AppTheme.colors.textGrey,
      },
      gameStartDate: {
        color: AppTheme.colors.textGrey,
      },
      gameEndDate: {
        color: AppTheme.colors.textGrey,
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