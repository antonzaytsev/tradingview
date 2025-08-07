import { Themes } from "react-tradingview-widget";

export const charts = [
  {
    interval: '15', // [1,3,5,15,30,60,120,180,"1","3","5","15","30","60","120","180","D","W"]
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

export const chartsFour = [
  ...charts.slice(2, 6),
]

export const symbols = [
  ['BTC', 'BYBIT:BTCUSDT'],
  ['BTC [Kraken]', 'KRAKEN:BTCUSD'],
  // 'BINANCE:BTCUSDT',
  // 'BINANCE:BTCFDUSD',
  // 'COINBASE:BTCUSD',
  // 'KRAKEN:BTCUSD',

  ['ETHUSD', 'COINBASE:ETHUSD'],

  ['ETH', 'BYBIT:ETHUSDT'],
  ['ETH [Kraken]', 'KRAKEN:ETHUSD'],

  ['ADA', 'BYBIT:ADAUSDT'],
  // ['ADA', 'BINANCE:ADAUSDT'],

  ['ARB', 'BYBIT:ARBUSDT'],

  ['POL', 'BYBIT:POLUSDT'],

  // 'BITSTAMP:XRPUSD',
  // 'BINANCE:XRPUSD',

  ['TON', 'BYBIT:TONUSDT'],
  // 'OKX:TONUSDT',

  ['AVAX', 'BYBIT:AVAXUSDT'],
  // 'BINANCE:AVAXUSDT',

  ['DOT', 'BYBIT:DOTUSDT'],
  // 'BINANCE:DOTUSDT',

  ['TRX', 'BYBIT:TRXUSDT'],
  // 'BINANCE:TRXUSDT',

  ['SOL', 'BYBIT:SOLUSDT'],
  // ['SOL', 'BINANCE:SOLUSDT'],
  // 'OKX:SOLUSDT',

  // 'BYBIT:LTCUSDT',
  // 'BINANCE:LTCUSDT',
  // 'KUCOIN:LTCUSDT',
  // 'KRAKEN:LTCUSDT',

  ['USDKZT', 'FX_IDC:USDKZT', { hide_volume: true }, chartsFour],
  ['USDRUB', 'FX_IDC:USDRUB', { hide_volume: true }, chartsFour],
  ['EURRUB', 'FX_IDC:EURRUB', { hide_volume: true }, chartsFour],
]
