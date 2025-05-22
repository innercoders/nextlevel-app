import { ChartConfiguration } from "chart.js";

const whiteColor = 'rgb(255, 255, 255)';
const whiteBgColor = 'rgba(255, 255, 255, 0.2)';
const radiantColor = 'rgba(102, 187, 106, 1)';
const direColor = 'rgba(244, 67, 54, 1)';
const radiantBgColor = 'rgba(102, 187, 106, 0.2)';
const direBgColor = 'rgba(244, 67, 54, 0.2)';

export const lineChartData: ChartConfiguration['data'] = {
    datasets: [
        {
            data: [],
            label: 'Vantagem de Ouro',
            backgroundColor: whiteBgColor,
            borderColor: whiteColor,
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: 'origin',
            segment: {
                borderColor: ctx => getSegmentColor(ctx, true),
                backgroundColor: ctx => getSegmentColor(ctx, false),
            }
        },
        {
            data: [],
            label: 'Vantagem de Experiência',
            backgroundColor: whiteBgColor,
            borderColor: whiteColor,
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: 'origin',
            segment: {
                borderColor: 'rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
        },
    ],
    labels: [],
};

export const lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        line: {
            tension: 0.1
        },
        point: {
            backgroundColor: '#ffffff',
            borderColor: (ctx) => {
                if (ctx.datasetIndex !== undefined && ctx.dataIndex !== undefined && ctx.dataset?.data) {
                    const value = ctx.dataset.data[ctx.dataIndex] as number;
                    return value >= 0 ? radiantColor : direColor;
                }
                return '';
            },
            hoverBackgroundColor: '#ffffff',
            hoverBorderColor: (ctx) => {
                if (ctx.datasetIndex !== undefined && ctx.dataIndex !== undefined && ctx.dataset?.data) {
                    const value = ctx.dataset.data[ctx.dataIndex] as number;
                    return value >= 0 ? radiantColor : direColor;
                }
                return '';
            },
            borderWidth: 2,
            hoverBorderWidth: 3
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Minutos',
                color: 'white'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.4)'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Vantagem',
                color: 'white'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.4)',
                callback: function(value) {
                    return Math.abs(Number(value)).toLocaleString();
                }
            }
        }
    },
    plugins: {
        legend: { 
            display: false,
        },
        tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
                title: (tooltipItems) => {
                    return `${tooltipItems[0].label}:00`;
                },
                label: (context) => {
                    const datasetLabel = context.dataset.label || '';
                    const value = context.parsed.y;
                    const formattedValue = value.toLocaleString();
                    return `${datasetLabel}: ${formattedValue}`;
                },
                labelColor: (context) => {
                    const value = context.parsed.y;
                    const color = value >= 0 ? radiantColor : direColor;
                    return {
                        borderColor: color,
                        backgroundColor: color
                    };
                }
            }
        }
    }
};

function getSegmentColor(ctx: any, isBorder: boolean): string {
    if (!ctx || !ctx.p0 || !ctx.p1) return isBorder ? radiantColor : radiantBgColor;
    
    const p0Value = ctx.p0.parsed.y;
    const p1Value = ctx.p1.parsed.y;
    
    if (p0Value >= 0 && p1Value >= 0) {
        return isBorder ? radiantColor : radiantBgColor;
    }
    
    if (p0Value < 0 && p1Value < 0) {
        return isBorder ? direColor : direBgColor;
    }

    return p1Value >= 0 
        ? (isBorder ? radiantColor : radiantBgColor)
        : (isBorder ? direColor : direBgColor);
}