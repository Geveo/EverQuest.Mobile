import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Image,
  Dimensions,
} from "react-native";
import AppTheme from "../../helpers/theme";

const screenWidth = Dimensions.get("window").width;

export default function ResultCountryComponent({
  userName,
  countryImage,
  success,
}) {
  const [active, setActive] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.countryImage}>
        <Image
          style={{ width: 40, height: 40 }}
          resizeMethod="resize"
          resizeMode="contain"
          source={countryImage}
          onError={(e) => {
            console.log("Image failed to load");
          }}
        />
      </View>
      <View>
        <Text style={styles.countryName}>{userName}</Text>
      </View>
      <View style={[styles.status, !success && styles.failedStatus]}>
        <View style={[styles.chipIcon, !success && styles.failedChipIcon ]}></View>
        <Text style={[styles.chipText, !success && styles.failedChipText]}>
          {success ? "Success" : "Disqualified"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: screenWidth - 10,
    height: 70,
    backgroundColor: AppTheme.colors.greybackground,
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.colors.tabGrey,
  },
  countryImage: {
    borderRadius: 35,
    marginRight: 35,
  },
  countryName: {
    color: AppTheme.colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  status: {
    height: 25,
    backgroundColor: AppTheme.colors.bottomNavGreen,
    display: "flex",
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
  },
  chipIcon: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.toast_successGreen,
    marginHorizontal: 5,
  },
  chipText: {
    fontSize: 15,
    color: AppTheme.colors.toast_successGreen,
    fontWeight: "500",
    marginHorizontal: 5,
  },
  failedStatus: {
    backgroundColor: 'rgba(242, 29, 29, 0.10)'
  },
    failedChipIcon: {
        backgroundColor: "#F21D1D",
    },
    failedChipText: {
        color: "#F21D1D",
    },
});
