import { formatDate } from "../../utils/dateUtil.ts";
import { getTransformedFluxoSemanalChartData } from "../../utils/dataUtil";
import { useQuery } from "@tanstack/react-query";
import { useChartInfo } from "../../contexts/chartcontext";
import { useApp } from "../../contexts/appContext";
import { getFluxoSemanal } from "../../services/fluxoService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
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

export default function FluxoSemanalChart(props: any) {
  const { timeContext } = useChartInfo();
  const { empresa } = useApp();

  if (!props.banco) {
    return <></>;
  }

  const { isLoading, data, error } = useQuery({
    queryKey: [
      "fluxoSemanalData",
      timeContext,
      empresa,
      props.banco,
      props.categoria,
    ],
    queryFn: async () =>
      getFluxoSemanal(
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
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Fluxo de caixa semanal",
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
    let parsed = getTransformedFluxoSemanalChartData(data);

    const labels = getLabels(parsed.datas);

    const chartData = {
      labels,
      datasets: [
        {
          label: "Crédito",
          data: parsed.creditos,
          backgroundColor: "rgb(75, 192, 192)",
        },
        {
          label: "Débito",
          data: parsed.debitos,
          backgroundColor: "rgb(255, 99, 132)",
        },
      ],
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
            {/* <h3 className='titulo-grafico'>Fluxo de Caixa Semanal</h3> */}
            <div
              style={{
                minWidth: "900px",
                minHeight: "450px",
              }}
            >
              <Bar options={options} data={chartData} />
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
