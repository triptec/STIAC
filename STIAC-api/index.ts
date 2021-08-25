const dotenv = require("dotenv");
dotenv.config();
import {server} from "./src/server";
import {Ticker} from "../STIAC-common/models/models";
import c from "../STIAC-common/constants";
import {getOrCreateUser, getUserLists, getUserTickers} from "./src/users";
import {getListsTickers} from "./src/lists";
import {subscribeTicker, addTickerToList, searchTickers} from "./src/tickers";

const users = {};

async function tickerSearch(payload, callback) {
    const tickers = await searchTickers(payload.query, null);
    callback(tickers);
}
async function tickerList(payload, callback) {
    const socket = this;
    const userId = socket.userId
    console.log(userId);

    users[userId].tickers = await getUserTickers(userId)

    console.log(users[userId].tickers);
    socket.emit(c.events.TICKERS_LIST, users[userId].tickers);
    callback(users[userId].tickers);
}

async function tickerAdd(ticker_: Ticker, listId_: any, callback) {
    const socket = this;
    const userId = socket.userId;
    const ticker = await addTickerToList(ticker_, listId_, userId)
    users[userId].tickers[ticker.isin] = ticker;
    console.log(users[userId].tickers);

    users[userId].listsTickers[listId_].add(ticker.isin);
    console.log(users[userId].listsTickers);

    socket.join(ticker.isin);
    await subscribeTicker(ticker, null);
    socket.emit(c.events.TICKERS_ADD, ticker);
    socket.emit(c.events.LISTS_TICKERS_ADD, {listId: listId_, isin: ticker.isin});
    callback({status: "ok"});
}

async function login(payload, callback) {
    const socket = this;
    console.log(payload);
    const user = await getOrCreateUser(payload.id);

    if (!users[user.id]) {
        users[user.id] = user;
    }

    user.lists = await getUserLists(user.id);
    console.log("lists", user.lists);


    user.listsTickers = await getListsTickers(Object.keys(user.lists))
    console.log("listsTickers", user.listsTickers);

    user.tickers = await getUserTickers(user.id) || {};
    console.log("tickers", user.tickers);


    socket.userId = user.id;
    users[user.id] = {...users[user.id], socket: socket};

    socket.on(c.events.TICKERS_SEARCH, tickerSearch);
    socket.on(c.events.TICKERS_ADD, tickerAdd);
    socket.on(c.events.TICKERS_LIST, tickerList);

    socket.emit(c.events.LISTS_LIST, user.lists);
    socket.emit(c.events.TICKERS_LIST, user.tickers);
    socket.emit(
        c.events.LISTS_TICKERS_LIST,
        /* workaround, socket.io can't serialize Set() */
        Object.keys(user.listsTickers).reduce((acc, item) => {
            acc[item] = [...user.listsTickers[item]];
            return acc;
        }, {})
    );

    for (let ticker of Object.values(user.tickers) as Ticker[]) {
        await subscribeTicker(ticker, null);
        socket.join(ticker.isin);
    }

    callback({status: "ok"});
}

server.on(c.events.CONNECTION, function (socket) {
    console.log("user connected");
    socket.emit(c.events.WELCOME, "welcome man");
    socket.on(c.events.DISCONNECT, () => console.log("user disconnected"));
    socket.on(c.events.LOGIN, login);
});
