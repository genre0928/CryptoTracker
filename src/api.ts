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

const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-9o6d1ZmRrViSs2G8iCgCR3cY	",
  },
};

export async function fetchCoins() {
  const res = await fetch(url, options);
  const json = await res.json();

  return json as ICoin[];
}

export async function fetchTickers(coinId: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/tickers`,
    options
  );
  const json = await res.json();

  return json as ITicker[];
}

export async function fetchCoinHistory(coinId: string, days: number) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`,
    options
  );
  const json = await res.json();

  return json;
}

export async function fetchPrice(coinId: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`,
    options
  );
  const json = await res.json();

  return json;
}
