"use strict";
exports.__esModule = true;
exports.AvanzaInstrument = exports.AvanzaQuote = exports.YahooQuote = exports.AvanzaTicker = exports.Ticker = void 0;
var Ticker = /** @class */ (function () {
    function Ticker(isin, yahooId, avanzaId, displayName, lastPrice, currency, countryCode, instrumentType, ticker, changePercent) {
        this.isin = isin;
        this.yahooId = yahooId;
        this.avanzaId = avanzaId;
        this.displayName = displayName;
        this.lastPrice = lastPrice;
        this.currency = currency;
        this.countryCode = countryCode;
        this.instrumentType = instrumentType;
        this.ticker = ticker;
        this.changePercent = changePercent;
    }
    Ticker.fromAvanzaTicker = function (avanzaTicker) {
        var ticker = new Ticker(null, null, avanzaTicker.id, avanzaTicker.name, avanzaTicker.lastPrice, avanzaTicker.currency, avanzaTicker.flagCode, avanzaTicker.instrumentType, avanzaTicker.tickerSymbol, avanzaTicker.changePercent);
        return ticker;
    };
    Ticker.fromAvanzaInstrument = function (avanzaInstrument, instrumentType) {
        var ticker = new Ticker(avanzaInstrument.isin, "", avanzaInstrument.id, avanzaInstrument.name, avanzaInstrument.lastPrice, avanzaInstrument.currency, avanzaInstrument.flagCode, instrumentType, avanzaInstrument.tickerSymbol, avanzaInstrument.changePercent);
        return ticker;
    };
    return Ticker;
}());
exports.Ticker = Ticker;
var AvanzaTicker = /** @class */ (function () {
    function AvanzaTicker(currency, lastPrice, changePercent, tradable, tickerSymbol, flagCode, name, id, riskLevel, changeSinceOneDay, changeSinceThreeMonths, changeSinceOneYear, risk, managementFee, rating, instrumentType) {
        this.currency = currency;
        this.lastPrice = lastPrice;
        this.changePercent = changePercent;
        this.tradable = tradable;
        this.tickerSymbol = tickerSymbol;
        this.flagCode = flagCode;
        this.name = name;
        this.id = id;
        this.riskLevel = riskLevel;
        this.changeSinceOneDay = changeSinceOneDay;
        this.changeSinceThreeMonths = changeSinceThreeMonths;
        this.changeSinceOneYear = changeSinceOneYear;
        this.risk = risk;
        this.managementFee = managementFee;
        this.rating = rating;
        this.instrumentType = instrumentType;
    }
    AvanzaTicker.fromAvanza = function (obj) {
        return new AvanzaTicker(obj.currency, obj.lastPrice, obj.changePercent, obj.tradable, obj.tickerSymbol, obj.flagCode, obj.name, obj.id, obj.riskLevel, obj.changeSinceOneDay, obj.changeSinceThreeMonths, obj.changeSinceOneYear, obj.risk, obj.managementFee, obj.rating, obj.instrumentType);
    };
    return AvanzaTicker;
}());
exports.AvanzaTicker = AvanzaTicker;
var YahooQuote = /** @class */ (function () {
    function YahooQuote() {
    }
    return YahooQuote;
}());
exports.YahooQuote = YahooQuote;
var AvanzaQuote = /** @class */ (function () {
    function AvanzaQuote(orderbookId, buyPrice, sellPrice, spread, closingPrice, highestPrice, lowestPrice, lastPrice, change, changePercent, updated, volumeWeightedAveragePrice, totalVolumeTraded, totalValueTraded, lastUpdated, changePercentNumber, updatedDisplay) {
        this.orderbookId = orderbookId;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.spread = spread;
        this.closingPrice = closingPrice;
        this.highestPrice = highestPrice;
        this.lowestPrice = lowestPrice;
        this.lastPrice = lastPrice;
        this.change = change;
        this.changePercent = changePercent;
        this.updated = updated;
        this.volumeWeightedAveragePrice = volumeWeightedAveragePrice;
        this.totalVolumeTraded = totalVolumeTraded;
        this.totalValueTraded = totalValueTraded;
        this.lastUpdated = lastUpdated;
        this.changePercentNumber = changePercentNumber;
        this.updatedDisplay = updatedDisplay;
    }
    return AvanzaQuote;
}());
exports.AvanzaQuote = AvanzaQuote;
var AvanzaInstrument = /** @class */ (function () {
    function AvanzaInstrument() {
    }
    return AvanzaInstrument;
}());
exports.AvanzaInstrument = AvanzaInstrument;
