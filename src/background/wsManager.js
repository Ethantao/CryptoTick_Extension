import { EXCHANGE_URLS } from '../utils/constants';

export class WebSocketManager {
    constructor(exchange, asset, onPriceUpdate) {
        this.exchange = exchange;
        this.asset = asset;
        this.onPriceUpdate = onPriceUpdate;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.isConnected = false;
    }

    connect() {
        if (this.ws) {
            this.ws.close();
        }

        const url = this.getWsUrl();
        if (!url) return;

        console.log(`Connecting to ${this.exchange} WebSocket...`);
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.subscribe();
        };

        this.ws.onmessage = (event) => {
            try {
                const price = this.parseMessage(event.data);
                if (price) {
                    this.onPriceUpdate(price);
                }
            } catch (e) {
                console.error('Error parsing WS message:', e);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.scheduleReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    getWsUrl() {
        const config = EXCHANGE_URLS[this.exchange];
        return config ? config.ws : null;
    }

    subscribe() {
        // Basic subscription payloads based on exchange
        // This requires specific implementation for each exchange
        const symbol = this.getFormatSymbol();
        let payload = null;

        if (this.exchange === 'binance') {
            payload = {
                method: 'SUBSCRIBE',
                params: [`${symbol.toLowerCase()}@trade`],
                id: 1
            };
        } else if (this.exchange === 'okx') {
            payload = {
                op: 'subscribe',
                args: [{ channel: 'tickers', instId: symbol }]
            };
        }

        if (payload && this.ws) {
            this.ws.send(JSON.stringify(payload));
        }
    }

    getFormatSymbol() {
        if (this.exchange === 'binance') return `${this.asset}USDT`; // Simplified
        if (this.exchange === 'okx') return `${this.asset}-USDT`;
        return this.asset;
    }

    parseMessage(data) {
        const msg = JSON.parse(data);

        if (this.exchange === 'binance') {
            if (msg.e === 'trade') return parseFloat(msg.p);
        } else if (this.exchange === 'okx') {
            if (msg.data && msg.data[0]) return parseFloat(msg.data[0].last);
        }

        return null;
    }

    scheduleReconnect() {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), delay);
    }

    disconnect() {
        if (this.ws) {
            this.ws.onclose = null; // Prevent reconnect
            this.ws.close();
            this.ws = null;
        }
    }
}
