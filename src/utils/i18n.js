import { translations } from './translations';

/**
 * Get localized string using chrome.i18n.getMessage
 * Falls back to English translations if chrome.i18n is unavailable (e.g. local dev)
 * @param {string} key - The message key in messages.json
 * @returns {string} - The localized string
 */
export const t = (key) => {
    if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
        const msg = chrome.i18n.getMessage(key);
        return msg || key;
    }
    // Fallback for non-extension environment
    return translations['en'][key] || key;
};
