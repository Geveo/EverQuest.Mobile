import React from "react";
import {
    Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppTheme from "../../helpers/theme";

export default function JoinedGame({ gameName, LeagueName }) {

  return (
    <View style={styles.gameContainer}>
        <View style={styles.rightImageIcon}></View>
        <View style={ styles.inisdeContainer}>    
         <Text style={styles.mainText}>{ LeagueName }</Text>
         <Text style={styles.SubText}>{ gameName }</Text>
        </View>
        
    </View>
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
        backgroundColor: AppTheme.colors.white,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: AppTheme.colors.tabGrey,
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
        fontSize: 18,
        fontWeight: "500",
    },
    SubText: {
        marginLeft: 15,
        fontSize: 14,
        color: AppTheme.colors.emailGreen,
    },
});