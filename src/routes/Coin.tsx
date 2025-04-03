import { useParams } from "react-router-dom";

function Coin() {
  const { coinId } = useParams();

  if (!coinId) {
    return <h1>코인 ID 없음</h1>;
  }
  return <h1>Coin : {coinId}</h1>;
}
export default Coin;
