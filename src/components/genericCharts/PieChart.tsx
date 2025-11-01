import { forwardRef, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { moneyFormatter } from "@/utils/moneyUtil";

const myColors = [
  "#16415e",
  "#20618d",
  "#2b82bc",
  "#36a2eb",
  "#5eb5ef",
  "#86c7f3",
  "#afdaf7",
  "#d7ecfb",
];

export const PieChart = forwardRef(function PieChart(
  props: any,
  chartRef: any
) {
  const { labels, values } = props.data;
  const data: any = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: myColors,
      },
    ],
  };
  const options = {
    cutout: "60%",
    maintainAspectRatio: false,
    aspectRatio: 1.5,
    responsive: true,
    plugins: {
      legend: {
        position: "left",
        align: "center",
        labels: {
          boxWidth: 35,
        },
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
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const label = labels[elements[0].index];
        props.dispatchCallback?.(label);
      }
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
      <Doughnut ref={chartRef} options={options} data={data} />
    </>
  );
});
