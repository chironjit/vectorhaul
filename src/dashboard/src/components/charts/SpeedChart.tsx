import { Component, onMount, createEffect, onCleanup } from 'solid-js';
import { Chart, registerables } from 'chart.js';
import { theme } from '~/lib/stores';

Chart.register(...registerables);

interface SpeedChartProps {
  data: { timestamp: string; speed: number }[];
  height?: string;
}

const SpeedChart: Component<SpeedChartProps> = (props) => {
  let canvasRef: HTMLCanvasElement | undefined;
  let chartInstance: Chart | undefined;

  const getChartColors = () => {
    const isDark = theme() === 'dark';
    return {
      line: isDark ? '#60A5FA' : '#2563EB',
      fill: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)',
      grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      text: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    };
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const createChart = () => {
    if (!canvasRef) return;
    
    const colors = getChartColors();
    const labels = props.data.map(d => formatTime(d.timestamp));
    const speeds = props.data.map(d => d.speed);

    chartInstance = new Chart(canvasRef, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Speed (km/h)',
          data: speeds,
          borderColor: colors.line,
          backgroundColor: colors.fill,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: theme() === 'dark' ? '#1F2937' : '#FFFFFF',
            titleColor: colors.text,
            bodyColor: colors.text,
            borderColor: colors.grid,
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.y} km/h`,
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: colors.grid,
            },
            ticks: {
              color: colors.text,
              maxTicksLimit: 8,
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              color: colors.grid,
            },
            ticks: {
              color: colors.text,
              callback: (value) => `${value} km/h`,
            },
          },
        },
      },
    });
  };

  onMount(() => {
    createChart();
  });

  createEffect(() => {
    // Re-render chart when theme changes
    theme();
    if (chartInstance) {
      chartInstance.destroy();
      createChart();
    }
  });

  createEffect(() => {
    // Update data
    if (chartInstance && props.data) {
      const labels = props.data.map(d => formatTime(d.timestamp));
      const speeds = props.data.map(d => d.speed);
      
      chartInstance.data.labels = labels;
      chartInstance.data.datasets[0].data = speeds;
      chartInstance.update('none');
    }
  });

  onCleanup(() => {
    chartInstance?.destroy();
  });

  return (
    <div style={{ height: props.height || '200px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpeedChart;
