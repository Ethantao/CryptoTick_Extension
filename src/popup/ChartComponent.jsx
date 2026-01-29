import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

const ChartComponent = ({ exchange, asset, theme }) => {
    const chartContainerRef = useRef();
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [interval, setInterval] = useState('15m');
    const chartRef = useRef(null);

    // Color definitions
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const backgroundColor = isDark ? '#18181b' : '#ffffff'; // zinc-900 vs white
    const textColor = isDark ? '#d4d4d8' : '#52525b'; // zinc-300 vs zinc-600
    const gridColor = isDark ? '#27272a' : '#f4f4f5'; // zinc-800 vs zinc-100

    useEffect(() => {
        const fetchKlines = async () => {
            setLoading(true);
            try {
                let data = [];
                if (exchange === 'binance') {
                    const symbol = `${asset}USDT`;
                    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`);
                    const json = await response.json();
                    data = json.map(d => ({
                        time: d[0] / 1000,
                        open: parseFloat(d[1]),
                        high: parseFloat(d[2]),
                        low: parseFloat(d[3]),
                        close: parseFloat(d[4]),
                    }));
                } else if (exchange === 'okx') {
                    const instId = `${asset}-USDT`;
                    // Map generic interval to OKX format
                    const okxBar = interval.replace('h', 'H').replace('d', 'D');
                    const response = await fetch(`https://www.okx.com/api/v5/market/candles?instId=${instId}&bar=${okxBar}&limit=100`);
                    const json = await response.json();
                    if (json.data) {
                        data = json.data.reverse().map(d => ({
                            time: parseInt(d[0]) / 1000,
                            open: parseFloat(d[1]),
                            high: parseFloat(d[2]),
                            low: parseFloat(d[3]),
                            close: parseFloat(d[4]),
                        }));
                    }
                }
                setChartData(data);
            } catch (err) {
                console.error("Failed to fetch klines", err);
            } finally {
                setLoading(false);
            }
        };

        fetchKlines();
    }, [exchange, asset, interval]);

    useEffect(() => {
        if (!chartContainerRef.current || chartData.length === 0) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor: textColor,
            },
            grid: {
                vertLines: { color: gridColor },
                horzLines: { color: gridColor },
            },
            width: chartContainerRef.current.clientWidth,
            height: 160,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        // Determine precision based on the last close price
        const lastClose = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;
        let precision = 2;
        let minMove = 0.01;

        if (lastClose < 0.01 && lastClose > 0) {
            precision = 6;
            minMove = 0.000001;
        } else if (lastClose < 1.0) {
            precision = 4;
            minMove = 0.0001;
        } else if (lastClose < 10) {
            precision = 3;
            minMove = 0.001;
        }

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e', // green-500
            downColor: '#ef4444', // red-500
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
            priceFormat: {
                type: 'price',
                precision: precision,
                minMove: minMove,
            },
        });

        candlestickSeries.setData(chartData);
        chart.timeScale().fitContent();

        chartRef.current = chart;

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [chartData, backgroundColor, textColor, gridColor]);

    return (
        <div className="w-full mt-2 relative">
            <div className="flex justify-end gap-1 mb-1">
                {['1m', '3m', '5m', '15m', '1h', '4h', '1d'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setInterval(t)}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${interval === t
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <div ref={chartContainerRef} className="w-full h-[160px] rounded-lg overflow-hidden border border-zinc-100 dark:border-white/5" />
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/50 dark:bg-black/50 z-10 backdrop-blur-sm">
                    <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default ChartComponent;
