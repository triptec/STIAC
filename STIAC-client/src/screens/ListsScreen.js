import React, {useContext, useEffect, useState} from "react";
import Lists from "../components/Lists";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {BackendContext} from "../../Store";
import {ListScreen} from "./ListScreen";
import {Appbar, Menu} from 'react-native-paper';
import c from "../../../STIAC-common/constants";
import {ListNewScreen} from "./ListNewScreen";
import {useNavigation} from "@react-navigation/native";

const ListsStack = createNativeStackNavigator();

export function ListsScreen() {
  return <Lists/>;
}

function CustomNavigationBar(props) {
  const {navigation, back, route, options} = props;
  const {menu, headerTitle} = options;
  console.log()
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header statusBarHeight={0}>
      {back ? <Appbar.BackAction onPress={navigation.goBack}/> : null}
      <Appbar.Content title={headerTitle}/>
      {menu ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu}/>
          }>
          {
            menu.map((item) => {
              return (<Menu.Item onPress={() => {
                closeMenu();
                item.callback();
              }} title={item.title}/>)
            })
          }
        </Menu>
      ) : null}
    </Appbar.Header>
  );
}

export function ListsStackScreen() {
  const [backendState] = useContext(BackendContext);
  const navigation = useNavigation();

  return (
    <ListsStack.Navigator
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
      }}
    >
      <ListsStack.Screen
        options={{
          headerTitle: c.screens.LISTS, menu: [{
            title: 'New list', callback: () => {
              navigation.navigate(c.screens.LIST_NEW)
            }
          }]
        }}
        name={c.screens.LISTS}
        component={ListsScreen}
      />
      <ListsStack.Screen name={c.screens.LIST} component={ListScreen} options={({route}) => ({
        headerTitle: route.params.list.displayName,
      })}/>
      <ListsStack.Screen
        name={c.screens.LIST_NEW}
        component={ListNewScreen}
        options={{headerTitle: c.screens.LIST_NEW}}
      />
    </ListsStack.Navigator>
  );
}
