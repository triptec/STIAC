import Autocomplete from "react-native-autocomplete-input";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";

import { TickerSearch, TickerAdd } from "../api/api";
import { TextInput } from "react-native-paper";

const addTicker = (ticker) => {
  tickerAdd(ticker);
};
const tickerSearch = async (query) => {
  const promise = new Promise((resolve, reject) => {
    TickerSearch(query).then((res) => {
      //console.log(res);
      if (res.totalNumberOfHits === 0) {
        resolve([]);
        return;
      }
      const results = res.hits.reduce((acc, val) => {
        console.log(val);
        const items = val.topHits ? val.topHits.slice(0, 10) : [];
        return [...acc, ...items];
      }, []);
      console.log(results);
      resolve(results);
    });
  });
  return promise;
};
const TickerFinder = () => {
  const [query, setQuery] = useState("");
  const [tickers, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hideResults, setHideResults] = useState(true);
  const placeholder = isLoading ? "Loading data..." : "Enter ticker query";

  useEffect(() => {
    if (query.length === 0) return;
    tickerSearch(query).then((res) => {
      setTickers(res);
    });
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.autocompleteContainer}>
        <TextInput
          editable={!isLoading}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
          }}
          placeholder={placeholder}
        ></TextInput>
      </View>
      <ScrollView>
        {tickers.map((ticker) => {
          return (
            <Pressable
              style={styles.listItem}
              key={ticker.id}
              onPress={() => TickerAdd(ticker)}
            >
              <View style={{ flex: 0.1 }}>
                <Text>{ticker.flagCode}</Text>
              </View>

              <View style={{ flex: 0.7 }}>
                <Text>
                  {ticker.name} {ticker.selected ? "*" : null}
                </Text>
                <Text>{ticker.tickerSymbol}</Text>
              </View>
              <View style={{ flex: 0.2 }}>
                <Text>{ticker.changePercent?.toFixed(2)}%</Text>
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

export default TickerFinder;
