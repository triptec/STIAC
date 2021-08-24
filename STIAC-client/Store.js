//import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useReducer, useEffect } from "react";

import { BackendStateReducer, initialBackendState } from "./Reducer";
import { RegisterCallbacks } from "./src/api/api";

const Store = ({ children }) => {
  const [backendState, backendDispatch] = useReducer(
    BackendStateReducer,
    initialBackendState
  );

  useEffect(() => {
    RegisterCallbacks({
      "ticker:list": (data) => {
        console.log("ticker:list", data);
        backendDispatch({ type: "SET_TICKERS", payload: data });
      },
      "ticker:add": (data) => {
        console.log("ticker:add", data);
        backendDispatch({ type: "ADD_TICKER", payload: data });
      },
      "ticker:update": (data) => {
        console.log("ticker:update", data);
        backendDispatch({ type: "UPDATE_TICKER", payload: data });
      },
    });
  }, []);

  /*
  useEffect(() => {
    AsyncStorage.getItem(constants.storage.STATE_KEY).then((stateJson) => {
      console.log("loaded state: ", stateJson);
      if (stateJson != null) {
        const savedState = JSON.parse(stateJson);
        persistentDispatch({
          type: "SET_STATE",
          payload: { ...savedState, dirty: false },
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!persistentState.dirty) return;
    console.debug("Persistent state dirty, save state", persistentState);
    AsyncStorage.setItem(
      constants.storage.STATE_KEY,
      JSON.stringify(persistentState)
    ).then(() => persistentDispatch({ type: "SET_DIRTY", payload: false }));
  }, [persistentState]);
  */

  return (
    <BackendContext.Provider value={[backendState, backendDispatch]}>
      {children}
    </BackendContext.Provider>
  );
};
const BackendContext = createContext(initialBackendState);
export { BackendContext, initialBackendState };
export default Store;
