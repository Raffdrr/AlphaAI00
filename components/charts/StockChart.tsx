import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { CandleData } from '../../types';

interface StockChartProps {
    data: number[];
    candles: CandleData[];
    chartType: 'LINE' | 'CANDLE';
    isPositive: boolean;
    comparisonData?: number[];
}

const StockChart: React.FC<StockChartProps> = ({ data, candles, chartType, isPositive, comparisonData }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null>(null);
    const comparisonSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    // Initialize chart once
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
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    // Update chart data when props change
    useEffect(() => {
        if (!chartRef.current) return;

        // Remove old series if exists
        if (seriesRef.current) {
            try {
                chartRef.current.removeSeries(seriesRef.current);
                seriesRef.current = null;
            } catch (e) {
                console.error('Error removing series:', e);
            }
        }

        const color = isPositive ? '#81c995' : '#f28b82';

        try {
            if (chartType === 'LINE' && data && data.length > 0) {
                const areaSeries = chartRef.current.addAreaSeries({
                    lineColor: color,
                    topColor: isPositive ? 'rgba(129, 201, 149, 0.2)' : 'rgba(242, 139, 130, 0.2)',
                    bottomColor: 'rgba(0, 0, 0, 0)',
                    lineWidth: 2,
                });

                const chartData = data.map((val, i) => ({
                    time: (Date.now() / 1000) - ((data.length - i) * 300) as Time,
                    value: val
                }));

                areaSeries.setData(chartData);
                seriesRef.current = areaSeries;
            } else if (chartType === 'CANDLE' && candles && candles.length > 0) {
                const candleSeries = chartRef.current.addCandlestickSeries({
                    upColor: '#81c995',
                    downColor: '#f28b82',
                    borderVisible: false,
                    wickUpColor: '#81c995',
                    wickDownColor: '#f28b82',
                });

                const validCandles = candles.map((c, i) => ({
                    time: (Date.now() / 1000) - ((candles.length - i) * 300) as Time,
                    open: c.open,
                    high: c.high,
                    low: c.low,
                    close: c.close
                }));

                candleSeries.setData(validCandles);
                seriesRef.current = candleSeries;
            }

            // Handle comparison data
            if (comparisonData && comparisonData.length > 0) {
                if (comparisonSeriesRef.current) {
                    try {
                        chartRef.current.removeSeries(comparisonSeriesRef.current);
                    } catch (e) {
                        console.error('Error removing comparison series:', e);
                    }
                }

                const lineSeries = chartRef.current.addLineSeries({
                    color: '#c58af9',
                    lineWidth: 2,
                    lineStyle: 2,
                });

                const compChartData = comparisonData.map((val, i) => ({
                    time: (Date.now() / 1000) - ((comparisonData.length - i) * 300) as Time,
                    value: val
                }));

                lineSeries.setData(compChartData);
                comparisonSeriesRef.current = lineSeries;
            } else if (comparisonSeriesRef.current) {
                try {
                    chartRef.current.removeSeries(comparisonSeriesRef.current);
                    comparisonSeriesRef.current = null;
                } catch (e) {
                    console.error('Error removing comparison series:', e);
                }
            }

            chartRef.current.timeScale().fitContent();
        } catch (error) {
            console.error('Error updating chart:', error);
        }

    }, [data, candles, chartType, isPositive, comparisonData]);

    // Show loading state if no data
    if ((!data || data.length === 0) && (!candles || candles.length === 0)) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center text-[#bdc1c6]">
                <div className="text-center">
                    <div className="animate-pulse mb-2">Caricamento grafico...</div>
                    <div className="text-xs text-gray-500">Attendere i dati di mercato</div>
                </div>
            </div>
        );
    }

    return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};

export default StockChart;
