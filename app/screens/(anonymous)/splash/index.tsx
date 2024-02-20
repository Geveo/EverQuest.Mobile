import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, BackHandler } from "react-native";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import AuthService from "../../../services/auth-service";
import AppTheme from "../../../helpers/theme";
import * as Animatable from 'react-native-animatable';

export default function SplashScreen({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start the fade-out animation after a delay (e.g., 2000 milliseconds)
    const delayFadeOut = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Adjust the delay time as needed

    // Clear the timeout to avoid memory leaks
    return () => clearTimeout(delayFadeOut);
  }, []);

  useEffect(() => {
    // Navigate to the next screen when the fade-out animation completes
    if (fadeOut) {
      const fadeOutComplete = setTimeout(() => {
            navigation.navigate("LandingScreen");
      }, 400); // Adjust the delay time as needed to match the animation duration
      return () => clearTimeout(fadeOutComplete);
    }
  }, [fadeOut]);

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
          <Animatable.View
            animation={fadeOut ? 'fadeOut' : ''}
            style={[styles.bottomContainer, { opacity: fadeOut ? 0 : 0.8 }]}
          >
            <Image
              style={styles.geveoLogo}
              source={require("../../../assets/images/geveo.png")}
            />
            <View style={{ alignSelf: "center" }}>
              <Text style={styles.versionText}>Version 0.0.1</Text>
            </View>
          </Animatable.View>
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
  bottomContainer: {
    position: "absolute",
    bottom: -10,
    backgroundColor: AppTheme.colors.splashBottom,
    width: "100%",
    padding: 50,
  },
  geveoLogo: {
    alignSelf: "center",
  },
  versionText: {
    marginTop: "2%",
    alignSelf: "center",
    color: AppTheme.colors.white,
  },
});
