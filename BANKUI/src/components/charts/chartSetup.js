import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Global chart look & feel
ChartJS.defaults.font.family =
  "'Inter', ui-sans-serif, system-ui, sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = '#6b7280';
ChartJS.defaults.borderColor = 'rgba(229, 231, 235, 0.8)';
ChartJS.defaults.plugins.legend.labels.boxWidth = 10;
ChartJS.defaults.plugins.legend.labels.boxHeight = 10;
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1f2937';
ChartJS.defaults.plugins.tooltip.titleColor = '#ffffff';
ChartJS.defaults.plugins.tooltip.bodyColor = '#e5e7eb';
ChartJS.defaults.plugins.tooltip.cornerRadius = 6;
ChartJS.defaults.plugins.tooltip.padding = 10;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CHART_COLORS = {
  deposit: '#22c55e',
  withdrawal: '#ef4444',
  transfer: '#f59e0b',
  credit: '#3b82f6',
};
