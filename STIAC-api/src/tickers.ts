import {AvanzaInstrument, AvanzaQuote, AvanzaTicker, Ticker, YahooQuote} from "../../STIAC-common/models/models";
import {authenticate, Avanza, avanza} from "./avanzaApi";
import c from "../../STIAC-common/constants";
import {getAsync, hgetallAsync, hsetAsync, saddAsync, setAsync} from "./db";
const StockSocket = require("stocksocket");
const avanzaTickerQuotes = new Set();
const yahooTickerQuotes = new Set();
import {server} from "./server";

export async function searchTickers(query, retry_) {
    let retry = retry_ === null ? 3 : retry_;
    const socket = this;
    const userId = socket.userId;
    console.log(userId);

    try {
        const res = await avanza.search(query);
        if (res.totalNumberOfHits === 0) {
            return [];
        }
        const tickers = [];
        for (const hit of res.hits) {
            const instrumentType = hit.instrumentType;
            for (const value of hit.topHits || []) {
                value["instrumentType"] = instrumentType;
                const avanzaTicker = AvanzaTicker.fromAvanza(value);
                const ticker = Ticker.fromAvanzaTicker(avanzaTicker);
                tickers.push(ticker);
                console.log(value);
            }
        }
        return tickers;
    } catch (e) {
        console.error("search");
        console.error(e);
        if (retry <= 0) {
            console.error("Already retried, stopping");
        } else {
            await authenticate();
            return await searchTickers(query, --retry);
        }
    }
}

export async function addTickerToList(ticker_: Ticker, listId_: any, userId: any) {
    console.log("addTickerToList", ticker_, listId_);
    if (!ticker_ || !listId_) return;
    console.log(userId);
    const isin = await getAsync(c.storage.keys.AVANZA_TICKERS(ticker_.avanzaId));
    console.log(isin);
    let ticker;
    if (isin) {
        ticker = (await hgetallAsync(c.storage.keys.TICKERS(isin))) as Ticker;
    } else {
        const instrument = (await avanza.getInstrument(
            ticker_.instrumentType,
            ticker_.avanzaId
        )) as AvanzaInstrument;
        ticker = Ticker.fromAvanzaInstrument(instrument, ticker_.instrumentType);
        await hsetAsync(c.storage.keys.TICKERS(ticker.isin), Object.entries(ticker).flat());
        await setAsync(c.storage.keys.AVANZA_TICKERS(ticker.avanzaId), ticker.isin);
        await setAsync(c.storage.keys.YAHOO_TICKERS(ticker.ticker), ticker.isin);
    }
    await saddAsync(c.storage.keys.USERS_TICKERS(userId), ticker.isin);
    await saddAsync(c.storage.keys.LISTS_TICKERS(listId_), ticker.isin);
    return ticker;
}

export async function subscribeTicker(ticker: Ticker, retry_) {
    let retry = retry_ === null ? 3 : retry_;
    if (avanzaTickerQuotes.has(ticker.isin)) return;
    if (yahooTickerQuotes.has(ticker.ticker)) return;
    if (ticker.countryCode === "US") {
        StockSocket.addTicker(ticker.ticker, async (quote: YahooQuote) => {
            console.log("Received quote:", quote);
            const isin = await getAsync(c.storage.keys.YAHOO_TICKERS(quote.id));
            await hsetAsync(
                c.storage.keys.TICKERS(isin),
                "lastPrice",
                quote.price,
                "lastUpdated",
                quote.time,
                "changePercent",
                quote.changePercent
            );
            const ticker = (await hgetallAsync(c.storage.keys.TICKERS(isin))) as Ticker;
            server.to(isin).emit(c.events.TICKERS_UPDATE, ticker);
        });
        avanzaTickerQuotes.add(ticker.ticker);
    } else {
        try {
            await avanza.subscribe(
            Avanza.QUOTES,
            ticker.avanzaId,
            async (quote: AvanzaQuote) => {
                console.log("Received quote:", quote);
                const isin = await getAsync(c.storage.keys.AVANZA_TICKERS(quote.orderbookId));
                await hsetAsync(
                    c.storage.keys.TICKERS(isin),
                    "lastPrice",
                    quote.lastPrice,
                    "lastUpdated",
                    quote.lastUpdated,
                    "changePercent",
                    quote.changePercent
                );
                const ticker = (await hgetallAsync(c.storage.keys.TICKERS(isin))) as Ticker;
                server.to(isin).emit(c.events.TICKERS_UPDATE, ticker);
            }
        );
        } catch (e) {
            console.error("subscribe");
            console.error(e);
            if (retry <= 0) {
                console.error("Already retried, stopping");
            } else {
                await authenticate();
                return await subscribeTicker(ticker, --retry);
            }
        }
        avanzaTickerQuotes.add(ticker.isin);
    }
}