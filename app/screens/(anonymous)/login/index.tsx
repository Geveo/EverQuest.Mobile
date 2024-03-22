import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Linking,
} from "react-native";
import AppTheme from "../../../helpers/theme";
import SCButtonWithoutArrow from "../../../components/button-without-arrow/button-without-arrow";
import AnonymousLayout from "../../../components/layouts/anonymous-layout";
import "text-encoding";
import AccountService from "../../../services/services-domain/account-service";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../../services/toast-service";
import { ToastMessageTypes } from "../../../helpers/constants";

import { jwtDecode, JwtPayload } from "jwt-decode";

const screenWidth = Dimensions.get("window").width;

const saveCredentials = async (xrpaddress, token) => {
  try {
    await AsyncStorage.setItem("XRP_Address", xrpaddress);
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Error saving credentials:", error);
  }
};

export default function Login({ title, navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const toast = useRef(null);
  if (!AccountService.instance) {
    AccountService.instance = new AccountService();
  }
  const _accountService = AccountService.instance;

  Linking.addEventListener("url", async (event: { url: string }) => {
    let u = new URL(event.url);
    let token = u.searchParams.get("access_token");
    let jwtDecoded = jwtDecode<JwtPayload>(token);
    let xrpaddress = jwtDecoded.sub;
    saveCredentials(xrpaddress, token);

    const msgObj = {
      XRP_Address: xrpaddress,
    };
    _accountService
      .hasAccount(msgObj)
      .then(async (hasAccount: any) => {
        if (hasAccount) {
          navigation.replace("HomeScreen");
          _accountService
            .getPlayerID(xrpaddress)
            .then(async (playerID: string) => {
              await AsyncStorage.setItem("playerId", playerID.toString());
            })
            .catch((error) => {
              console.error("Error occurred while getting player ID:", error);
              showToast(
                "An error occurred. Please try again later.",
                ToastMessageTypes.error
              );
            });
        } else {
          showToast("Invalid Login!", ToastMessageTypes.error);
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        showToast(
          "An error occurred. Please try again later.",
          ToastMessageTypes.error
        );
      });
  });

  const handleLoginRequest = async () => {
    Linking.openURL(
      "https://oauth2.xumm.app/auth?client_id=91d06dfb-b478-45cb-8797-5c5ce786e915&redirect_uri=everquest://login&scope=token&response_type=token&response_mode=query"
    );
  };

  return (
    <AnonymousLayout showWaitIndicator={showLoadingIndicator}>
      <View style={styles.mainContainer}>
        <Toast ref={toast} />
        <View style={styles.TopContainer}>
        <Image
            source={require("../../../assets/images/EverQuestLogo.png")} // Replace "your_image.png" with the actual image file name
          />
        </View>
        <View>
          <Text style={styles.title}>Login</Text>
        </View>
        <View>
          <Text style={styles.subText}>Login with your Xaman wallet</Text>
        </View>
        <View style={styles.container}>
          
        </View>
        <View style={styles.button}>
          <SCButtonWithoutArrow
            onTap={handleLoginRequest}
            text="Login"
            bgColor={AppTheme.colors.buttonGreen}
            textColor={AppTheme.colors.white}
          />
        </View>
        <Toast ref={toast} />
      </View>
    </AnonymousLayout>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  mainContainer: {
    alignItems: "center",
    height: screen.height,
    width: screen.width,
  },
  title: {
    fontWeight: "bold",
    fontSize: 35,
    marginTop: screen.height * 0.04,
    alignSelf: "center",
  },
  subText: {
    fontSize: 20,
    marginTop: 30,
    alignSelf: "center",
  },
  button: {
    marginTop: 60,
    width: screenWidth * 0.9,
    height: 80,
  },
  container: {
    paddingTop: 23,
    width: screenWidth * 0.85,
    alignItems: "center",
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
  TopContainer: {
    backgroundColor: AppTheme.colors.buttonGreen,
    width: screenWidth,
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  TopContainerText: {
    fontSize: 50,
    fontWeight: "500",
    color: AppTheme.colors.white,
  },
});
