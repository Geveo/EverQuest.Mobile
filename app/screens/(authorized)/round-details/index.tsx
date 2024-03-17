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
import axios from "axios";
const {
  GameEngineApiParameters,
} = require(".../../../app/constants/constants");



const screenWidth = Dimensions.get("window").width;

export default function RoundDetails({ navigation, route }) {
  const { VQGameID, maxRoundNumber, roundNumber } = route.params;

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [roundDetails, setRoundDetails] = useState([]);
  const [detailsRoundNumber, setDetailsRoundNumber] = useState(roundNumber);

  const countryImages = {
    "Sri Lanka": require("../../../assets/images/sri_lanka.png"),
    "Australia": require("../../../assets/images/australia.png"),
    "Ireland": require("../../../assets/images/Ireland.png"),
    "Argentina": require("../../../assets/images/Argentina.png"),
    "England": require("../../../assets/images/england.png"),
    "France": require("../../../assets/images/France.png"),
    "Afganistan": require("../../../assets/images/afganistan.png"),
    "Bangladesh": require("../../../assets/images/bangladesh.png"),
    "India": require("../../../assets/images/india.png"),
    "Netherlands": require("../../../assets/images/netherlands.png"),
    "New-Zealand": require("../../../assets/images/new_zealand.png"),
    "New Zealand": require("../../../assets/images/new_zealand.png"),
    "Pakistan": require("../../../assets/images/Pakistan.png"),
    "South Africa": require("../../../assets/images/south_africa.png"),
    "WestIndies": require("../../../assets/images/australia.png"),
    "Zimbabwe": require("../../../assets/images/australia.png"),
    "Italy": require("../../../assets/images/Zimbabwe.png"),
    "Japan": require("../../../assets/images/Japan.png"),
    "Belgium": require("../../../assets/images/Belgium.png"),
    "Brazil": require("../../../assets/images/Brazil.png"),
    "Portugal": require("../../../assets/images/Portugal.png"),
    "Spain": require("../../../assets/images/Spain.png"),
  };
  
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

  const getAllParticipants = async () => {
    try {
      const response = await axios.get(
        `${GameEngineApiParameters.URL}/api/games/getPlayerTeamSelectionForRoundsByVQGameID?vqGameId=${VQGameID}&userID=10002`
      );

      const filteredRoundDetails = response.data.GameHistory.
        filter((item) => item.roundnumber === detailsRoundNumber);

      console.log(detailsRoundNumber);
      
      setRoundDetails(filteredRoundDetails);
      console.log(filteredRoundDetails);
      
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    getAllParticipants();
  }, [detailsRoundNumber]);

  const handleRoundChange = (selectedRound) => {
    setDetailsRoundNumber(parseInt(selectedRound)); // Update the selected round
  };

  return (
    <AuthorizedLayout showWaitIndicator={showLoadingIndicator}>
      <PageTitle title="Round Details" navigation={navigation}/>

      <DropdownComponent maxRounds={maxRoundNumber} selectedRound={detailsRoundNumber} onRoundChange={handleRoundChange} />
      <View style= {styles.tableContainer}>
        <Text style= {styles.tableFont}>Selection</Text>
        <Text style= {styles.tableFont}>Name</Text>
        <Text style= {styles.tableFont}>Status</Text>
      </View>
      <ScrollView style= {styles.scrollviewContainer} >

      {roundDetails.map((item, index) =>
        <ResultCountryComponent
        key={index}
        userName={item.username}
        countryImage={!item.teamname? require("../../../assets/images/DummyCountry.png") : countryImages[item.teamname] }
        success={item.IsVQWin}
      />
      ) }
        
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
