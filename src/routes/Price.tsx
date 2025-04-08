import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchPrice } from "../api";
import styled from "styled-components";

interface IChartProps {
  coinId: string;
}

interface IPrice {
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
  max_supply: null;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: null;
  symbol: string;
  total_supply: number;
  total_volume: number;
}

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  padding: 0px 20px;
  max-width: 960px;
  margin: 0 auto;
  flex-wrap: wrap;
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 10px;
`;
const Title = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.accentColor};
  margin-bottom: 10px;
`;
const Contents = styled.div`
  max-width: 120px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: ${(props) => props.theme.textColor};
`;

function Price({ coinId }: IChartProps) {
  const { isLoading, data } = useQuery<IPrice[]>(coinId, () =>
    fetchPrice(coinId)
  );
  const params = useParams();
  const Coin = coinId ?? params.coinId ?? "";
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <Items>
        <Title>
          ⏰ 24시간 가격 변화
          <Contents>
            <div>
              현재가 :{" "}
              {Number(data[0]?.current_price.toFixed(2)).toLocaleString(
                "ko-KR",
                { maximumFractionDigits: 4 }
              )}
            </div>
            <div>
              고가:{" "}
              {Number(data[0]?.high_24h.toFixed(2)).toLocaleString("ko-KR", {
                maximumFractionDigits: 4,
              })}
            </div>
            <div>
              저가:{" "}
              {Number(data[0]?.low_24h.toFixed(2)).toLocaleString("ko-KR", {
                maximumFractionDigits: 4,
              })}
            </div>
            <div>
              변동률:{" "}
              {Number(data[0]?.price_change_24h.toFixed(2)).toLocaleString(
                "ko-KR",
                { maximumFractionDigits: 4 }
              )}
            </div>
          </Contents>
        </Title>
      </Items>
      <Items>
        <Title>
          💹 시장 정보
          <Contents>
            <div>시가총액 순위 : {data[0]?.market_cap_rank}</div>
            <div>
              시가총액:{" "}
              {Number(data[0]?.market_cap.toFixed(2)).toLocaleString("ko-KR", {
                maximumFractionDigits: 4,
              })}
            </div>
            <div>
              거래량:{" "}
              {Number(data[0]?.total_volume.toFixed(2)).toLocaleString(
                "ko-KR",
                { maximumFractionDigits: 4 }
              )}
            </div>
          </Contents>
        </Title>
      </Items>
      <Items>
        <Title>
          💙 기타
          <Contents>
            <div>
              유통량 :{" "}
              {Number(data[0]?.circulating_supply.toFixed(2)).toLocaleString(
                "ko-KR",
                { maximumFractionDigits: 4 }
              )}
            </div>
            <div>최대 발행량 : {data[0]?.max_supply ?? "-"}</div>
            <div>
              역대 최고가 : $
              {Number(data[0]?.ath.toFixed(2)).toLocaleString("ko-KR", {
                maximumFractionDigits: 4,
              })}
            </div>
          </Contents>
        </Title>
      </Items>
    </Container>
  );
}

export default Price;
