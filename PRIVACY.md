# Privacy Policy for CryptoTick & Alert

**Last Updated: January 29, 2026**

This Privacy Policy describes how CryptoTick & Alert ("we", "us", or "our") collects, uses, and discloses information, and what choices you have with respect to the information.

## 1. Information Collection and Use

**We do NOT collect, store, or transmit any personal data.**

* **No Analytics**: We do not use Google Analytics or any third-party tracking software.
* **No User Accounts**: The extension functions entirely without user registration or login.
* **Local Storage**: User preferences (such as selected asset, exchange source, and alert thresholds) are stored locally on your device using `chrome.storage.local`. This data never leaves your browser.

## 2. Permissions

We request the minimum permissions necessary for the extension to function:

* **`storage`**: Used solely to save your local settings (e.g., whether you want to track BTC or ETH).
* **`alarms`**: Used as a fallback timer to fetch price updates if the WebSocket connection is interrupted.
* **`notifications`**: Used to display system notifications when a price volatility alert is triggered based on your custom thresholds.
* **`offscreen`**: Used strictly to play audio alert sounds ("Pump" or "Dump" effects) in the background.

## 3. Data Transmission

The extension connects directly to the public APIs of the following cryptocurrency exchanges to fetch real-time price data:

* **Binance**: `wss://stream.binance.com:9443` and `https://api.binance.com`
* **OKX**: `wss://ws.okx.com:8443` and `https://www.okx.com`

These connections are made directly from your browser to the exchange. Your IP address may be visible to these exchanges as part of the standard HTTP/WebSocket connection process, but we do not intercept or route this traffic through any intermediate servers.

## 4. Remote Code

This extension does **not** execute any remote code. All logic is contained within the extension package installed on your browser.

## 5. Contact Us

If you have any questions about this Privacy Policy, please contact us via our GitHub repository:
[https://github.com/Ethantao/CryptoTick_Extension](https://github.com/Ethantao/CryptoTick_Extension)
