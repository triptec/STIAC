import Autocomplete from "react-native-autocomplete-input";
import React, { useContext, useEffect, useState } from "react";
import * as Animatable from 'react-native-animatable';
import _sortBy from "lodash.sortby"
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
        {_sortBy(Object.values(backendState.tickers),['displayName']).map((ticker) => {
          return (
            <Pressable style={styles.listItem} key={ticker.isin}>
              <View style={{ flex: 0.1 }}>
                <Text>{ticker.countryCode}</Text>
              </View>

              <View style={{ flex: 0.7 }}>
                <Text>{ticker.displayName}</Text>
                <Text>{ticker.ticker}</Text>
              </View>
              <View key={ticker.lastPrice} style={{ flex: 0.2 }}>
                {/*<Text>{ticker.changePercent.toFixed(2)}%</Text>*/}
                  <Animatable.Text animation="flash">{ticker.lastPrice} {ticker.currency}</Animatable.Text>
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
