import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AppTheme from "../../helpers/theme";
import {
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const SCButton = ({
  onTap = null,
  text = "Button",
  bgColor = AppTheme.colors.buttonGreen,
  textColor = AppTheme.colors.white,
  showLeftArrow = true,
  showRightArrow = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onTap}
      style={[styles.container, { backgroundColor: bgColor }]}
    >
      {showLeftArrow && (
        <Icon name="chevron-left" size={30} style={styles.leftIcon} />
      )}
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      {showRightArrow && (
         <FontAwesomeIcon
         icon={faChevronRight}
         size={20}
        style={styles.rightIcon}
       />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 20,
    alignSelf: "center",
  },
  leftIcon: {
    color: AppTheme.colors.buttonGreen,
    marginRight: 10,
  },
  rightIcon: {
    color: AppTheme.colors.white,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default SCButton;
