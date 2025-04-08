import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import Apexchart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { useTheme } from "styled-components";

interface IChartProps {
  coinId: string;
}

function LineChart({ coinId }: IChartProps) {
  const params = useParams();
  const theme = useTheme();
  const Coin = coinId ?? params.coinId ?? "";
  const { isLoading, data } = useQuery<
    [number, number, number, number, number][]
  >(["History", Coin], () => fetchCoinHistory(Coin, 1));

  const timeLabels =
    data?.map((d) => {
      const date = new Date(d[0]);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }) ?? [];

  return (
    <Apexchart
      type="line"
      series={[
        {
          name: "open",
          data: data?.map((d) => d[1]) ?? [],
        },
        {
          name: "close",
          data: data?.map((d) => d[4]) ?? [],
        },
      ]}
      options={{
        chart: {
          height: 500,
          width: 500,
          foreColor: theme.textColor,
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        tooltip: {
          enabled: true,
          style: {},
        },
        xaxis: {
          categories: timeLabels,
          tickAmount: 5,
          labels: {
            rotate: 0,
          },
        },
        yaxis: {
          labels: {
            formatter: (v) => {
              return Number(v.toFixed(2)).toLocaleString("ko-KR", {
                maximumFractionDigits: 4,
              });
            },
          },
        },
        labels: ["open", "close"],
        title: {
          text: `${Coin} Graph`,
          floating: true,
          offsetX: 47,
          style: {
            color: theme.textColor,
          },
        },
      }}
    />
  );
}

export default LineChart;
