import { forwardRef, useEffect } from "react";
import { Chart } from "react-chartjs-2";
// @ts-ignore
import { moneyFormatter, percentFormatter } from "../../utils/moneyUtil";

export const TwoDataChart = forwardRef(function TwoDataChart(
  props: any,
  chartRef: any
) {
  // const { labels, values } = props.data;
  const [data1, data2] = props.data;
  const data: any = {
    labels: data1.labels,
    datasets: [
      {
        label: "Custo Fixo",
        data: data1.values,
      },
      {
        label: "Custo Variável",
        data: data2.values,
      },
    ],
  };
  const options = {
    aspectRatio: 7 / 5,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: (value: number) => `${moneyFormatter(value)}`,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        animation: false,
        callbacks: {
          label: (label: any) =>
            `${label.dataset.label}: ${moneyFormatter(label.raw)}`,
        },
      },
    },
    ...props.options,
  };

  useEffect(() => {
    const updateChart = () => {
      if (chartRef != null) {
        chartRef.current.resize();
      }
    };
    window.addEventListener("resize", updateChart);

    return () => {
      window.removeEventListener("resize", updateChart);
    };
  }, []);

  return (
    <>
      <Chart ref={chartRef} type='bar' options={options} data={data} />
    </>
  );
});
