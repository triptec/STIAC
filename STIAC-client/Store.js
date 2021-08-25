//import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useReducer, useEffect } from "react";

import { BackendStateReducer, initialBackendState } from "./Reducer";
import { RegisterCallbacks } from "./src/api/api";
import {
  AvanzaInstrument,
  AvanzaQuote,
  AvanzaTicker,
  Ticker,
  YahooQuote,
} from "../STIAC-common/models/models";

import c from "../STIAC-common/constants"
const Store = ({ children }) => {
  const [backendState, backendDispatch] = useReducer(
    BackendStateReducer,
    initialBackendState
  );

  useEffect(() => {
    RegisterCallbacks({
      [c.events.LISTS_TICKERS_LIST]: (data) => {
        console.log(c.events.LISTS_TICKERS_LIST, data);
        backendDispatch({ type: c.actions.LISTS_TICKERS_LIST, payload: data });
      },
      [c.events.LISTS_TICKERS_ADD]: (data) => {
        console.log(c.events.LISTS_TICKERS_ADD, data);
        backendDispatch({ type: c.actions.LISTS_TICKERS_ADD, payload: data });
      },
      [c.events.LISTS_LIST]: (data) => {
        console.log(c.events.LISTS_LIST, data);
        backendDispatch({ type: c.actions.LISTS_LIST, payload: data });
      },
      [c.events.TICKERS_LIST]: (data) => {
        console.log(c.events.TICKERS_LIST, data);
        backendDispatch({ type: c.actions.TICKERS_LIST, payload: data });
      },
      [c.events.TICKERS_ADD]: (data) => {
        console.log(c.events.TICKERS_ADD, data);
        backendDispatch({ type: c.actions.TICKERS_ADD, payload: data });
      },
      [c.events.TICKERS_UPDATE]: (data) => {
        console.log(c.events.TICKERS_UPDATE, data);
        backendDispatch({ type: c.actions.TICKERS_UPDATE, payload: data });
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
