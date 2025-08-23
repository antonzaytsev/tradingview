import { Themes } from "react-tradingview-widget";

// [1,3,5,15,30,60,120,180,"1","3","5","15","30","60","120","180","D","W"].
export const charts = [
  {
    interval: '15',
    // range: "5D", // 1D, 5D, 1M, 3M, 6M, YTD, 1Y, 60M, All
  },
  {
    interval: '60',
    // range: "4M"
  },
  {
    interval: '240',
    // range: "30M",
  },
  {
    interval: 'D',
    // range: "120M",
  },
  {
    interval: 'W',
    // range: "30M",
  },
  {
    interval: 'M',
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
  { coin: 'BTC', exchange: 'Bybit', symbol: 'BYBIT:BTCUSDT' },
  { coin: 'BTC', exchange: 'Kraken', symbol: 'KRAKEN:BTCUSD' },
  // 'BINANCE:BTCUSDT',
  // 'BINANCE:BTCFDUSD',
  // 'COINBASE:BTCUSD',
  // 'KRAKEN:BTCUSD',

  { coin: 'ETH', exchange: 'Coinbase', symbol: 'COINBASE:ETHUSD' },
  { coin: 'ETH', exchange: 'Bybit', symbol: 'BYBIT:ETHUSDT' },
  { coin: 'ETH', exchange: 'Kraken', symbol: 'KRAKEN:ETHUSD' },

  // ['ADA', 'BYBIT:ADAUSDT'],
  // ['ADA', 'BINANCE:ADAUSDT'],

  { coin: 'ARB', exchange: 'Bybit', symbol: 'BYBIT:ARBUSDT' },

  { coin: 'POL', exchange: 'Bybit', symbol: 'BYBIT:POLUSDT' },

  // 'BITSTAMP:XRPUSD',
  // 'BINANCE:XRPUSD',

  { coin: 'TON', exchange: 'Bybit', symbol: 'BYBIT:TONUSDT' },
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

  { coin: 'USDKZT', symbol: 'FX_IDC:USDKZT', settings: { chart: { hide_volume: true }, charts_amount: 4 } },
  { coin: 'USDRUB', symbol: 'FX_IDC:USDRUB', settings: { chart: { hide_volume: true }, charts_amount: 4 } },
  { coin: 'EURRUB', symbol: 'FX_IDC:EURRUB', settings: { chart: { hide_volume: true }, charts_amount: 4 } },
]
