import { forwardRef, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import { moneyFormatter } from "../../utils/moneyUtil";

export const TwoColumnBarChart = forwardRef(function TwoColumnBarChart(
  props: any,
  chartRef: any
) {
  const data: any = {
    labels: props.label,
    datasets: [
      {
        label: props.label[0],
        data: [props.data.vendas, 0],
      },
      {
        label: props.label[1],
        data: [0, Math.abs(props.data.despesas)],
      },
    ],
  };
  const options = {
    indexAxis: "y",
    // maintainAspectRatio: false,
    // aspectRatio: 1,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        animation: false,
        callbacks: {
          label: (label: any) => {
            return `${moneyFormatter(label.raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          // display: false,
        },
        grid: {
          display: false,
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
