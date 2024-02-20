import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import PageTitle from "../../../components/page-title/page-title";
import { Searchbar } from "react-native-paper";

export default function SportsCatergory({ navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState(""); // search bar

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

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="Sports" navigation={navigation} />
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        iconColor={AppTheme.colors.textGrey}
        style={styles.searchBar}
        inputStyle={{
          backgroundColor: AppTheme.colors.tabGrey,
          borderRadius: 30,
        }}
        placeholderTextColor={AppTheme.colors.textGrey}
      />

      <Text style={styles.heading}> Sports Catergory</Text>

      <View style={styles.sportsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("GamesList")}>
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            source={require("../../../assets/images/cricket-Icon.png")}
          />
          </View>
          <Text style={styles.sportsText}>Cricket</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("GamesList")}>
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            source={require("../../../assets/images/football-Icon.png")}
          />
          </View>
          <Text style={styles.sportsText}>Football</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sportsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("GamesList")}>
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            source={require("../../../assets/images/rugby-Icon.png")}
          />
          </View>
          <Text style={styles.sportsText}>Rugby</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("GamesList")}>
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            source={require("../../../assets/images/tennis-Icon.png")}
          />
          </View>
          <Text style={styles.sportsText}>Tennis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sportsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("GamesList")}>
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            source={require("../../../assets/images/hockey-Icon.png")}
          />
          </View>
          <Text style={styles.sportsText}>Hockey</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("GamesList")}>
          <View style={styles.sportCatergory}>
          <Image
            style={styles.SportLogo}
            source={require("../../../assets/images/basketball-Icon.png")}
          />
          </View>
          <Text style={styles.sportsText}>Basketball</Text>
        </TouchableOpacity>
      </View>

      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Sports}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "500",
    margin: 15,
  },
  sportsContainer: {
    marginVertical: 6,
    marginHorizontal: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sportCatergory: {
    backgroundColor: AppTheme.colors.tabGrey,
    padding: 25,
    borderRadius: 8,
    elevation: 5,
    width: 140,
    height: 130,
  },
  SportLogo: {
    alignSelf: "center",
    height: 80,
  },
  sportsText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    alignSelf: "center",
  },
});
