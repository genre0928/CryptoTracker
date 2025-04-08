import Apexchart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { useParams } from "react-router-dom";
import { useTheme } from "styled-components";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";

interface IChartProps {
  coinId: string;
}

function CandleChart({ coinId }: IChartProps) {
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

  const candleData =
    data?.map((d) => ({
      x: new Date(d[0]),
      y: [d[1], d[2], d[3], d[4]], // [open, high, low, close]
    })) ?? [];

  return (
    <Apexchart
      type="candlestick"
      series={[
        {
          data: candleData,
        },
      ]}
      options={{
        chart: {
          type: "candlestick",
          height: 500,
          toolbar: { show: false },
          foreColor: theme.textColor,
        },
        plotOptions : {
            candlestick : {
                colors : {
                    upward : "#3b82f6",
                    downward : "#ef4444"
                }
            }
        },
        xaxis: {
          type: "datetime",
          labels: {
            rotate: 0,
          },
        },
        yaxis: {
          tooltip: { enabled: true },
          labels: {
            formatter: (v) => {
              return Number(v.toFixed(2)).toLocaleString("ko-KR", {
                maximumFractionDigits: 4,
              });
            },
          },
        },
        title: {
          text: `${Coin} Candle Chart`,
          floating: true,
          offsetX: 10,
          style: {
            color: theme.textColor,
          },
        },
      }}
    />
  );
}

export default CandleChart;
