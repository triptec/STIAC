import Autocomplete from "react-native-autocomplete-input";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import debounce from "lodash.debounce";
import pDebounce from "p-debounce";

import { TickerSearch, TickerAdd } from "../api/api";
import {
  TextInput,
  Menu,
  IconButton,
  Divider,
  Colors,
} from "react-native-paper";
import { BackendContext } from "../../Store";

const tickerSearch = pDebounce(async (query) => {
  return TickerSearch(query);
}, 300);

const TickerFinder = () => {
  const [query, setQuery] = useState("");
  const [tickers, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hideResults, setHideResults] = useState(true);
  const placeholder = isLoading ? "Loading data..." : "Enter ticker query";
  const [backendState, backendDispatch] = useContext(BackendContext);
  const [visible, setVisible] = React.useState(null);

  const openMenu = (isin) => setVisible(isin);
  const closeMenu = () => setVisible(null);

  useEffect(() => {
    if (query.length === 0) return;
    tickerSearch(query).then((res) => {
      console.log(res);
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
              key={ticker.avanzaId}
              onPress={() => {}}
            >
              <View style={{ flex: 0.1 }}>
                <Text>{ticker.countryCode}</Text>
              </View>

              <View style={{ flex: 0.7 }}>
                <Text>
                  {ticker.displayName} {ticker.selected ? "*" : null}
                </Text>
                <Text>{ticker.ticker}</Text>
              </View>
              <View style={{ flex: 0.2 }}>
                <Text>{ticker.changePercent?.toFixed(2)}%</Text>
                <Text>
                  {ticker.lastPrice} {ticker.currency}
                </Text>
              </View>
              <Menu
                visible={visible === ticker.avanzaId}
                onDismiss={closeMenu}
                anchor={
                  <IconButton
                    icon="menu"
                    color={Colors.black}
                    size={20}
                    onPress={() => openMenu(ticker.avanzaId)}
                  />
                }
              >
                {Object.values(backendState.lists).map((list) => {
                  return (
                    <Menu.Item
                      key={list.id}
                      onPress={() => {
                        TickerAdd(ticker, list.id);
                        closeMenu();
                      }}
                      title={list.displayName}
                    />
                  );
                })}
              </Menu>
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
