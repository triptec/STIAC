const dotenv = require("dotenv");
const Avanza = require("avanza");
const io = require("socket.io")();
const redis = require("redis");

const avanza = new Avanza();
dotenv.config();

const redisClient = redis.createClient();
const { promisify } = require("util");
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const hgetAsync = promisify(redisClient.hget).bind(redisClient);
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);
const lpushAsync = promisify(redisClient.lpush).bind(redisClient);
const lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
import { uuid } from 'uuidv4';
import {AvanzaInstrument, AvanzaQuote, AvanzaTicker, Ticker} from "./src/models";

redisClient.on("error", function(error) {
  console.error(error);
});

const credentials = {
  username: process.env.AVANZA_USERNAME,
  password: process.env.AVANZA_PASSWORD,
  totpSecret: process.env.AVANZA_TOTP_SECRET,
};

console.log(credentials);
async function authenticate() {
  return avanza
      .authenticate(credentials)
      .then(() => console.log("authenticated"))
      .catch((e) => console.log(e));
};

authenticate().then(console.log);

const server = io.listen(3000);

async function tickerSearch(payload, callback, retry) {
  const socket = this;
  const userId = Object.keys(users).find((key) => users[key].socket === socket);
  const ret = [];
  console.log(userId);

  try {
    const res = await avanza.search(payload.query);
    if (res.totalNumberOfHits === 0) {
      callback([]);
      return;
    }
    const tickers = [];
    for (const hit of res.hits) {
      const instrumentType = hit.instrumentType;
      for (const value of hit.topHits || []) {
        value["instrumentType"] = instrumentType;
        const avanzaTicker = AvanzaTicker.fromAvanza(value)
        const ticker = Ticker.fromAvanzaTicker(avanzaTicker);
        tickers.push(ticker);
        console.log(value)
      }
    }
    callback(tickers);
  } catch (e) {
    console.error("search")
    console.error(e)
    if(retry) {
      console.error("Already retried, stopping");
    } else {
      await authenticate();
      await tickerSearch(payload, callback, 1);
    }
  }
}
const tickerQuotes = new Set();
async function subscribeTicker(ticker) {
  if (tickerQuotes.has(ticker.isin)) return;
  tickerQuotes.add(ticker.isin);
  await avanza.subscribe(Avanza.QUOTES, ticker.avanzaId, async (quote: AvanzaQuote) => {
    console.log("Received quote:", quote);
    const isin = await getAsync(`avanza-tickers-${quote.orderbookId}`);
    await hsetAsync(`tickers-${isin}`, 'lastPrice', quote.lastPrice, 'lastUpdated', quote.lastUpdated)
    const ticker = await hgetallAsync(`tickers-${isin}`) as Ticker;
    server.to(isin).emit('ticker:update', ticker)
  });
}

async function tickerAdd(ticker_:Ticker, callback) {
  console.log("tickerAdd", ticker_);
  const socket = this;
  const userId = socket.userId;
  console.log(userId);
  const isin = await getAsync(`avanza-tickers-${ticker_.avanzaId}`)
  console.log(isin);
  let ticker;
  if(isin) {
    ticker = await hgetallAsync(`tickers-${isin}`) as Ticker;
  } else {
    const instrument = await avanza.getInstrument(ticker_.instrumentType, ticker_.avanzaId) as AvanzaInstrument;
    ticker = Ticker.fromAvanzaInstrument(instrument, ticker_.instrumentType);
    await hsetAsync(`tickers-${ticker.isin}`, Object.entries(ticker).flat());
    await setAsync(`avanza-tickers-${ticker.avanzaId}`, ticker.isin);
  }
  await lpushAsync(`users-tickers-${userId}`, ticker.isin);
  users[userId].tickers[ticker.isin] = ticker;
  console.log(users[userId].tickers);
  socket.join(ticker.isin);
  await subscribeTicker(ticker);
  socket.emit("ticker:add", ticker);
  callback({ status: "ok" });
}

async function tickerList(payload, callback) {
  const socket = this;
  const userId = Object.keys(users).find((key) => users[key].socket === socket);
  console.log(userId);

  console.log(users[userId].tickers);
  socket.emit("ticker:list", users[userId].tickers);
  callback(users[userId].tickers);
}

const users = {};
async function login(payload, callback) {
  const socket = this;
  console.log(payload);
  let user = await hgetallAsync(`users-${payload.id}`);
  if(!user) {
    user = {id: payload.id}
    await hsetAsync(`users-${payload.id}`, Object.entries(user).flat())
  }
  if (!users[user.id]) {
    users[user.id] = user;
  }
  let userLists = await lrangeAsync(`user-lists-${user.id}`, 0 , -1);
  if(!userLists || userLists.length === 0) {
    const list = {
      id: uuid(),
      displayName: "My list",
      ownerId: user.id,
    }
    await hsetAsync(`lists-${list.id}`, Object.entries(list).flat());
    await lpushAsync(`users-lists-${user.id}`, list.id);
    userLists = [list.id];
  }
  const batch = redisClient.batch();
  for(let lid of userLists) {
    batch.hgetall(`lists-${lid}`);
  }
  const prom = new Promise((resolve, reject) => {
    batch.exec((err, replies)=>{
      if (err) {
        reject(err);
      } else {
        resolve(replies)
      }
    })
  });

  const lists = await prom;
  user.lists = lists;

  let tickerIds = await lrangeAsync(`users-tickers-${user.id}`, 0 , -1);
  console.log('tickerIds', tickerIds);
  if (tickerIds) {
    const batch = redisClient.batch();
    for(let tid of tickerIds) {
      batch.hgetall(`tickers-${tid}`);
    }
    const prom = new Promise((resolve, reject) => {
      batch.exec((err, replies)=>{
        if (err) {
          reject(err);
        } else {
          resolve(replies)
        }
      })
    });
    const tickers = await prom as Ticker[];
    console.log('tickers', tickers);
    user.tickers = tickers.reduce((acc:any, ticker: Ticker) => {
      acc[ticker.isin.toString()] = ticker
      return acc;
    }, {});
  }
  if(!user.tickers) user.tickers = {};
  socket.userId = user.id;
  users[user.id] = { ...users[user.id], socket: socket };

  socket.on("ticker:search", tickerSearch);
  socket.on("ticker:add", tickerAdd);
  socket.on("ticker:list", tickerList);


  socket.emit('ticker:list', user.tickers);
  for( let ticker of Object.values(user.tickers) as Ticker[]) {
    await subscribeTicker(ticker)
    socket.join(ticker.isin);
  }

  callback({ status: "ok" });
}

server.on("connection", function (socket) {
  console.log("user connected");
  socket.emit("welcome", "welcome man");
  socket.on("disconnect", () => console.log("user disconnected"));
  socket.on("login", login);
});
