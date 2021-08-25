import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import TickerFinder from "./src/components/TickerFinder";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { AppScreen } from "./src/screens/AppScreen";
import Store, { BackendContext } from "./Store";

const theme = {
  ...DefaultTheme,
};

export default function App() {
  return (
    <Store>
      <PaperProvider theme={theme}>
        <NavigationContainer fallback={<Text>Loading...</Text>}>
          <SafeAreaView style={styles.container}>
            <AppScreen />
            <StatusBar style="auto" />
          </SafeAreaView>
        </NavigationContainer>
      </PaperProvider>
    </Store>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
});
