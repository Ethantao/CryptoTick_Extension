export const storage = {
    async get(keys) {
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, (result) => resolve(result));
        });
    },

    async set(data) {
        return new Promise((resolve) => {
            chrome.storage.local.set(data, () => resolve());
        });
    },

    async getAll() {
        return new Promise((resolve) => {
            chrome.storage.local.get(null, (result) => resolve(result));
        });
    }
};
