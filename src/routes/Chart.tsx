import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { useParams } from "react-router-dom";
import Apexchart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { isWhiteSpaceLike } from "typescript";
import { useTheme } from "styled-components";

interface ITicker {
  name: string;
  tickers: [
    {
      base: string;
      target: string;
      market: {
        name: string;
        identifier: string;
        has_trading_incentive: boolean;
        logo: string;
      };
      last: number;
      volume: number;
      cost_to_move_up_usd: number;
      cost_to_move_down_usd: number;
      converted_last: {
        btc: number;
        eth: number;
        usd: number;
      };
      converted_volume: {
        btc: number;
        eth: number;
        usd: number;
      };
      trust_score: string;
      bid_ask_spread_percentage: number;
      timestamp: string;
      last_traded_at: string;
      last_fetch_at: string;
      is_anomaly: boolean;
      is_stale: boolean;
      trade_url: string;
      token_info_url: string;
      coin_id: string;
      target_coin_id: string;
    }
  ];
}

interface IChartProps {
  coinId: string;
}

interface IHistory {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

function Chart({ coinId }: IChartProps) {
  const params = useParams();
  const Coin = coinId ?? params.coinId ?? "";
  const theme = useTheme();
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
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
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
      )}
    </div>
  );
}

export default Chart;
