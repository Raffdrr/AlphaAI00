import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { CandleData } from '../types';

interface StockChartProps {
    data: number[];
    candles: CandleData[];
    chartType: 'LINE' | 'CANDLE';
    isPositive: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ data, candles, chartType, isPositive }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#bdc1c6',
            },
            grid: {
                vertLines: { color: '#3c4043', visible: false },
                horzLines: { color: '#3c4043', visible: false },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                borderColor: '#3c4043',
                timeVisible: true,
            },
            rightPriceScale: {
                borderColor: '#3c4043',
            },
        });

        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    useEffect(() => {
        if (!chartRef.current) return;

        // Remove old series
        if (seriesRef.current) {
            chartRef.current.removeSeries(seriesRef.current);
        }

        const color = isPositive ? '#81c995' : '#f28b82';

        if (chartType === 'LINE') {
            const areaSeries = chartRef.current.addAreaSeries({
                lineColor: color,
                topColor: isPositive ? 'rgba(129, 201, 149, 0.2)' : 'rgba(242, 139, 130, 0.2)',
                bottomColor: 'rgba(0, 0, 0, 0)',
                lineWidth: 2,
            });

            // Map simple number array to Time/Value for chart
            // Mocking time for simple line data if not provided
            const chartData = data.map((val, i) => ({
                time: (Date.now() / 1000) - ((data.length - i) * 300) as Time, // Mock time
                value: val
            }));

            areaSeries.setData(chartData);
            seriesRef.current = areaSeries;
        } else {
            const candleSeries = chartRef.current.addCandlestickSeries({
                upColor: '#81c995',
                downColor: '#f28b82',
                borderVisible: false,
                wickUpColor: '#81c995',
                wickDownColor: '#f28b82',
            });

            // Ensure candles have valid timestamps
            const validCandles = candles.map((c, i) => ({
                time: (Date.now() / 1000) - ((candles.length - i) * 300) as Time, // Mock time if string
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close
            }));

            candleSeries.setData(validCandles);
            seriesRef.current = candleSeries;
        }

        chartRef.current.timeScale().fitContent();

    }, [data, candles, chartType, isPositive]);

    return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};

export default StockChart;
