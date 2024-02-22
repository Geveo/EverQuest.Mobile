import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import PageTitle from "../../../components/page-title/page-title";
import CountryComponent from "../../../components/country-component/country-component";
import SCButtonWithoutArrow from "../../../components/button-without-arrow/button-without-arrow";

export default function Challenge({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [activeTab, setActiveTab] = useState("Teams");
  const [RoundNumber, setRoundNumber] = useState(1);

  async function onBottomNavigationTapped(tab: BottomNavigationButtons) {
    console.log(tab);
    return true;
  }

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

  // Function to handle tab selection
  const handleTabSelection = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="Rs. 250" navigation={navigation} />
      <Text style={styles.roundHeading}>Round 1</Text>
      <Text style={styles.roundText}>Choose the team that you think</Text>
      <Text style={styles.roundText}>is going to win</Text>

      <View style={styles.mainTabContainer}>
        <View style={styles.tabContainerHeading}>
          <TouchableOpacity
            style={[
              styles.teamsTab,
              activeTab === "Teams" && styles.activeTab, // Apply active style if active tab //added as a change
            ]}
            onPress={() => handleTabSelection("Teams")} // Handle tab selection //added as a change
          >
            <Text
              style={[
                styles.teamsTabText,
                activeTab === "Teams" && styles.activeTabText, // Apply active text color if active tab //added as a change
              ]}
            >
              Teams
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.resultTab,
              activeTab === "Result" && styles.activeTab, // Apply active style if active tab //added as a change
            ]}
            onPress={() => handleTabSelection("Result")} // Handle tab selection //added as a change
          >
            <Text
              style={[
                styles.resultTabText,
                activeTab === "Result" && styles.activeTabText, // Apply active text color if active tab //added as a change
              ]}
            >
              Result
            </Text>
          </TouchableOpacity>
        </View>
        </View>
        {activeTab === "Teams" ? (
          <ScrollView style={styles.tabContent1}>
            <CountryComponent
              countryName={"Sri Lanka"}
              countryImage={require("../../../assets/images/LK.png")}
            />
            <Text style={styles.vsTExt}> vs </Text>
            <CountryComponent
              countryName={"England"}
              countryImage={require("../../../assets/images/GB.png")}
            />
            <View style={styles.horizontalDivider} />
            <CountryComponent
              countryName={"Australia"}
              countryImage={require("../../../assets/images/AUS.png")}
            />
            <Text style={styles.vsTExt}> vs </Text>
            <CountryComponent
              countryName={"South Africa"}
              countryImage={require("../../../assets/images/ZA.png")}
            />
            <View style={styles.horizontalDivider} />
            <CountryComponent
              countryName={"India"}
              countryImage={require("../../../assets/images/IN.png")}
            />
            <Text style={styles.vsTExt}> vs </Text>
            <CountryComponent
              countryName={"Afghanistan"}
              countryImage={require("../../../assets/images/AFG.png")}
            />
            <View style={styles.horizontalDivider} />
            <CountryComponent
              countryName={"Pakistan"}
              countryImage={require("../../../assets/images/PK.png")}
            />
            <Text style={styles.vsTExt}> vs </Text>
            <CountryComponent
              countryName={"New Zealand"}
              countryImage={require("../../../assets/images/NZ.png")}
            />
            <View style={styles.horizontalDivider} />
          </ScrollView>
        ) : (
          <View style={styles.resultContainer}>
            <Text style={styles.resultGreet}>Congratulations !!!</Text>
            <Text style={styles.textResult}>You have won Round {RoundNumber}</Text>

            <SCButtonWithoutArrow
              text= "Round 2"
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("RoundDetails");
              }}
            >
            <Text style={styles.detailsText}> Round Details </Text>
            </TouchableOpacity>
            
          </View>
        )}
      

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
  roundHeading: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: screen.height * 0.02,
    alignSelf: "center",
    color: AppTheme.colors.splashGreen,
    marginBottom: 5,
  },
  roundText: {
    fontSize: 16,
    alignSelf: "center",
    flexWrap: "wrap",
  },
  mainTabContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  tabContainerHeading: {
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: AppTheme.colors.tabGrey,
    borderRadius: 30,
    color: AppTheme.colors.textGrey,
    alignItems: "center",
    marginBottom: 20,
  },
  teamsTab: {
    flex: 1,
    alignItems: "center",
  },
  resultTab: {
    flex: 1,
    alignItems: "center",
  },
  teamsTabText: {
    color: AppTheme.colors.textGrey,
    fontWeight: "600",
  },
  resultTabText: {
    color: AppTheme.colors.textGrey,
    fontWeight: "600",
  },
  activeTab: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 30,
    margin: 2,
    padding: 15,
    alignContent: "center",
  },
  activeTabText: {
    color: AppTheme.colors.backButtonGreen, // Set text color for active tab //added as a change
  },
  vsTExt: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "600",
    color: AppTheme.colors.textGrey,
  },
  horizontalDivider: {
    borderBottomColor: AppTheme.colors.buttonGreen,
    borderBottomWidth: 0.5,
    marginVertical: 15,
    width: "80%",
    alignSelf: "center",
  },
  tabContent1: {
    marginBottom: 100,
  },
  resultContainer: {
    marginVertical: 20,
    alignSelf: "center",
    width: "80%",
  },
  resultGreet: {
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "center",
    color: AppTheme.colors.splashGreen,
  },
  textResult: {
    marginVertical: 20,
    fontSize: 16,
    alignSelf: "center",
    color: AppTheme.colors.darkGrey,
    marginBottom: 40,
  },
  detailsText: {
    fontSize: 16,
    alignSelf: "center",
    color: AppTheme.colors.textGrey,
    marginTop: 60,
    fontWeight: "800",
    borderBottomColor: AppTheme.colors.textGrey,
    borderBottomWidth: 1,
  },
});
