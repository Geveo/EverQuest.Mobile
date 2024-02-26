import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import SCButton from "../../../components/button/button";
import AppTheme from "../../../helpers/theme";
import SCButtonWithoutArrow from "../../../components/button-without-arrow/button-without-arrow";
import AnonymousLayout from "../../../components/layouts/anonymous-layout";

const screenWidth = Dimensions.get("window").width;

export default function Login({ title, navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const handleBackPress = () => {
    navigation.goBack();
  };

  const navigateHandler = async () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <AnonymousLayout showWaitIndicator={showLoadingIndicator}>
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.title}>Login</Text>
      </View>
      <View>
        <Text style={styles.subText}>Login with your crypto wallet</Text>
      </View>

      <View style = {styles.container}>
            <TextInput style = {styles.input}
              secureTextEntry={true}
               underlineColorAndroid = "transparent"
               placeholder = "Enter XRPL secret key"
               placeholderTextColor = {AppTheme.colors.mediumGrey}
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}/>
      </View>

      <View style={styles.button}>
        <SCButtonWithoutArrow
          onTap={navigateHandler}
          text="Login"
          bgColor={AppTheme.colors.buttonGreen}
          textColor={AppTheme.colors.white}
        />
      </View>

    </View>
    </AnonymousLayout>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    height: screen.height,
    width: screen.width,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: screen.height * 0.04,
    alignSelf: "center",
  },
  subText: {
    fontSize: 18,
    marginTop: screen.height * 0.02,
    alignSelf: "center",
  },
  button: {
    marginTop: screen.height * 0.1,
    width: screenWidth * 0.85,
  }, 
  container: {
    paddingTop: 23,
    width: screenWidth * 0.85,
 },
 input: {
    margin: 15,
    borderColor: AppTheme.colors.lineGreen,
    borderWidth: 2,
    backgroundColor: "#F6FEF9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: "500",
 },
});
