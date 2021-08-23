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
    case "ADD_TICKER":
      return {
        ...state,
        tickers: { ...state.tickers, [action.payload.id]: action.payload },
      };
    default:
      return state;
  }
};

export { initialBackendState, BackendStateReducer };
