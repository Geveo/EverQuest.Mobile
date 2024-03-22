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
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            source={sportImage}
          />
          <Text style={styles.sportsText}> {sportName} </Text>
          </View>
    </View>
  );

}

const styles = StyleSheet.create({
  sportCatergory: {
    backgroundColor: AppTheme.colors.tabGrey,
    padding: 25,
    borderRadius: 8,
    elevation: 5,
    width: 150,
    height: 130,
    marginBottom: 40,
  },
  SportLogo: {
    alignSelf: "center",
    height: 50,
    width: 50,
  },
  sportsText: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: "500",
    alignSelf: "center",
  },
});