import Autocomplete from "react-native-autocomplete-input";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { BackendContext } from "../../Store";

const Tickers = () => {
  const [backendState, backendDispatch] = useContext(BackendContext);

  return (
    <View style={styles.container}>
      <ScrollView>
        {Object.values(backendState.tickers).map((ticker) => {
          return (
            <Pressable style={styles.listItem} key={ticker.id}>
              <View style={{ flex: 0.1 }}>
                <Text>{ticker.flagCode}</Text>
              </View>

              <View style={{ flex: 0.7 }}>
                <Text>{ticker.name}</Text>
                <Text>{ticker.tickerSymbol}</Text>
              </View>
              <View style={{ flex: 0.2 }}>
                <Text>{ticker.changePercent.toFixed(2)}%</Text>
                <Text>
                  {ticker.lastPrice} {ticker.currency}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listItem: {
    padding: 5,
    flexDirection: "row",
  },
});

export default Tickers;
