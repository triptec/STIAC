import { io } from "socket.io-client";
import Constants from "expo-constants";
import c from "../../../STIAC-common/constants"
console.log(process.env.BASE_URL);
const socket = io(process.env.BASE_URL, { transports: ["websocket"] });
let loggedin = false;
socket.on(c.events.WELCOME, (args) => {
  console.log(args);
  socket.emit(c.events.LOGIN, { id: Constants.installationId }, (res) => {
    loggedin = true;
  });
});

async function RegisterCallbacks(callbacks) {
  for(const event in callbacks) {
    if (typeof callbacks[event] === 'function') {
      socket.on(event, callbacks[event]);
    } else if(Array.isArray(callbacks[event])){
      callbacks[event].forEach(callback => {
        if (typeof callback === 'function') {
          socket.on(event, callback);
        }
      });
    }
  }
}

async function TickerSearch(query) {
  const promise = new Promise((resolve, reject) => {
    socket.emit(c.events.TICKERS_SEARCH, { query: query }, (res) => {
      if ("error" in res) {
        reject("error");
      } else {
        resolve(res);
      }
    });
  });
  return promise;
}

async function TickerAdd(ticker, listId) {
  console.log("tickerAdd", ticker, listId);
  const promise = new Promise((resolve, reject) => {
    socket.emit(c.events.TICKERS_ADD, ticker, listId, (res) => {
      if ("error" in res) {
        reject("error");
      } else {
        resolve(res);
      }
    });
  });
  return promise;
}

async function TickerList() {
  const promise = new Promise((resolve, reject) => {
    socket.emit(c.events.TICKERS_LIST, null, (res) => {
      if ("error" in res) {
        reject("error");
      } else {
        resolve(res);
      }
    });
  });
  return promise;
}

export { RegisterCallbacks, TickerSearch, TickerAdd, TickerList };
