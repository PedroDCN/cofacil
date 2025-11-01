import { formatDate } from "../../utils/dateUtil.ts";
import { getTransformedFluxoMomentumChartData } from "../../utils/dataUtil";
import { useQuery } from "@tanstack/react-query";
import { useChartInfo } from "../../contexts/chartcontext";
import { useApp } from "../../contexts/appContext";
import { getFluxoMomentum } from "../../services/fluxoService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Spinner } from "../ui/spinner.tsx";

function getLabels(datas: any): string[] {
  const weeks: string[] = [];

  let current = new Date();
  current.setHours(0, 0, 0, 0);

  datas.forEach((value: any) => {
    current = new Date(value);

    const formattedDate = `${getMonthName(
      current.getMonth()
    )} ${current.getDate()}, ${current.getFullYear()}`;
    weeks.push(formattedDate);
  });

  return weeks;
}

function getMonthName(monthIndex: number): string {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return months[monthIndex];
}

export default function FluxoMomentumChart(props: any) {
  const { timeContext } = useChartInfo();
  const { empresa } = useApp();

  if (!props.banco) {
    return <></>;
  }

  const { isLoading, data, error } = useQuery({
    queryKey: [
      "fluxoMomentumData",
      timeContext,
      empresa,
      props.banco,
      props.categoria,
    ],
    queryFn: async () =>
      getFluxoMomentum(
        empresa,
        props.banco,
        formatDate(timeContext.from),
        formatDate(timeContext.to),
        props.categoria
      ),
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Filler,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Fluxo de caixa momentum",
      },

      tooltip: {
        filter: function (tooltipItem: any) {
          // Only show tooltips for the "Aumento/Redução do Fluxo de Caixa" dataset
          return tooltipItem.datasetIndex === 0;
        },
      },
      legend: {
        labels: {
          filter: function (label: any) {
            if (label.text === "Aumento/Redução do Fluxo de Caixa") return true;
          },
        },
      },
    },

    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  if (data) {
    let parsed = getTransformedFluxoMomentumChartData(data);

    const labels = getLabels(parsed.datas);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Aumento/Redução do Fluxo de Caixa",
          data: parsed.creditos,
          fill: false,
          backgroundColor: "rgb(75, 192, 192)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 2,
          tension: 0.35,
        },
        {
          label: "nao_mostrar",
          fill: false,
          data: parsed.debitos,
          backgroundColor: "rgb(178, 210, 216)",
          borderColor: "rgb(178, 210, 216)",
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };

    const config = {
      type: "line",
      data: chartData,
    };

    return (
      <div>
        {isLoading ? (
          <Spinner size='large' className='mt-4' />
        ) : error ? (
          <>
            <p>Algo deu errado</p>
            <i
              className='pi pi-spin pi-cog'
              style={{ fontSize: "4rem", marginTop: "1rem" }}
            ></i>
          </>
        ) : (
          <>
            {/* <h3 className='titulo-grafico'>Fluxo de Caixa Momentum</h3> */}
            <div
              style={{
                minWidth: "900px",
                minHeight: "450px",
              }}
            >
              {/* @ts-ignore  */}
              <Line options={options} data={chartData} />
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
