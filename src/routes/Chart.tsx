import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { useParams } from "react-router-dom";
import Apexchart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { isWhiteSpaceLike } from "typescript";
import styled, { useTheme } from "styled-components";
import LineChart from "./LineChart";
import { useState } from "react";
import CandleChart from "./CandleChart";

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

interface TabProps {
  $isActive: boolean;
}

const Wrapper = styled.div`
  width: 100%;
  height: 600px;
`;
const SelectChart = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Button = styled.div<TabProps>`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  width: 25px;
  height: 40px;
  cursor: pointer;
  margin-left: 10px;
  div {
    font-size: 0.5rem;
  }
  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};
`;
function Chart({ coinId }: IChartProps) {
  const params = useParams();
  const Coin = coinId ?? params.coinId ?? "";
  const theme = useTheme();
  const [chartType, setChartType] = useState("line");
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
        <Wrapper>
          <SelectChart>
            <Button
              $isActive={chartType == "line"}
              onClick={() => setChartType("line")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                />
              </svg>
              <div>Chart</div>
            </Button>
            <Button
              $isActive={chartType == "candle"}
              onClick={() => setChartType("candle")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                />
              </svg>
              <div>Candle</div>
            </Button>
          </SelectChart>
          {chartType == "line" ? (
            <LineChart coinId={coinId} />
          ) : (
            <CandleChart coinId={coinId} />
          )}
        </Wrapper>
      )}
    </div>
  );
}

export default Chart;
