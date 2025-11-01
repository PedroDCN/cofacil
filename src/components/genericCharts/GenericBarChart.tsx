import { forwardRef, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import { moneyFormatter, percentFormatter } from "../../utils/moneyUtil";

export const GenericBarChart = forwardRef(function GenericBarChart(
  props: any,
  chartRef: any
) {
  const { labels, values } = props.data;
  let dvalues = values;
  if (typeof values[0] === "object") {
    dvalues = values.map((value: number[]) => value[0]);
  }
  const data: any = {
    labels,
    datasets: [
      {
        label: props.label,
        data: dvalues,
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
          callback: (value: number) => {
            if (props.type === "percentage") {
              return `${percentFormatter(value)}`;
            }
            return `${moneyFormatter(value)}`;
          },
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
          label: (label: any) => {
            if (typeof values[0] === "object") {
              return `${label.dataset.label}: ${moneyFormatter(
                label.raw
              )} // ${percentFormatter(values[label.dataIndex][1])}`;
            } else {
              if (props.type === "percentage") {
                return `${label.dataset.label}: ${percentFormatter(label.raw)}`;
              }
              return `${label.dataset.label}: ${moneyFormatter(label.raw)}`;
            }
          },
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
