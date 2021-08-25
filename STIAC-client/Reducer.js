import c from '../STIAC-common/constants';

const initialBackendState = {
  tickers: {},
  lists: {},
  listsTickers: {},
};

const BackendStateReducer = (state, action) => {
  console.debug("backend", state, action);
  switch (action.type) {
    case c.actions.STATE_RESET:
      return initialBackendState;
    case c.actions.STATE_SET:
      return {
        ...state,
        ...action.payload,
      };
    case c.actions.LISTS_LIST:
      return {
        ...state,
        lists: action.payload,
      };
    case c.actions.LISTS_TICKERS_LIST:
      return {
        ...state,
        listsTickers: action.payload,
      };
    case c.actions.LISTS_TICKERS_ADD:
      return {
        ...state,
        listsTickers: {
          ...state.listsTickers,
          [action.payload.listId]: [...new Set([
            ...state.listsTickers[action.payload.listId],
            action.payload.isin,
          ])],
        },
      };

    case c.actions.TICKERS_LIST:
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
    case c.actions.TICKERS_ADD:
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
    case c.actions.TICKERS_UPDATE:
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
