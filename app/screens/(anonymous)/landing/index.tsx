import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, BackHandler } from "react-native";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import AuthService from "../../../services/auth-service";
import AppTheme from "../../../helpers/theme";
import SCButton from "../../../components/button/button";
import HotPocketClientService from "../../../services/hp-client-service";

export default function LandingScreen({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  // useEffect(() => {
  //   AuthService.checkAuthentication().then((loggedIn) => {
  //     if (loggedIn) {
  //       navigation.navigate("HomeScreen");
  //     } else {
  //       navigation.navigate("SignInScreen");
  //     }
  //   });
  // }, []);
  const navigateHandler = async () => {
    // AuthService.checkAuthentication().then((loggedIn) => {
    //        if (loggedIn) {
    //          navigation.navigate("HomeScreen");
    //        } else {
    //          navigation.navigate("SignInScreen");
    //        }
    //     });
    navigation.navigate("LoginScreen");
  }

  useEffect(() => {
    async function initializeHotPocketClient() {
      try {
        // Get the HotPocketClient instance
        const hotPocketClient = await HotPocketClientService.getInstance();
        console.log('HotPocketClient instance initialized:', hotPocketClient);
      } catch (error) {
        console.error('Error initializing HotPocketClient:', error);
      }
    }
    initializeHotPocketClient();

    return () => {
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.isFocused()) {
          BackHandler.exitApp();
          return true;
        }
        return false;
      }
    );

    return () => {
      if (backHandler.remove) {
        backHandler.remove();
      }
    };
  }, [navigation]);

  return (
    <>
      <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
        <View style={styles.container}>
          <Image
            style={styles.backgroundImage}
            source={require("../../../assets/images/BgConnected.png")}
          />
          <View>
            <Text style={styles.appName}>EverQuest</Text>
          </View>
          <View style={styles.bottom}>
            <SCButton
              text="Get Started"
              showRightArrow={true}
              onTap={() => navigateHandler()}
            />
          </View>
        </View>
      </AuthorizedLayout>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.splashBackground,
  },
  appName: {
    marginTop: "80%",
    alignSelf: "center",
    fontSize: 36,
    color: AppTheme.colors.splashGreen,
    fontWeight: "bold",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bottom: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
});
