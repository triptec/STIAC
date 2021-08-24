import React, { useContext, useEffect, useState } from "react";
import Lists from "../components/Lists";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BackendContext } from "../../Store";
import { ListScreen } from "./ListScreen";
const ListsStack = createNativeStackNavigator();
export function ListsScreen() {
  return <Lists />;
}

export function ListsStackScreen() {
  const [backendState] = useContext(BackendContext);

  return (
    <ListsStack.Navigator>
      <ListsStack.Screen
        options={{ headerTitle: "Lists" }}
        name={"Lists"}
        component={ListsScreen}
      />
      <ListsStack.Screen name={"List"} component={ListScreen} />
    </ListsStack.Navigator>
  );
}
