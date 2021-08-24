const initialBackendState = {
  tickers: {},
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
    case "SET_TICKERS":
      return {
        ...state,
        tickers: action.payload,
      };
    case "ADD_TICKER":
      return {
        ...state,
        tickers: { ...state.tickers, [action.payload.isin]: action.payload },
      };
    case "UPDATE_TICKER":
      return {
        ...state,
        tickers: { ...state.tickers, [action.payload.isin]: { ...state.tickers[action.payload.isin], ['lastPrice']: action.payload.lastPrice} },
      };
    default:
      return state;
  }
};

export { initialBackendState, BackendStateReducer };
