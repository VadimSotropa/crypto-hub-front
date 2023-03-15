import React, { useState, useEffect } from "react";
import '../styles/ExchangeCrytpoList.css'
function useCoinGeckoData() {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
    )
      .then((response) => response.json())
      .then((data) => setCryptoData(data))
      .catch((error) => console.log("error", error));
  }, []);

  return cryptoData;
}

function CryptoItem({ crypto }) {
  const price = parseFloat(crypto.current_price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const percentChange = (
    parseFloat(crypto.price_change_percentage_24h) * 1
  ).toFixed(2);

  return (
    <div>
      <div className={percentChange >= 0 ? "exchange-list-container" : "exchange-list-container-negatif"}>
        <img src={crypto.image} alt="" className="exchange-list-image"/>
        <p className="exchange-list-name">{crypto.name}</p>
          <p className="exchange-list-symbole">{crypto.symbol.toUpperCase()}</p>
          <p className="exchange-list-percent">{percentChange > 0 ? "+" : ""}{percentChange}%</p>
        
        <p className="exchange-list-price">{price}</p>
      </div>
    </div>
  );
}

export default function ExchangeCryptoList() {
  const cryptoData = useCoinGeckoData();

  return (
    <div>
      {cryptoData.map((crypto) => (
        <CryptoItem key={crypto.id} crypto={crypto} />
      ))}
    </div>
  );
}