import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Image,
} from "react-native";
import AppTheme from "../../helpers/theme";

export default function SingleSport({ sportName, sportImage }) {

  return (
    <View>
      <TouchableOpacity>
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            //source={require("../../../assets/images/cricket-Icon.png")}
            source={sportImage}
          />
          </View>
          <Text style={styles.sportsText}> {sportName} </Text>
        </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  sportCatergory: {
    backgroundColor: AppTheme.colors.tabGrey,
    padding: 25,
    borderRadius: 8,
    elevation: 5,
    width: 140,
    height: 130,
  },
  SportLogo: {
    alignSelf: "center",
    height: 80,
  },
  sportsText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
});