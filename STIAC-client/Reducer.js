const initialBackendState = {
  tickers: {},
  lists: {},
  listsTickers: {},
};

const BackendStateReducer = (state, action) => {
  console.debug("backend", state, action);
  switch (action.type) {
    case "RESET_STATE":
      return initialBackendState;
    case "SET_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_LISTS":
      return {
        ...state,
        lists: action.payload,
      };
    case "SET_LISTS_TICKERS":
      return {
        ...state,
        listsTickers: action.payload,
      };
    case "ADD_LISTS_TICKERS":
      return {
        ...state,
        listsTickers: {
          ...state.listsTickers,
          [action.payload.listId]: [
            ...state.listsTickers[action.payload.listId],
            action.payload.isin,
          ],
        },
      };

    case "SET_TICKERS":
      return {
        ...state,
        tickers: Object.keys(action.payload).reduce((acc, key) => {
          acc[key] = {
            ...action.payload[key],
            ["lastPrice"]: parseFloat(action.payload[key].lastPrice),
            ["changePercent"]: parseFloat(action.payload[key].changePercent),
          };
          return acc;
        }, {}),
      };
    case "ADD_TICKER":
      return {
        ...state,
        tickers: {
          ...state.tickers,
          [action.payload.isin]: {
            ...action.payload,
            ["lastPrice"]: parseFloat(action.payload.lastPrice),
            ["changePercent"]: parseFloat(action.payload.changePercent),
          },
        },
      };
    case "UPDATE_TICKER":
      return {
        ...state,
        tickers: {
          ...state.tickers,
          [action.payload.isin]: {
            ...state.tickers[action.payload.isin],
            ["lastPrice"]: parseFloat(action.payload.lastPrice),
            ["changePercent"]: parseFloat(action.payload.changePercent),
          },
        },
      };
    default:
      return state;
  }
};

export { initialBackendState, BackendStateReducer };
