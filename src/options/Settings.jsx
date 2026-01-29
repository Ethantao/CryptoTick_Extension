import '../index.css';
import React, { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';
import { translations } from '../utils/translations';
import okxQr from '../assets/qr_okx.png';
import binanceQr from '../assets/qr_binance.png';
import logoOkx from '../assets/logo_okx.png';
import logoBinance from '../assets/logo_binance.png';

const Settings = () => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    // Theme Logic
    useEffect(() => {
        const root = document.documentElement;
        if (settings.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [settings.theme]);

    const loadSettings = async () => {
        const data = await storage.get(null);
        setSettings({ ...DEFAULT_SETTINGS, ...data });
    };

    const handleChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        if (key === 'alertsEnabled') {
            newSettings.alertsEnabled = { ...settings.alertsEnabled, ...value };
        }
        setSettings(newSettings);
        storage.set(newSettings);
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    const t = translations[settings.language] || translations.en;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 font-sans selection:bg-purple-500/30 transition-colors duration-300">

            {/* Background Ambience (Dark Mode Only) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-0 dark:opacity-100 transition-opacity duration-300">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Main Card */}
            <div className="w-full max-w-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden p-6 space-y-8 transition-colors duration-300">

                {/* Header */}
                <header className="flex justify-between items-center border-b border-zinc-200 dark:border-white/5 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                            CryptoTick
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">{t.subtitle}</p>
                    </div>
                    <div className="flex bg-zinc-100 dark:bg-black/40 rounded-lg p-1 border border-zinc-200 dark:border-white/5 text-zinc-500">
                        <button
                            onClick={() => handleChange('language', 'en')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${settings.language === 'en' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => handleChange('language', 'zh')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${settings.language === 'zh' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                        >
                            中文
                        </button>

                        {/* Divider */}
                        <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1"></div>

                        {/* Theme Switcher in Header */}
                        <div className="flex gap-1">
                            <button
                                onClick={() => handleChange('theme', 'light')}
                                title={t.light}
                                className={`p-1.5 rounded-md transition-all ${settings.theme === 'light' ? 'bg-white dark:bg-zinc-800 text-yellow-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </button>
                            <button
                                onClick={() => handleChange('theme', 'dark')}
                                title={t.dark}
                                className={`p-1.5 rounded-md transition-all ${settings.theme === 'dark' ? 'bg-white dark:bg-zinc-800 text-purple-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Theme & Data Source */}
                <div className="space-y-6">

                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 pl-1">{t.dataSource}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.asset}</label>
                            <div className="flex gap-2">
                                <select
                                    value={settings.asset}
                                    onChange={(e) => handleChange('asset', e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="BTC">Bitcoin (BTC)</option>
                                    <option value="ETH">Ethereum (ETH)</option>
                                    <option value="SOL">Solana (SOL)</option>
                                    <option value="DOGE">Dogecoin (DOGE)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.exchange}</label>
                            <select
                                value={settings.exchange}
                                onChange={(e) => handleChange('exchange', e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="binance">Binance</option>
                                <option value="okx">OKX</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.backupInterval}</label>
                            <input
                                type="number"
                                min="5"
                                value={settings.refreshInterval}
                                onChange={(e) => handleChange('refreshInterval', Math.max(5, parseInt(e.target.value) || 5))}
                                className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                            />
                            <p className="text-xs text-zinc-500">{t.backupWarning}</p>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 pl-1">{t.alerts}</h3>
                    <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.threshold}</label>
                                <div className="relative">
                                    <input
                                        type="number" step="0.1"
                                        value={settings.volatilityThreshold}
                                        onChange={(e) => handleChange('volatilityThreshold', parseFloat(e.target.value))}
                                        className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg pl-4 pr-8 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500/50 outline-none"
                                    />
                                    <span className="absolute right-3 top-2 text-zinc-500 text-xs">%</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">{t.thresholdDesc}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.timeWindow}</label>
                                <div className="relative">
                                    <input
                                        type="number" min="1"
                                        value={settings.timeWindow}
                                        onChange={(e) => handleChange('timeWindow', parseInt(e.target.value))}
                                        className="w-full bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-lg pl-4 pr-8 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500/50 outline-none"
                                    />
                                    <span className="absolute right-3 top-2 text-zinc-500 text-xs">min</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">{t.timeWindowDesc}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-white/5">
                            <Toggle
                                label={t.enableSound}
                                checked={settings.alertsEnabled.sound}
                                onChange={() => handleChange('alertsEnabled', { ...settings.alertsEnabled, sound: !settings.alertsEnabled.sound })}
                            />
                            <Toggle
                                label={t.desktopNotification}
                                checked={settings.alertsEnabled.notification}
                                onChange={() => handleChange('alertsEnabled', { ...settings.alertsEnabled, notification: !settings.alertsEnabled.notification })}
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 pl-1">{t.appearance}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => handleChange('colorTheme', 'green-up')}
                            className={`cursor-pointer rounded-xl border p-4 transition-all ${settings.colorTheme === 'green-up' ? 'border-purple-500/50 bg-purple-500/10' : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                        >
                            <div className="text-sm font-bold text-zinc-900 dark:text-white mb-2">{t.globalStandard}</div>
                            <div className="flex gap-3 font-mono text-xs">
                                <span className="text-emerald-500 dark:text-emerald-400">▲ {t.up}</span>
                                <span className="text-rose-500 dark:text-rose-400">▼ {t.down}</span>
                            </div>
                        </div>
                        <div
                            onClick={() => handleChange('colorTheme', 'red-up')}
                            className={`cursor-pointer rounded-xl border p-4 transition-all ${settings.colorTheme === 'red-up' ? 'border-purple-500/50 bg-purple-500/10' : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/20 hover:bg-zinc-100 dark:hover:bg-white/5'}`}
                        >
                            <div className="text-sm font-bold text-zinc-900 dark:text-white mb-2">{t.eastAsian}</div>
                            <div className="flex gap-3 font-mono text-xs">
                                <span className="text-rose-500 dark:text-rose-400">▲ {t.up}</span>
                                <span className="text-emerald-500 dark:text-emerald-400">▼ {t.down}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donation & Support */}
                <div className="mt-8 relative group">
                    {/* Background & Glow Container (Clipped) - Correctly positioned behind */}
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-black border border-purple-500/20 dark:border-purple-500/30 rounded-xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 dark:bg-purple-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-purple-500/10 dark:group-hover:bg-purple-500/20 transition-all" />
                    </div>

                    {/* Content Container (Visible Overflow for Tooltips) - z-10 puts it above background */}
                    <div className="relative p-5 z-10 ml-0.5 mt-0.5 mr-0.5 mb-0.5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{t.buyCoffee}</h3>
                                <p className="text-xs text-zinc-500 mt-1">Support development & updates.</p>
                            </div>
                            <div className="flex gap-2 relative">
                                <PayButton
                                    label="OKX Pay"
                                    color="bg-black text-white hover:bg-zinc-800"
                                    qrImg={binanceQr}
                                    icon={<img src={logoOkx} alt="OKX" className="w-4 h-4 object-contain brightness-0 invert" />}
                                />
                                <PayButton
                                    label="Binance Pay"
                                    color="bg-[#FCD535] text-black hover:bg-[#F0C930]"
                                    qrImg={okxQr}
                                    icon={<img src={logoBinance} alt="Binance" className="w-4 h-4 object-contain brightness-0" />}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-white/5">
                            <CopyRow label="USDT (TRC20)" value="TWfvtQvcThPR5XwRQpawWi8KXrUpx4o5Ha" copied={copied === "USDT"} onCopy={() => copyToClipboard("TWfvtQvcThPR5XwRQpawWi8KXrUpx4o5Ha", "USDT")} t={t} />
                            <CopyRow label="SOL" value="AhQWJnxBunp6bvwDgUFFF2xXUZQphowjmu3rcvMwZdwi" copied={copied === "SOL"} onCopy={() => copyToClipboard("AhQWJnxBunp6bvwDgUFFF2xXUZQphowjmu3rcvMwZdwi", "SOL")} t={t} />
                            <CopyRow label="ETH" value="0x9aa47cdc031f7191abc9c31f8eeeec297e32f955" copied={copied === "ETH"} onCopy={() => copyToClipboard("0x9aa47cdc031f7191abc9c31f8eeeec297e32f955", "ETH")} t={t} />
                        </div>

                        {/* Open Source Link */}
                        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/5 text-center">
                            <a
                                href="https://github.com/Ethantao/CryptoTick_Extension"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.597 1.028 2.688 0 3.848-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                Open Source on GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
// Updated PayButton with unique group identifier to prevent hover conflicts
const PayButton = ({ label, color, qrImg, icon }) => (
    <div className="relative group/btn">
        <button className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 ${color}`}>
            {icon || <span>💳</span>} {label}
        </button>
        {/* Hover QR Card - Only shows on group-hover/btn */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl shadow-black/20 opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all duration-300 transform translate-y-2 group-hover/btn:translate-y-0 z-50 border border-zinc-100 dark:border-zinc-700">
            <div className="aspect-square bg-white rounded-lg flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-700">
                <img src={qrImg} alt={`${label} QR`} className="w-full h-full object-contain" />
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-zinc-800"></div>
        </div>
    </div>
);

const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{label}</span>
        <button
            onClick={onChange}
            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-200 dark:focus:ring-offset-zinc-900 focus:ring-purple-500 ${checked ? 'bg-purple-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
        </button>
    </div>
);

const CopyRow = ({ label, value, copied, onCopy, t }) => (
    <div className="flex items-center justify-between text-xs bg-zinc-100 dark:bg-black/30 rounded-lg p-2 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors">
        <span className="text-zinc-500 font-semibold w-24 shrink-0">{label}</span>
        <span className="text-zinc-600 dark:text-zinc-400 font-mono truncate select-all">{value}</span>
        <button
            onClick={onCopy}
            className={`ml-2 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors shrink-0 ${copied ? 'bg-green-500 text-white dark:text-black' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'}`}
        >
            {copied ? t.copied : t.copy}
        </button>
    </div>
);

export default Settings;
