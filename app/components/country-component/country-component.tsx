import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import AppTheme from "../../helpers/theme";

export default function CountryComponent({
  countryName,
  countryImage,
  active=false,
}) {
  return (
    <View>
      <View style={[styles.mainContainer, active && styles.activeContainer]}>
        <View style={styles.countryContainer}>
          <View style={styles.countryImage}>
            <Image
              resizeMethod="resize"
              resizeMode="contain"
              source={countryImage}
              onError={() => {
                console.log("Image failed to load");
              }}
            />
          </View>
          <View>
            <Text style={[styles.countryName, active && styles.activeText]}>
              {countryName}
            </Text>
          </View>
        </View>
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 5,
    width: 150,
    height: 100,
    backgroundColor: AppTheme.colors.white,
    borderWidth: 2,
    borderColor: AppTheme.colors.tabGrey,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  activeContainer: {
    backgroundColor: AppTheme.colors.emailGreen, // Change background color when active
    borderColor: AppTheme.colors.emailGreen, // Change border color when active
  },
  countryContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  countryImage: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  countryName: {
    alighnSelf: "center",
    marginTop: 15,
    color: AppTheme.colors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  activeText: {
    color: AppTheme.colors.white, // Change text color when active
  }
});
