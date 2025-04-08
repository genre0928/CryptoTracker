import {
  Link,
  Route,
  Routes,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
import Navigation from "../Navigation";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<TabProps>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

interface TabProps {
  $isActive: boolean;
}

interface ICoin {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: {
    currency: string;
    percentage: number;
    times: number;
  };
  symbol: string;
  total_supply: number;
  total_volume: number;
}

function Coin() {
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation();
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const { isLoading, data: fallbackCoin } = useQuery<ICoin[]>(
    ["Coin", coinId],
    fetchCoins,
    { refetchInterval: 5000, enabled: !state }
  );
  const coin: ICoin | undefined =
    state ?? fallbackCoin?.find((c) => c.id === coinId);

  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : isLoading ? "Loading..." : coin?.name}
        </Title>
      </Header>
      <Navigation />
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank</span>
              <span>{coin?.market_cap_rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol</span>
              <span>${coin?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Current Price:</span>
              <span>
                {coin?.current_price || coin?.current_price !== null
                  ? Number(coin?.current_price.toFixed(2)).toLocaleString(
                      "ko-KR",
                      {
                        maximumFractionDigits: 4,
                      }
                    )
                  : ""}
              </span>
            </OverviewItem>
          </Overview>
          <Description></Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply</span>
              <span>
                {coin?.total_supply || coin?.total_supply !== null
                  ? Number(coin?.total_supply.toFixed(2)).toLocaleString(
                      "ko-KR",
                      {
                        maximumFractionDigits: 4,
                      }
                    )
                  : ""}
              </span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>
                {coin?.max_supply || coin?.max_supply !== null
                  ? Number(coin?.max_supply.toFixed(2)).toLocaleString(
                      "ko-KR",
                      {
                        maximumFractionDigits: 4,
                      }
                    )
                  : ""}
              </span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab $isActive={chartMatch !== null}>
              <Link to={`/${coinId}/Chart`}>chart</Link>
            </Tab>
            <Tab $isActive={priceMatch !== null}>
              <Link to={`/${coinId}/Price`}>Price</Link>
            </Tab>
          </Tabs>
          <Routes>
            <Route path="price" element={<Price coinId={coinId!} />}></Route>
            <Route path="chart" element={<Chart coinId={coinId!} />}></Route>
          </Routes>
        </>
      )}
    </Container>
  );
}
export default Coin;
