import React, { useEffect, useState } from "react";
import {
    Dimensions,
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import AppTheme from "../../helpers/theme";
import SCButtonWithoutArrow from "../button-without-arrow/button-without-arrow";
import moment from 'moment';

// export default function ChallengeItem({ navigation, amount, playerCount,minimumPlayerCount, callParentMethod}) {
export default function ChallengeItem({ navigation, amount, shuffleTime ,minimumPlayerCount, pathOnPress, gameName, gameId, gameType}) {
  const [formattedDateTime, setFormattedDateTime] = useState('');
  const handlePress = () => {
    if (pathOnPress) {
      navigation.navigate(pathOnPress, { gameName, gameId, gameType });
    } else {
      // Handle the case when pathOnPress is undefined (i.e., shuffleTimePassed)
      // For example, show a popup indicating that the shuffle time has passed
      // You can implement this part according to your requirements
      console.log("Shuffle time has passed, navigation disabled");
    }
  };

  useEffect(() => {
    const dateTime = moment(shuffleTime, 'MM/DD/YYYY, h:mm:ss A');
    const formattedDateTimeValue = moment(dateTime).format('DD.MM.YYYY h.mmA');
    setFormattedDateTime(formattedDateTimeValue);
  }, []);

  return (
    <View style={styles.mainContainer}>
        <View style={styles.logo}>
          <Image
            source={require("../../assets/images/challenge-icon.png")}
          />
        </View>
        <View style={styles.textComponents}>
          <Text style={styles.textHeading}>{amount}</Text>
          <Text style={styles.playerCount}>Available Until {formattedDateTime}</Text>
          <View style={styles.subLogo}>
            <Image style={styles.logoCheck}
              source={require("../../assets/images/Check-icon-green.png")}
            />
            <Text style={styles.minimumPlayers}> Minimum {minimumPlayerCount} players</Text>
          </View>

          <View style={styles.button}>
          <SCButtonWithoutArrow
            text="Join Game"
            onTap={handlePress}
          />
      </View>
          
        </View>
    </View>
  );

}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
    mainContainer: {
      marginVertical: 20,
      alignSelf: "center",
      width: 350,
      borderRadius: 15,
      borderWidth: 2,
      backgroundColor: AppTheme.colors.white,
      borderColor: AppTheme.colors.tabGrey,
    },
    logo: {
      marginTop: 20,
      alignSelf: "center",
    },
    textComponents: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: 10,
    },
    textHeading: {
      fontSize: 35,
      fontWeight: "500",
    },
    playerCount: {
      color: AppTheme.colors.greySubText,
      fontSize: 17,
      fontWeight: "500",
      marginVertical: 5,
    },
    minimumPlayers: {
      color: AppTheme.colors.greySubText,
      marginVertical: 5,
    },
    logoCheck: {
      width: 15,
      height: 15,
    },
    subLogo: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    button: {
      width: screen.width * 0.8,
      marginVertical: 10,
      height: 60,
    },

});
