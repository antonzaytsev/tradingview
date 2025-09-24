import { Themes } from "../components/TradingViewWidget";

// interval: [1,3,5,15,30,60,120,180,"1","3","5","15","30","60","120","180","D","W"].
// range: [1D, 5D, 1M, 3M, 6M, YTD, 1Y, 60M, All]
export const charts = [
  {
    interval: '15',
    visible: true,
    // range: "5D", // 1D, 5D, 1M, 3M, 6M, YTD, 1Y, 60M, All
  },
  {
    interval: '60',
    visible: true,
    // range: "4M"
  },
  {
    interval: '240',
    visible: true,
    // range: "30M",
  },
  {
    interval: 'D',
    visible: true,
    // range: "120M",
  },
  {
    interval: 'W',
    visible: true,
    // range: "30M",
  },
  {
    interval: 'M',
    visible: true,
    // range: '60M',
  },
]

export const chartConfig = {
  autosize: true,
  locale: 'en',
  theme: Themes.DARK,
  timezone: 'Etc/UTC',
  style: '1', // 1 candles or 8 heinkin
  enable_publishing: false,
  allow_symbol_change: false,
  calendar: true,
  save_image: false,
  hide_top_toolbar: true,
  hide_side_toolbar: true,
  withdateranges: false,
}

export const symbols = [
  { coin: 'BTC', exchange: 'Bybit', symbol: 'BYBIT:BTCUSDT', visible: true },
  { coin: 'BTC', exchange: 'Kraken', symbol: 'KRAKEN:BTCUSD', visible: true },
  // 'BINANCE:BTCUSDT',
  // 'BINANCE:BTCFDUSD',
  // 'COINBASE:BTCUSD',
  // 'KRAKEN:BTCUSD',

  { coin: 'ETH', exchange: 'Coinbase', symbol: 'COINBASE:ETHUSD', visible: true },
  { coin: 'ETH', exchange: 'Bybit', symbol: 'BYBIT:ETHUSDT', visible: true },
  { coin: 'ETH', exchange: 'Kraken', symbol: 'KRAKEN:ETHUSD', visible: true },

  // ['ADA', 'BYBIT:ADAUSDT'],
  // ['ADA', 'BINANCE:ADAUSDT'],

  { coin: 'ARB', exchange: 'Bybit', symbol: 'BYBIT:ARBUSDT', visible: true },

  { coin: 'POL', exchange: 'Bybit', symbol: 'BYBIT:POLUSDT', visible: true },

  // 'BITSTAMP:XRPUSD',
  // 'BINANCE:XRPUSD',

  { coin: 'TON', exchange: 'Bybit', symbol: 'BYBIT:TONUSDT', visible: true },
  // 'OKX:TONUSDT',

  // ['AVAX', 'BYBIT:AVAXUSDT'],
  // 'BINANCE:AVAXUSDT',

  // ['DOT', 'BYBIT:DOTUSDT'],
  // 'BINANCE:DOTUSDT',

  // ['TRX', 'BYBIT:TRXUSDT'],
  // 'BINANCE:TRXUSDT',

  // ['SOL', 'BYBIT:SOLUSDT'],
  // ['SOL', 'BINANCE:SOLUSDT'],
  // 'OKX:SOLUSDT',

  // 'BYBIT:LTCUSDT',
  // 'BINANCE:LTCUSDT',
  // 'KUCOIN:LTCUSDT',
  // 'KRAKEN:LTCUSDT',

  // { coin: 'USDKZT', symbol: 'FX_IDC:USDKZT', settings: { chart: { hide_volume: true }, charts_amount: 4 } },
  { coin: 'USDKZT', symbol: 'FX_IDC:USDKZT', visible: true, settings: { chart: { hide_volume: true } } },
  { coin: 'USDRUB', symbol: 'FX_IDC:USDRUB', visible: true, settings: { chart: { hide_volume: true } } },
  { coin: 'EURRUB', symbol: 'FX_IDC:EURRUB', visible: true, settings: { chart: { hide_volume: true } } },
  { coin: 'USDEUR', symbol: 'FX_IDC:USDEUR', visible: true, settings: { chart: { hide_volume: true } } },
]
