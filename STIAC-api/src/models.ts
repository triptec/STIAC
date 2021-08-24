export class Ticker {
  isin: String;
  yahooId: String;
  avanzaId: String;
  displayName: String;
  lastPrice: Number;
  currency: String;
  countryCode: String;
  instrumentType: String;
  ticker: String;
  changePercent: Number;
  lastUpdated: String;

  constructor(
    isin: String,
    yahooId: String,
    avanzaId: String,
    displayName: String,
    lastPrice: Number,
    currency: String,
    countryCode: String,
    instrumentType: String,
    ticker: String,
    changePercent: Number
  ) {
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

  public static fromAvanzaTicker(avanzaTicker: AvanzaTicker): Ticker {
    const ticker = new Ticker(
      null,
      null,
      avanzaTicker.id,
      avanzaTicker.name,
      avanzaTicker.lastPrice,
      avanzaTicker.currency,
      avanzaTicker.flagCode,
      avanzaTicker.instrumentType,
      avanzaTicker.tickerSymbol,
      avanzaTicker.changePercent
    );
    return ticker;
  }

  public static fromAvanzaInstrument(
    avanzaInstrument: AvanzaInstrument,
    instrumentType: String
  ): Ticker {
    const ticker = new Ticker(
      avanzaInstrument.isin,
      "",
      avanzaInstrument.id,
      avanzaInstrument.name,
      avanzaInstrument.lastPrice,
      avanzaInstrument.currency,
      avanzaInstrument.flagCode,
      instrumentType,
      avanzaInstrument.tickerSymbol,
      avanzaInstrument.changePercent
    );
    return ticker;
  }
}

export class AvanzaTicker {
  currency: String;
  lastPrice: Number;
  changePercent: Number;
  tradable: Boolean;
  tickerSymbol: String;
  flagCode: String;
  name: String;
  id: String;
  riskLevel: String;
  changeSinceOneDay: Number;
  changeSinceThreeMonths: Number;
  changeSinceOneYear: Number;
  risk: Number;
  managementFee: Number;
  rating: Number;
  instrumentType: String;

  constructor(
    currency: String,
    lastPrice: Number,
    changePercent: Number,
    tradable: Boolean,
    tickerSymbol: String,
    flagCode: String,
    name: String,
    id: String,
    riskLevel: String,
    changeSinceOneDay: Number,
    changeSinceThreeMonths: Number,
    changeSinceOneYear: Number,
    risk: Number,
    managementFee: Number,
    rating: Number,
    instrumentType: String
  ) {
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

  public static fromAvanza(obj) {
    return new AvanzaTicker(
      obj.currency,
      obj.lastPrice,
      obj.changePercent,
      obj.tradable,
      obj.tickerSymbol,
      obj.flagCode,
      obj.name,
      obj.id,
      obj.riskLevel,
      obj.changeSinceOneDay,
      obj.changeSinceThreeMonths,
      obj.changeSinceOneYear,
      obj.risk,
      obj.managementFee,
      obj.rating,
      obj.instrumentType
    );
  }
}

export class YahooQuote {
  id: String;
  price: Number;
  time: String;
  exchange: String;
  quoteType: String;
  marketHours: String;
  changePercent: Number;
  dayVolume: String;
  change: Number;
  priceHint: String;
}

export class AvanzaQuote {
  orderbookId: String;
  buyPrice: Number;
  sellPrice: Number;
  spread: Number;
  closingPrice: Number;
  highestPrice: Number;
  lowestPrice: Number;
  lastPrice: Number;
  change: Number;
  changePercent: Number;
  updated: Number;
  volumeWeightedAveragePrice: Number;
  totalVolumeTraded: Number;
  totalValueTraded: Number;
  lastUpdated: Number;
  changePercentNumber: Number;
  updatedDisplay: String;

  constructor(
    orderbookId: String,
    buyPrice: Number,
    sellPrice: Number,
    spread: Number,
    closingPrice: Number,
    highestPrice: Number,
    lowestPrice: Number,
    lastPrice: Number,
    change: Number,
    changePercent: Number,
    updated: Number,
    volumeWeightedAveragePrice: Number,
    totalVolumeTraded: Number,
    totalValueTraded: Number,
    lastUpdated: Number,
    changePercentNumber: Number,
    updatedDisplay: String
  ) {
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
}

export class AvanzaInstrument {
  priceThreeMonthsAgo: Number;
  priceOneWeekAgo: Number;
  priceOneMonthAgo: Number;
  priceSixMonthsAgo: Number;
  priceAtStartOfYear: Number;
  priceOneYearAgo: Number;
  priceThreeYearsAgo: Number;
  priceFiveYearsAgo: Number;
  marketPlace: String;
  marketList: String;
  loanFactor: Number;
  quoteUpdated: String;
  hasInvestmentFees: Boolean;
  morningStarFactSheetUrl: String;
  currency: String;
  tradable: Boolean;
  shortSellable: Boolean;
  lowestPrice: Number;
  highestPrice: Number;
  totalVolumeTraded: Number;
  buyPrice: Number;
  sellPrice: Number;
  isin: String;
  lastPrice: Number;
  lastPriceUpdated: String;
  change: Number;
  changePercent: Number;
  totalValueTraded: Number;
  tickerSymbol: String;
  flagCode: String;
  name: String;
  id: String;
  country: String;
  keyRatios: any;
  numberOfOwners: Number;
  superLoan: Boolean;
  numberOfPriceAlerts: Number;
  pushPermitted: Boolean;
  dividends: any[];
  relatedStocks: any[];
  company: any;
  orderDepthLevels: any[];
  marketMakerExpected: Boolean;
  orderDepthReceivedTime: String;
  latestTrades: any[];
  marketTrades: Boolean;
  positions: any[];
  positionsTotalValue: Number;
  annualMeetings: any[];
  companyReports: any[];
  brokerTradeSummary: any;
  companyOwners: any;
}
