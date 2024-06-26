import { SafeAreaView, StyleSheet, View } from "react-native";
import React from "react";
import WaitIndicator from "../activity-indicator/activity-indicator";
import AppTheme from "../../helpers/theme";

export default function AuthorizedLayout({
  children,
  showWaitIndicator = false,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.scrollView}
        // contentContainerStyle={styles.scrollViewContentContainer}
      >
        <View
          style={styles.screenBackground}
        >
          <WaitIndicator show={showWaitIndicator} />
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.white,
  },
  scrollView: {
  },
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  screenBackground: {
    width: "100%",
    height: "100%",
  },
});
