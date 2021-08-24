import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React, { useContext } from "react";
import { TickerSearchScreen } from "./TickerSearchScreen";
import { TickersScreen } from "./TickersScreen";
import { ListsScreen, ListsStackScreen } from "./ListsScreen";
const Tab = createMaterialBottomTabNavigator();

export function AppScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Search"
        component={TickerSearchScreen}
        options={{ tabBarIcon: "home", title: "Search" }}
      />
      <Tab.Screen
        name="ListsStack"
        component={ListsStackScreen}
        options={{ tabBarIcon: "menu", title: "Lists" }}
      />
      <Tab.Screen
        name="Tickers"
        component={TickersScreen}
        options={{ tabBarIcon: "menu", title: "Tickers" }}
      />
    </Tab.Navigator>
  );
}
