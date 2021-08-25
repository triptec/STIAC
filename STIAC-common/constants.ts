const STORAGE_PREFIX = 'my_gavle_';

const constants = {
    storage: {
        keys: {
            YAHOO_TICKERS: (yahooId) => `yahoo::tickers::${yahooId}`,
            AVANZA_TICKERS: (avanzaId) => `avanza::tickers::${avanzaId}`,
            USERS_TICKERS: (userId) => `users::tickers::${userId}`,
            LISTS_TICKERS: (listId) => `lists::tickers::${listId}`,
            LISTS: (listId) => `lists::${listId}`,
            TICKERS: (isin) => `tickers::${isin}`,
            USERS: (userId) => `users::${userId}`,
            USERS_LISTS: (userId) => `users::lists::${userId}`,
        }
    },
    screens: {
        SEARCH: 'Search',
        LISTS_STACK: 'ListsStack',
        LIST: 'List',
        LIST_NEW: 'New List',
        LISTS: 'Lists',
        TICKERS: 'Tickers',
        SETTINGS: 'Settings',
        DEBUG: 'Debug',
    },
    events: {
        LISTS_TICKERS_LIST: 'liststickers:list',
        LISTS_TICKERS_ADD: 'liststickers:add',
        LISTS_LIST: 'lists:list',
        TICKERS_LIST: 'tickers:list',
        TICKERS_ADD: 'tickers:add',
        TICKERS_UPDATE: 'tickers:update',
        TICKERS_SEARCH: 'tickers:search',
        LOGIN: 'login',
        CONNECTION: 'connection',
        DISCONNECT: 'disconnect',
        WELCOME: 'welcome',
    },
    actions: {
        LISTS_TICKERS_LIST: 'LISTS_TICKERS_LIST',
        LISTS_TICKERS_ADD: 'LISTS_TICKERS_ADD',
        LISTS_LIST: 'LISTS_LIST',
        TICKERS_LIST: 'TICKERS_LIST',
        TICKERS_ADD: 'TICKERS_ADD',
        TICKERS_UPDATE: 'TICKERS_UPDATE',
        STATE_RESET: 'STATE_RESET',
        STATE_SET: 'STATE_SET',
    }
};

export default constants;