const dotenv = require("dotenv");
const Avanza = require("avanza");
const io = require("socket.io")();

const avanza = new Avanza();
dotenv.config();

const credentials = {
  username: process.env.AVANZA_USERNAME,
  password: process.env.AVANZA_PASSWORD,
  totpSecret: process.env.AVANZA_TOTP_SECRET,
};

console.log(credentials);
avanza
  .authenticate(credentials)
  .then(() => console.log("authenticated"))
  .catch((e) => console.log(e));

const server = io.listen(3000);

async function tickerSearch(payload, callback) {
  const socket = this;
  const userId = Object.keys(users).find((key) => users[key].socket === socket);
  console.log(userId);

  const res = await avanza.search(payload.query);
  if (res.totalNumberOfHits === 0) {
    callback(res);
    return;
  }

  for (const hit of res.hits) {
    for (const value of hit.topHits || []) {
      if (
        Object.keys(users[userId].tickers).indexOf(value.id.toString()) > -1
      ) {
        value["selected"] = true;
        console.log(value);
      }
    }
  }
  callback(res);
}

async function tickerAdd(payload, callback) {
  console.log("tickerAdd");
  const socket = this;
  const userId = Object.keys(users).find((key) => users[key].socket === socket);
  console.log(userId);

  users[userId].tickers[payload.id] = payload;
  console.log(users[userId].tickers);
  callback({ status: "ok" });
}

async function tickerList(payload, callback) {
  const socket = this;
  const userId = Object.keys(users).find((key) => users[key].socket === socket);
  console.log(userId);

  console.log(users[userId].tickers);
  callback(users[userId].tickers);
}

const users = {};
async function login(payload, callback) {
  const socket = this;
  console.log(payload);
  if (!users[payload.id]) users[payload.id] = { tickers: {} };
  users[payload.id] = { ...users[payload.id], socket: socket };
  callback({ status: "ok" });
}

server.on("connection", function (socket) {
  console.log("user connected");
  socket.emit("welcome", "welcome man");
  socket.on("disconnect", () => console.log("user disconnected"));
  socket.on("login", login);
  socket.on("ticker:search", tickerSearch);
  socket.on("ticker:add", tickerAdd);
  socket.on("ticker:list", tickerList);
});
