"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const Avanza = require("avanza");
const StockSocket = require("stocksocket");
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
const saddAsync = promisify(redisClient.sadd).bind(redisClient);
const smembersAsync = promisify(redisClient.smembers).bind(redisClient);
const uuidv4_1 = require("uuidv4");
const models_1 = require("../STIAC-common/models/models");
redisClient.on("error", function (error) {
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
}
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
                const avanzaTicker = models_1.AvanzaTicker.fromAvanza(value);
                const ticker = models_1.Ticker.fromAvanzaTicker(avanzaTicker);
                tickers.push(ticker);
                console.log(value);
            }
        }
        callback(tickers);
    }
    catch (e) {
        console.error("search");
        console.error(e);
        if (retry) {
            console.error("Already retried, stopping");
        }
        else {
            await authenticate();
            await tickerSearch(payload, callback, 1);
        }
    }
}
const avanzaTickerQuotes = new Set();
const yahooTickerQuotes = new Set();
async function subscribeTicker(ticker) {
    if (avanzaTickerQuotes.has(ticker.isin))
        return;
    if (yahooTickerQuotes.has(ticker.ticker))
        return;
    if (ticker.countryCode === "US") {
        avanzaTickerQuotes.add(ticker.ticker);
        StockSocket.addTicker(ticker.ticker, async (quote) => {
            console.log("Received quote:", quote);
            const isin = await getAsync(`yahoo:tickers:${quote.id}`);
            await hsetAsync(`tickers:${isin}`, "lastPrice", quote.price, "lastUpdated", quote.time, "changePercent", quote.changePercent);
            const ticker = (await hgetallAsync(`tickers:${isin}`));
            server.to(isin).emit("ticker:update", ticker);
        });
    }
    else {
        avanzaTickerQuotes.add(ticker.isin);
        await avanza.subscribe(Avanza.QUOTES, ticker.avanzaId, async (quote) => {
            console.log("Received quote:", quote);
            const isin = await getAsync(`avanza:tickers:${quote.orderbookId}`);
            await hsetAsync(`tickers:${isin}`, "lastPrice", quote.lastPrice, "lastUpdated", quote.lastUpdated, "changePercent", quote.changePercent);
            const ticker = (await hgetallAsync(`tickers:${isin}`));
            server.to(isin).emit("ticker:update", ticker);
        });
    }
}
async function tickerAdd(ticker_, listId_, callback) {
    console.log("tickerAdd", ticker_, listId_);
    if (!ticker_ || !listId_)
        return;
    const socket = this;
    const userId = socket.userId;
    console.log(userId);
    const isin = await getAsync(`avanza:tickers:${ticker_.avanzaId}`);
    console.log(isin);
    let ticker;
    if (isin) {
        ticker = (await hgetallAsync(`tickers:${isin}`));
    }
    else {
        const instrument = (await avanza.getInstrument(ticker_.instrumentType, ticker_.avanzaId));
        ticker = models_1.Ticker.fromAvanzaInstrument(instrument, ticker_.instrumentType);
        await hsetAsync(`tickers:${ticker.isin}`, Object.entries(ticker).flat());
        await setAsync(`avanza:tickers:${ticker.avanzaId}`, ticker.isin);
        await setAsync(`yahoo:tickers:${ticker.ticker}`, ticker.isin);
    }
    await saddAsync(`users:tickers:${userId}`, ticker.isin);
    users[userId].tickers[ticker.isin] = ticker;
    console.log(users[userId].tickers);
    await saddAsync(`lists:tickers:${listId_}`, ticker.isin);
    users[userId].listsTickers[listId_].add(ticker.isin);
    console.log(users[userId].listsTickers);
    socket.join(ticker.isin);
    await subscribeTicker(ticker);
    socket.emit("ticker:add", ticker);
    socket.emit("liststickers:add", { listId: listId_, isin: ticker.isin });
    callback({ status: "ok" });
}
async function tickerList(payload, callback) {
    const socket = this;
    const userId = Object.keys(users).find((key) => users[key].socket === socket);
    console.log(userId);
    console.log(users[userId].tickers);
    socket.emit("ticker:set", users[userId].tickers);
    callback(users[userId].tickers);
}
const users = {};
async function login(payload, callback) {
    const socket = this;
    console.log(payload);
    let user = await hgetallAsync(`users:${payload.id}`);
    if (!user) {
        user = { id: payload.id };
        await hsetAsync(`users:${payload.id}`, Object.entries(user).flat());
    }
    if (!users[user.id]) {
        users[user.id] = user;
    }
    let userLists = await smembersAsync(`users:lists:${user.id}`);
    if (!userLists || userLists.length === 0) {
        const list = {
            id: uuidv4_1.uuid(),
            displayName: "My list",
            ownerId: user.id,
        };
        await hsetAsync(`lists:${list.id}`, Object.entries(list).flat());
        await saddAsync(`users:lists:${user.id}`, list.id);
        userLists = [list.id];
    }
    let batch = redisClient.batch();
    for (let lid of userLists) {
        batch.hgetall(`lists:${lid}`);
    }
    const prom = new Promise((resolve, reject) => {
        batch.exec((err, replies) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(replies);
            }
        });
    });
    const lists = (await prom);
    user.lists = lists.reduce((acc, list) => {
        acc[list.id.toString()] = list;
        return acc;
    }, {});
    console.log("lists", user.lists);
    batch = redisClient.batch();
    for (let lid of userLists) {
        batch.smembers(`lists:tickers:${lid}`);
    }
    const prom1 = new Promise((resolve, reject) => {
        batch.exec((err, replies) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(replies);
            }
        });
    });
    const listsTickers = (await prom1);
    user.listsTickers = listsTickers.reduce((acc, list, index) => {
        acc[userLists[index]] = new Set(list);
        return acc;
    }, {});
    console.log("listsTickers", user.listsTickers);
    let tickerIds = await smembersAsync(`users:tickers:${user.id}`);
    console.log("tickerIds", tickerIds);
    if (tickerIds) {
        const batch = redisClient.batch();
        for (let tid of tickerIds) {
            batch.hgetall(`tickers:${tid}`);
        }
        const prom = new Promise((resolve, reject) => {
            batch.exec((err, replies) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(replies);
                }
            });
        });
        const tickers = (await prom);
        user.tickers = tickers.reduce((acc, ticker) => {
            acc[ticker.isin.toString()] = ticker;
            return acc;
        }, {});
        console.log("tickers", user.tickers);
    }
    if (!user.tickers)
        user.tickers = {};
    socket.userId = user.id;
    users[user.id] = { ...users[user.id], socket: socket };
    socket.on("ticker:search", tickerSearch);
    socket.on("ticker:add", tickerAdd);
    socket.on("ticker:set", tickerList);
    socket.emit("list:set", user.lists);
    socket.emit("ticker:set", user.tickers);
    socket.emit("liststickers:set", Object.keys(user.listsTickers).reduce((acc, item) => {
        acc[item] = [...user.listsTickers[item]];
        return acc;
    }, {}));
    for (let ticker of Object.values(user.tickers)) {
        await subscribeTicker(ticker);
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
//# sourceMappingURL=index.js.map