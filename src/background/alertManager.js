import { storage } from '../utils/storage';

export class AlertManager {
    constructor() {
        this.history = [];
        this.lastAlertTime = 0;
        this.alertActive = false;
        this.loadState();
    }

    async loadState() {
        try {
            const stored = await storage.get(['priceHistory', 'lastAlertTime', 'alertActive']);
            if (stored.priceHistory) this.history = stored.priceHistory;
            if (stored.lastAlertTime) this.lastAlertTime = stored.lastAlertTime;
            if (stored.alertActive) this.alertActive = stored.alertActive;
        } catch (e) {
            console.error('Failed to load AlertManager state', e);
        }
    }

    async addPrice(price) {
        const now = Date.now();
        this.history.push({ t: now, p: price });
        // Prune history older than 60 mins (generous buffer)
        this.history = this.history.filter(h => now - h.t < 60 * 60 * 1000);

        // Persist to storage only occasionally (e.g. every 10th update or 10 seconds)
        // Since this is called every 1s by background, we can check time
        if (!this.lastPersistTime || now - this.lastPersistTime > 10000) {
            await this.persistState();
            this.lastPersistTime = now;
        }
    }

    async persistState() {
        await storage.set({ priceHistory: this.history });
    }

    async checkVolatility(currentPrice, settings) {
        const now = Date.now();
        const timeWindow = settings.timeWindow * 60 * 1000;
        const targetTime = now - timeWindow;

        const olderPoint = this.history.find(h => h.t >= targetTime);

        if (!olderPoint) return;

        const priceChange = ((currentPrice - olderPoint.p) / olderPoint.p) * 100;
        const absChange = Math.abs(priceChange);

        // Logic: Only alert if we cross the threshold AND current state wasn't already alerting (or if cooldown expired long ago)
        if (absChange >= settings.volatilityThreshold) {
            // Also reset active state if it's been a while (e.g. 2x window) to ensure we don't silence forever
            if (!this.alertActive || (now - this.lastAlertTime > timeWindow)) {
                await this.triggerAlert(absChange, priceChange > 0, settings);
                this.alertActive = true;
                await storage.set({ alertActive: true });
            }
        } else {
            // Reset state when volatility drops below threshold
            if (this.alertActive) {
                this.alertActive = false;
                await storage.set({ alertActive: false });
            }
        }
    }

    async triggerAlert(changePercent, isUp, settings) {
        const now = Date.now();
        // Hard suppression: at least 1 minute between ANY alerts
        if (now - this.lastAlertTime < 60 * 1000) return;

        this.lastAlertTime = now;
        await storage.set({ lastAlertTime: now });

        const message = `Price moved ${isUp ? 'UP' : 'DOWN'} by ${changePercent.toFixed(2)}% in ${settings.timeWindow} mins.`;

        if (settings.alertsEnabled.notification) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon128.png', // Keep this, but ensure file exists or it might default
                title: 'Crypto Volatility Alert',
                message: message,
                priority: 2
            });
        }

        if (settings.alertsEnabled.sound) {
            await this.playAudio(isUp);
        }
    }

    async playAudio(isUp) {
        // Check if offscreen exists
        const hasOffscreen = await chrome.offscreen.hasDocument();
        if (!hasOffscreen) {
            await chrome.offscreen.createDocument({
                url: 'offscreen.html',
                reasons: ['AUDIO_PLAYBACK'],
                justification: 'Play alert sound'
            });
        }
        chrome.runtime.sendMessage({ type: 'PLAY_SOUND', sound: isUp ? 'rise' : 'fall' });
    }
}
