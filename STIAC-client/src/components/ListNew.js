import Autocomplete from "react-native-autocomplete-input";
import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
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
import { Button, TextInput } from "react-native-paper";
import { BackendContext } from "../../Store";
import c from "../../../STIAC-common/constants";
import { useNavigation } from "@react-navigation/native";
import { CreateList } from "../api/api";

const createListReducer = (state, action) => {
  switch (action.type) {
    case "ACTION_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "ACTION_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "ACTION_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const createListHook = (initialList, initialData) => {
  const [list, setList] = useState(initialList);
  const [state, dispatch] = useReducer(createListReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    console.log("list", list);
    if (!list) return;
    let didCancel = false;
    const createList = async () => {
      dispatch({ type: "ACTION_INIT" });
      try {
        const result = await CreateList(list);
        if (!didCancel) {
          dispatch({ type: "ACTION_SUCCESS", payload: result });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "ACTION_FAILURE" });
        }
      }
    };

    createList();

    return () => {
      didCancel = true;
    };
  }, [list]);

  return [state, setList];
};

const ListNew = () => {
  const [backendState, backendDispatch] = useContext(BackendContext);
  const [text, setText] = React.useState("");
  const navigation = useNavigation();
  const [{ data, isLoading, isError }, doCreateList] = createListHook(
    null,
    null
  );
  const [disabled, setDisabled] = React.useState(isLoading);

  useEffect(() => {
    if (data !== null) {
      navigation.navigate(c.screens.LISTS);
    }
  }, [data]);

  const create = useCallback(() => {
    if (!(text.length > 0)) return;
    doCreateList({ displayName: text });
  }, [text]);
  return (
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          label="List name"
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <Button
          icon="plus"
          mode="contained"
          onPress={() => create()}
          disabled={disabled}
        >
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
