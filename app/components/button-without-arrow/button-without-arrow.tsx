import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppTheme from "../../helpers/theme";
import {
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const SCButtonWithoutArrow = ({
  onTap = null,
  text = "Button",
  bgColor = AppTheme.colors.buttonGreen,
  textColor = AppTheme.colors.white,
}) => {
  return (
    <TouchableOpacity
      onPress={onTap}
      style={[styles.container, { backgroundColor: bgColor }]}
    >
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    alignSelf: "center",
  },
});

export default SCButtonWithoutArrow;
