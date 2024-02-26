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
import SingleSport from "../../../components/single-sport/single-sport";
import { ScrollView } from "react-native-gesture-handler";


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

      <ScrollView style={styles.mainContainer}>

      <View style={styles.sportsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("GamesList")}> 
          <SingleSport
            sportName="Cricket"
            sportImage={require("../../../assets/images/cricket-Icon.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <SingleSport
            sportName="Football"
            sportImage={require("../../../assets/images/football-Icon.png")}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sportsContainer}>
        <TouchableOpacity>
        <SingleSport
          sportName="Rugby"
          sportImage={require("../../../assets/images/rugby-Icon.png")}
        />
        </TouchableOpacity>
        <TouchableOpacity>
        <SingleSport
          sportName="Tennis"
          sportImage={require("../../../assets/images/tennis-Icon.png")}
        />
        </TouchableOpacity>
        
      </View>

      <View style={styles.sportsContainer}>
        <TouchableOpacity>
        <SingleSport
          sportName="Basketball"
          sportImage={require("../../../assets/images/basketball-Icon.png")}
        />
        </TouchableOpacity>
        <TouchableOpacity>
        <SingleSport
          sportName="Hockey"
          sportImage={require("../../../assets/images/hockey-Icon.png")}
        />
        </TouchableOpacity>
        
      </View>

      </ScrollView>

      <EQBottomNavigationBar
        navigation={navigation}
        selectedTab={BottomNavigationButtons.Sports}
        onTapCallback={onBottomNavigationTapped}
      />
    </AuthorizedLayout>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginBottom: 100,
  },
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
