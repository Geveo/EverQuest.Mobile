import {
  faHome,
  faCrown,
  faWallet,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppTheme from "../../helpers/theme";
import React from "react";
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
export enum BottomNavigationButtons {
  Home,
  Sports,
  Wallet,
  Account,
}

export default function EQBottomNavigationBar({
  navigation,
  selectedTab = BottomNavigationButtons.Home,
  onTapCallback = null,
}) {
  async function onTap(tappedTab: BottomNavigationButtons) {
    if (onTapCallback) {
      let allowNavigation = await onTapCallback(tappedTab);

      if (allowNavigation) {
        switch (tappedTab) {
          case BottomNavigationButtons.Sports:
            navigation.navigate("SportsCatergory");
            break;

          case BottomNavigationButtons.Wallet:
            navigation.navigate("WalletScreen");
            break;

          case BottomNavigationButtons.Account:
            navigation.navigate("AccountScreen");
            break;

          case BottomNavigationButtons.Home:
          default:
            navigation.navigate("HomeScreen");
            break;
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <View
          style={[
            styles.actionButton,
            selectedTab == BottomNavigationButtons.Home
              ? styles.activeActionButton
              : styles.inactiveActionButton,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
              await onTap(BottomNavigationButtons.Home);
            }}
          >
            <FontAwesomeIcon 
              icon={faHome} 
              size={25} 
              color={selectedTab == BottomNavigationButtons.Home ? AppTheme.colors.iconGreen : AppTheme.colors.black}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.actionButton,
            selectedTab == BottomNavigationButtons.Sports
              ? styles.activeActionButton
              : styles.inactiveActionButton,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
              await onTap(BottomNavigationButtons.Sports);
            }}
          >
            <FontAwesomeIcon 
              icon={faCrown} 
              size={25} 
              color={selectedTab == BottomNavigationButtons.Sports ? AppTheme.colors.iconGreen : AppTheme.colors.black}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.actionButton,
            selectedTab == BottomNavigationButtons.Wallet
              ? styles.activeActionButton
              : styles.inactiveActionButton,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
              await onTap(BottomNavigationButtons.Wallet);
            }}
          >
            <FontAwesomeIcon
              icon={faWallet}
              size={25}
              color={selectedTab == BottomNavigationButtons.Wallet ? AppTheme.colors.iconGreen : AppTheme.colors.black}
            />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.actionButton,
            selectedTab == BottomNavigationButtons.Account
              ? styles.activeActionButton
              : styles.inactiveActionButton,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
              await onTap(BottomNavigationButtons.Account);
            }}
          >
            <FontAwesomeIcon 
              icon={faUser} 
              size={25} 
              color={selectedTab == BottomNavigationButtons.Account ? AppTheme.colors.iconGreen : AppTheme.colors.black}
              />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    paddingHorizontal: 15,
  },
  navbar: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.bottomNavGreen,
    borderRadius: 30,
    height:80,
    width: "100%",
  },
  actionButton: {
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: screenWidth/4.3,
  },
  activeActionButton: {
    //color: AppTheme.colors.iconGreen,
  },
  inactiveActionButton: {
    opacity: 0.3,
  },
});
