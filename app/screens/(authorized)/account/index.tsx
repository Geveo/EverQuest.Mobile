import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  BackHandler,
} from "react-native";
import AppTheme from "../../../helpers/theme";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import AuthService from "../../../services/auth-service";
import React, { useEffect, useState } from "react";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import SCButton from "../../../components/button/button";
import PageTitle from "../../../components/page-title/page-title";

const screenWidth = Dimensions.get("window").width;

export default function Account({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  const userName = "Test User";
  const userEmail = "test@test.com";

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

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  async function signOut() {
    console.log("Sign out");
  }

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="Account" navigation={navigation}/>
      <View style={styles.accountContainer}>
        <Image
          style={styles.profileImage}
          resizeMethod="resize"
          resizeMode="contain"
          // source={{
          //   uri: userObj
          //     ? userObj.ImageURL === ""
          //       ? "https://via.placeholder.com/250"
          //       : userObj.ImageURL
          //     : "https://via.placeholder.com/250",
          // }}
          source={require("../../../assets/images/Avatar.png")}
          onError={(e) => {
            console.log("Image failed to load");
          }}
        />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      <View style={styles.signOut}>
        <SCButton
          text="Sign Out"
          showRightArrow={true}
          onTap={async () => {
            await signOut();
          }}
        />
      </View>

      <View style={styles.horizontal} />

      <View style={styles.evernode}>
          <Text style={styles.poweredByText}>Powered by:</Text>
          <Image
            style={styles.evernodeLogo}
            source={require("../../../assets/images/evernode.png")}
          />
          <Text style={styles.evernodeTest}>
            A DAPP platform to run layer-2 smart contracts
          </Text>
          <Text style={styles.evernodeTest}>on the XRP ledger</Text>
        </View>
        


      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Account}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  accountContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: AppTheme.colors.white,
    marginTop: 20,
    elevation: 8,
    width: screenWidth * 0.9,
    borderRadius: 15,
    padding: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 15,
    marginTop: 10,
    color: AppTheme.colors.emailGreen,
  },
  profileImage: {
    marginBottom: 20,
    borderRadius: 100,
    width: 73,
    height: 73,
  },
  signOut: {
    alignSelf: "center",
    width: screenWidth,
    marginTop: 30,
  },
  poweredByText: {
    margin: 5,
    fontWeight: "bold",
  },
  evernodeLogo: {
    marginBottom: screen.height * 0.02,
    width: 864 * 0.2,
    height: 116 * 0.2,
  },
  evernode: {
    alignItems: "center",
    borderBlockColor: AppTheme.colors.lineGreen,
  },
  evernodeTest: {
    alignSelf: "center",
    color: AppTheme.colors.descriptionTextSmall,
    
  },
  horizontal: {
    borderBottomWidth: 1,
    width: screenWidth * 0.9,
    alignSelf: "center",
    borderBlockColor: AppTheme.colors.lineGreen,
    marginTop: 60,
    marginBottom: 20,
  }
});