import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import AppTheme from "../../helpers/theme";

const screenWidth = Dimensions.get("window").width;

export default function PageTitle({ title, navigation }) {
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backButtonLeft}>Back</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={styles.backButtonRight}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: screen.height * 0.02,
    alignSelf: "center",
  },
  backButtonLeft: {
    fontSize: 16,
    color: AppTheme.colors.backButtonGreen,
    marginTop: screen.height * 0.02,
    alignSelf: "center",
    marginLeft: 20,
  },
  backButtonRight: {
    fontSize: 16,
    color: AppTheme.colors.white,
    marginTop: screen.height * 0.02,
    alignSelf: "center",
    marginRight: 20,
  },
});
