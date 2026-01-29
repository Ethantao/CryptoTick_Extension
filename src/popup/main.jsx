import '../index.css';
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { storage } from '../utils/storage';
import { translations } from '../utils/translations';
import { DEFAULT_SETTINGS } from '../utils/constants';
import ChartComponent from './ChartComponent';

const Popup = () => {
    const [settings, setSettings] = useState(null);
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const data = await storage.get(null);
            setSettings({ ...DEFAULT_SETTINGS, ...data });
            if (data.lastPrice) setPrice(data.lastPrice);
            setLoading(false);
        };
        init();

        // Listen for storage changes (real-time price update)
        const handleStorageChange = (changes) => {
            if (changes.lastPrice) {
                setPrice(changes.lastPrice.newValue);
            }
        };
        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);

    // Theme Logic
    useEffect(() => {
        if (!settings) return;
        const root = document.documentElement;
        if (settings.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [settings?.theme]);

    const openOptions = () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    };

    const openPopup = () => {
        chrome.windows.create({
            url: 'popup.html',
            type: 'panel', // 'panel' type attempts to stay on top on some OSs
            width: 360,
            height: 450
        });
        window.close();
    };

    const t = (key) => {
        const lang = settings?.language || 'en';
        const dict = translations[lang] || translations.en;
        return dict[key] || key;
    };
    // ... (loading check)

    const asset = settings?.asset || 'BTC';
    const exchange = settings?.exchange || 'binance';

    // Format price helper
    const formatFullPrice = (p) => {
        if (!p) return 'Waiting...';
        if (p < 0.01) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 6 }).format(p);
        if (p < 1.0) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 }).format(p);
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);
    };

    return (
        <div className="w-[350px] h-auto min-h-[380px] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-sans relative overflow-hidden flex flex-col transition-colors duration-300">

            {/* Background Glow */}
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-purple-500/10 dark:bg-purple-600/20 blur-[60px] rounded-full pointer-events-none" />

            {/* Header: Green Dot + Exchange + Grey Dot + Asset */}
            <div className="p-3 flex justify-between items-center z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-white/5 shadow-sm backdrop-blur-md">
                    {/* Green Dot */}
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>

                    {/* Exchange */}
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider leading-none pt-0.5">
                        {exchange}
                    </span>

                    {/* Grey Dot Separator */}
                    <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />

                    {/* Asset */}
                    <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-wider leading-none pt-0.5">
                        {asset}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Pin Icon */}
                    <button
                        onClick={openPopup}
                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
                        title="Pin to Window"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z" /></svg>
                    </button>

                    {/* Settings Icon */}
                    <button
                        onClick={openOptions}
                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
                        title={t('title')}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                </div>
            </div>

            {/* Main Content: Current Price */}
            <div className="flex-1 flex flex-col items-center justify-start pt-2 pb-4 z-10 w-full px-4">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">Current Price</div>
                <div className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm font-mono tabular-nums mb-4">
                    {formatFullPrice(price)}
                </div>

                {/* Chart */}
                {settings && (
                    <ChartComponent
                        exchange={settings.exchange}
                        asset={settings.asset}
                        theme={settings.theme}
                    />
                )}
            </div>
        </div>
    )
}

import ErrorBoundary from '../components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <Popup />
        </ErrorBoundary>
    </React.StrictMode>,
)
