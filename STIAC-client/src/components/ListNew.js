import Autocomplete from "react-native-autocomplete-input";
import React, { useContext, useEffect, useState } from "react";
import * as Animatable from "react-native-animatable";
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
import { Button, TextInput } from 'react-native-paper';
import { BackendContext } from "../../Store";

const ListNew = () => {
  const [backendState, backendDispatch] = useContext(BackendContext);
  const [text, setText] = React.useState('');
  return (
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          label="List name"
          value={text}
          onChangeText={text => setText(text)}
        />
        <Button icon="plus" mode="contained" onPress={() => console.log('Pressed')}>
          Create
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

});

export default ListNew;
