import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import EQBottomNavigationBar, {
  BottomNavigationButtons,
} from "../../../components/bottom-navigation-bar/bottom-navigation-bar";
import AuthorizedLayout from "../../../components/layouts/authorized-layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import AppTheme from "../../../helpers/theme";
import PageTitle from "../../../components/page-title/page-title";
import DropdownComponent from "../../../components/drop-down/drop-down";
import ResultCountryComponent from "../../../components/result-country-component/result-country-component";
import { DataTable } from 'react-native-paper';

const screenWidth = Dimensions.get("window").width;

export default function RoundDetails({ navigation }) {

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  
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

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="Round Details" navigation={navigation}/>

      <DropdownComponent/>
      <View style= {styles.tableContainer}>
        <Text style= {styles.tableFont}>Selection</Text>
        <Text style= {styles.tableFont}>Name</Text>
        <Text style= {styles.tableFont}>Status</Text>
      </View>
      <ScrollView style= {styles.scrollviewContainer} >
        
      {/* <ResultCountryComponent
        countryName={"Sri Lanka"}
        countryImage={require("../../../assets/images/LK.png")}
        success={true}
      />
      <ResultCountryComponent
        countryName={"South Africa"}
        countryImage={require("../../../assets/images/ZA.png")}
        success={true}
      />
      <ResultCountryComponent
        countryName={"India"}
        countryImage={require("../../../assets/images/IN.png")}
        success={false}
      />
      <ResultCountryComponent
        countryName={"England"}
        countryImage={require("../../../assets/images/GB.png")}
        success={true}
      />
      <ResultCountryComponent
        countryName={"Australia"}
        countryImage={require("../../../assets/images/AUS.png")}
        success={false}
      />
      <ResultCountryComponent
        countryName={"Pakistan"}
        countryImage={require("../../../assets/images/PK.png")}
        success={false}
      />
      <ResultCountryComponent
        countryName={"New Zealand"}
        countryImage={require("../../../assets/images/NZ.png")}
        success={true}
      /> */}

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
  tableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: AppTheme.colors.tabGrey,
    width: screenWidth - 10,
    alignSelf: "center",
    borderRadius: 10,
  },
  tableFont: {
    fontSize: 18,
    color: AppTheme.colors.textGrey,
    fontWeight: "bold",
  },
  scrollviewContainer: {
    marginBottom: 100,
  },
});
