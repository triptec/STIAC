import { io } from "socket.io-client";
import Constants from "expo-constants";
console.log(process.env.BASE_URL);
const socket = io(process.env.BASE_URL, { transports: ["websocket"] });
let loggedin = false;
socket.on("welcome", (args) => {
  console.log(args);
  socket.emit("login", { id: Constants.installationId }, (res) => {
    loggedin = true;
  });
});

async function RegisterCallbacks(callbacks) {
  socket.on("liststickers:set", callbacks["liststickers:set"]);
  socket.on("liststickers:add", callbacks["liststickers:add"]);
  socket.on("list:set", callbacks["list:set"]);
  socket.on("ticker:set", callbacks["ticker:set"]);
  socket.on("ticker:add", callbacks["ticker:add"]);
  socket.on("ticker:update", callbacks["ticker:update"]);
}

async function TickerSearch(query) {
  const promise = new Promise((resolve, reject) => {
    socket.emit("ticker:search", { query: query }, (res) => {
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
    socket.emit("ticker:add", ticker, listId, (res) => {
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
    socket.emit("ticker:list", null, (res) => {
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
