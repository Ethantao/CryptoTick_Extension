export const ALARM_NAME = 'keepAlive';
export const POLLING_ALARM = 'pricePolling';
export const DEFAULT_SETTINGS = {
    asset: 'BTC',
    exchange: 'binance',
    volatilityThreshold: 2, // percentage
    timeWindow: 1, // minutes
    alertsEnabled: {
        sound: true,
        notification: true,
    },
    colorTheme: 'green-up', // 'green-up' (Western) or 'red-up' (Eastern)
    refreshInterval: 10, // seconds (fallback)
    language: navigator.language.startsWith('zh') ? 'zh' : 'en', // Auto-detect default, but adaptable
    theme: 'dark', // 'light', 'dark'
};

export const EXCHANGE_URLS = {
    binance: {
        ws: 'wss://stream.binance.com:9443/ws',
        api: 'https://api.binance.com/api/v3/ticker/price',
    },
    okx: {
        ws: 'wss://ws.okx.com:8443/ws/v5/public',
        api: 'https://www.okx.com/api/v5/market/ticker',
    },
};
