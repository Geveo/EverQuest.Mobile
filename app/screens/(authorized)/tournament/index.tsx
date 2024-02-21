// Importing necessary libraries
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import PageTitle from "../../../components/page-title/page-title";
import ChallengeItem from "../../../components/challenge-item/challenge-item";
import { ScrollView } from "react-native-gesture-handler";

// Define the Tournament component
export default function Tournament({ navigation, title }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  // Function to handle bottom navigation tapped event
  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

  // Function to handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Effect hook to handle hardware back press
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
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <View>
            <TouchableOpacity onPress={handleBackPress}>
              <Text style={styles.backButtonLeft}>Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.titleContainer}>
            <Text numberOfLines={2} style={styles.title}>
              ICC Criket WorldCup 2024
            </Text>
          </View>

          <View>
            <TouchableOpacity onPress={handleBackPress}>
              <Text style={styles.backButtonRight}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.userContainer}>
          <View style={styles.leftSide}>
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
            />
            <Text style={styles.userName}>Test User</Text>
            <Text style={styles.userEmail}>test@test.com</Text>
          </View>
          <View style={styles.rightSide}>
            <View style={styles.top}>
              <Text style={styles.RightHeading}> Available Amount</Text>
              <Text style={styles.RightSubHeading}>XAH 12,000</Text>
            </View>
            <View style={styles.bottom}>
              <Text style={styles.RightHeading}>Total Winnings</Text>
              <Text style={styles.RightSubHeading}>XAH 80,000</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.gamesContainer}>
      <ChallengeItem
        navigation={navigation}
        amount={250}
        playerCount={12}
        minimumPlayerCount={6}
        pathOnPress={"Challenge"}
      />

      <ChallengeItem
        navigation={navigation}
        amount={500}
        playerCount={12}
        minimumPlayerCount={6}
        pathOnPress={"Challenge"}
      />

      <ChallengeItem
        navigation={navigation}
        amount={1000}
        playerCount={12}
        minimumPlayerCount={6}
        pathOnPress={"Challenge"}
      />

      <ChallengeItem
        navigation={navigation}
        amount={3000}
        playerCount={12}
        minimumPlayerCount={6}
        pathOnPress={"Challenge"}
      />
      </ScrollView>

      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Sports}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: AppTheme.colors.buttonGreen,
  },
  gamesContainer: {
    marginBottom: 100,
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    height: 130,
    width: screen.width * 0.9,
    backgroundColor: AppTheme.colors.white,
    padding: 20,
    marginVertical: 20,
    borderRadius: 15,
  },
  leftSide: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
  },
  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
  },
  top: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: 10,
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 10,
  },
  RightHeading: {
    fontSize: 14,
    fontWeight: "400",
  },
  RightSubHeading: {
    fontSize: 12,
    color: AppTheme.colors.textGrey,
    fontWeight: "bold",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  userName: {
    fontSize: 14,
    fontWeight: "400",
    color: AppTheme.colors.black,
  },
  userEmail: {
    fontSize: 12,
    color: AppTheme.colors.textGrey,
  },
  headingContainer: {
    width: screen.width,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: screen.height * 0.03,
  },
  titleContainer: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    fontWeight: "500",
    fontSize: 24,
    alignSelf: "center",
    textAlign: "center",
    flexWrap: "wrap",
    color: AppTheme.colors.white,
  },
  backButtonLeft: {
    fontSize: 16,
    alignSelf: "center",
    marginLeft: 20,
    marginRight: 50,
    marginTop: 5,
    color: AppTheme.colors.white,
  },
  backButtonRight: {
    fontSize: 16,
    color: AppTheme.colors.buttonGreen,
    marginTop: 5,
    alignSelf: "flex-start",
    marginRight: 20,
  },
});
