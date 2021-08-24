import Autocomplete from "react-native-autocomplete-input";
import React, { useContext, useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
import { useTheme, Card, Title, Paragraph, List } from "react-native-paper";
import _sortBy from "lodash.sortby";
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
import { useNavigation } from "@react-navigation/native";

const Lists = () => {
  const [backendState, backendDispatch] = useContext(BackendContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView>
        {_sortBy(Object.values(backendState.lists), ["id"]).map((list) => {
          return (
            <Card
              key={list.id}
              onPress={() =>
                navigation.navigate("List", {
                  list: list,
                })
              }
            >
              <Card.Content style={{ flexDirection: "row" }}>
                <View style={{ flex: 0.9 }}>
                  <Title>{list.displayName}</Title>
                  <Paragraph>{list.id}</Paragraph>
                </View>
                <View
                  style={{
                    flex: 0.1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <List.Icon icon="arrow-right" />
                </View>
              </Card.Content>
            </Card>
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

export default Lists;
