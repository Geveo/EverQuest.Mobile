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

export default function CountryComponent({ countryName }) {

    const [active, setActive] = useState(false);

  return (
  <View style={styles.mainContainer}>
    <View style={styles.countryContainer}>
    <View style={styles.countryImage}>
    <Image
          resizeMethod="resize"
          resizeMode="contain"
          source={require(".../../../assets/images/IN.png")}
          onError={(e) => {
            console.log("Image failed to load");
          }}
        />
    </View>
    <View >
        <Text>{countryName}</Text>
    </View>
    </View>
    
    <TouchableOpacity 
    style={[styles.radioButton, active && styles.radioButtonActive]}
    onPress={() => setActive(!active)}
    />
  </View>
  );
}

const styles = StyleSheet.create({
    mainContainer: {
        marginTop: 20,
        width: 350,
        height: 50,
        backgroundColor: AppTheme.colors.white,
        elevation: 5,
        alignItems: "center",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    countryContainer:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    countryImage:{
        width: 30,
        height: 30,
        borderRadius: 30,
        marginRight: 30,
    },
    countryName:{
        color: AppTheme.colors.black,
    },
    radioButton:{
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor: AppTheme.colors.white,
        borderWidth: 1,
        borderColor: AppTheme.colors.tabGrey,
    },
    radioButtonActive: {
        backgroundColor: AppTheme.colors.buttonGreen, // Change background color to green when active
        borderColor: AppTheme.colors.buttonGreen, // Change border color to green when active
      }
});
