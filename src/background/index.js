import { WebSocketManager } from './wsManager';
import { BadgeManager } from './badge';
import { AlertManager } from './alertManager';
import { storage } from '../utils/storage';
import { DEFAULT_SETTINGS, POLLING_ALARM, EXCHANGE_URLS } from '../utils/constants';

let wsManager;
let badgeManager;
let alertManager;
let settings;
let lastStorageUpdate = 0;
const initialize = async () => {
    const stored = await storage.get(null);
    settings = { ...DEFAULT_SETTINGS, ...stored };

    badgeManager = new BadgeManager();
    alertManager = new AlertManager();

    setupConnection();

    // Watch for settings changes
    chrome.storage.onChanged.addListener((changes) => {
        let needsReconnect = false;
        for (const [key, { newValue }] of Object.entries(changes)) {
            settings[key] = newValue;
            if (['asset', 'exchange'].includes(key)) needsReconnect = true;
        }
        if (needsReconnect) setupConnection();
    });
};

const setupConnection = () => {
    if (wsManager) {
        wsManager.disconnect();
    }

    wsManager = new WebSocketManager(settings.exchange, settings.asset, handlePriceUpdate);
    wsManager.connect();

    // Setup polling fallback check
    chrome.alarms.create(POLLING_ALARM, { periodInMinutes: 1 });
};

const handlePriceUpdate = (price) => {
    const now = Date.now();
    // Throttle updates to once per second to prevent browser lag
    if (now - lastStorageUpdate < 1000) return;
    lastStorageUpdate = now;

    // Save to storage so popup can read it
    storage.set({ lastPrice: price });

    // Update Badge
    badgeManager.update(price, settings);

    // Check Volatility
    alertManager.addPrice(price);
    alertManager.checkVolatility(price, settings);
};

// Polling fallback if WS is dead
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === POLLING_ALARM) {
        if (!wsManager || !wsManager.isConnected) {
            console.log('WS disconnected, polling...');
            fetchPriceDirectly();
        }
    }
});

const fetchPriceDirectly = async () => {
    // Basic Fetch implementation based on exchange
    // This is a simplified example
    try {
        const config = EXCHANGE_URLS[settings.exchange];
        if (!config || !config.api) return;

        let url = config.api;
        let price = null;

        // Construct URL and parse logic (simplified for brevity, needs robustness)
        if (settings.exchange === 'binance') {
            const symbol = `${settings.asset}USDT`;
            const response = await fetch(`${url}?symbol=${symbol}`);
            const data = await response.json();
            price = parseFloat(data.price);
        }

        if (price) handlePriceUpdate(price);

    } catch (e) {
        console.error("Polling failed", e);
    }
};

initialize();
