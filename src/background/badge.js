export const formatPrice = (price) => {
    if (!price && price !== 0) return '...';

    // >= 1M: 1.2M, 100M
    if (price >= 1000000) {
        return (price / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }

    // >= 10k: 10.5k, 28.0k, 100k
    if (price >= 10000) {
        return (price / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }

    // Double check float precision issues
    if (price < 0.000001) return '0.00';

    // < 10k: Try to show as much detail as possible within ~4-5 chars
    // Case: 1000 - 9999 (4 digits) -> Return as is (integer)
    if (price >= 1000) {
        return Math.round(price).toString();
    }

    // Case: < 1000
    // Try to fit in 4-5 chars
    let str = price.toString();
    if (str.length <= 5) return str;

    if (price >= 100) return price.toFixed(1); // 123.4
    if (price >= 1) return parseFloat(price.toFixed(3)).toString().substring(0, 5);
    return price.toFixed(4).substring(0, 5); // 0.123
};

export class BadgeManager {
    constructor() {
        this.lastPrice = 0;
    }

    update(price, settings) {
        const text = formatPrice(price);
        chrome.action.setBadgeText({ text });

        const isUp = price >= this.lastPrice;
        this.lastPrice = price;

        let color = '#888888'; // Default grey

        if (settings.colorTheme === 'green-up') {
            color = isUp ? '#00FF00' : '#FF0000'; // Green Up, Red Down
        } else {
            color = isUp ? '#FF0000' : '#00FF00'; // Red Up, Green Down
        }

        // Adjust for dark mode visibility or standard usage
        // Using standard colors: Green #4CAF50, Red #F44336 might be better visuals
        if (settings.colorTheme === 'green-up') {
            color = isUp ? '#4CAF50' : '#F44336';
        } else {
            color = isUp ? '#F44336' : '#4CAF50';
        }

        chrome.action.setBadgeBackgroundColor({ color });
    }
}
