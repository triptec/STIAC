import { io } from "socket.io-client";
import Constants from "expo-constants";
const socket = io("http://192.168.88.205:3000", { transports: ["websocket"] });
let loggedin = false;
socket.on("welcome", (args) => {
  console.log(args);
  socket.emit("login", { id: Constants.installationId }, (res) => {
    loggedin = true;
  });
});

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

async function TickerAdd(ticker) {
  const promise = new Promise((resolve, reject) => {
    socket.emit("ticker:add", ticker, (res) => {
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

export { TickerSearch, TickerAdd, TickerList };
