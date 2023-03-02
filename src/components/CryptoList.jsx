import React, { useState, useEffect } from "react";
import "../styles/CryptoList.css";
import FilterBar from "./FilterBar";
import { useDispatch } from "react-redux";
import { addFavorite } from "../store/favorites";


function useCoinGeckoData() {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    )
      .then((response) => response.json())
      .then((data) => setCryptoData(data))
      .catch((error) => console.log("error", error));
  }, []);

  return cryptoData;
}



function CryptoItem({ crypto, currency }) {
  const dispatch = useDispatch();

  const handleFavoriteClick = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      // User not logged in, show error message
      alert("Please log in to add favorites");
      return;
    }

    // Dispatch addFavorite action with the crypto ID
    dispatch(addFavorite(crypto.id));
  };
  const price = parseFloat(crypto.current_price).toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
  const percentChange = (
    parseFloat(crypto.price_change_percentage_24h) * 1
  ).toFixed(2);


  return (
    <div className={percentChange >= 0 ? "crypto-item" : "crypto-item-negatif"}>
      <div className="crypto-item-info">
        <div className="crypto-item-left">
          <img src={crypto.image} alt="" className="crypto-item-img" />
          <p className="ctypto-item-name">{crypto.name}</p>
          <div className="crypto-item-more">
            <p className="crypto-item-abr">{crypto.symbol.toUpperCase()}</p>
            <p className="crypto-item-abr">24H</p>
          </div>
        </div>
        <div className="crypto-item-right">
          <p className="crypto-item-price">{price}</p>
          <p
            className={
              percentChange >= 0
                ? "crypto-item-procent"
                : "crypto-item-procent-negatif"
            }
          >
            {percentChange > 0 ? "+" : ""}
            {percentChange}%
          </p>
          <svg
            width="43"
            height="43"
            viewBox="0 0 43 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleFavoriteClick} // Add click handler to the SVG
          >
            <path
              d="M25.9791 19.0813H17.0208M21.4999 14.7096V23.6679"
              stroke='white'
              stroke-width="3"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
             
            />
            <path
              d="M30.1357 3.58334H12.8641C9.04783 3.58334 5.94824 6.70084 5.94824 10.4992V35.7438C5.94824 38.9688 8.25949 40.3304 11.0903 38.7717L19.8337 33.9163C20.7653 33.3967 22.2703 33.3967 23.1841 33.9163L31.9274 38.7717C34.7582 40.3483 37.0695 38.9867 37.0695 35.7438V10.4992C37.0516 6.70084 33.952 3.58334 30.1357 3.58334Z"
              stroke='white'
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              
            />
            <path
              d="M21.5 33.8688L18.406 31.0342L14.9661 33.7757L15.8582 29.3339L12.9667 26.4686L17.4383 26.1133L21.5 22.8799L25.5618 26.1133L30.0333 26.4686L27.1418 29.3339L28.0339 33.7757L24.594 31.0342L21.5 33.8688Z"
              // Change fill based on isFavorite state
            />
          </svg>
        </div>
      </div>
      <div className="crypto-item-graph"></div>
    </div>
  );
}

export default function CryptoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const cryptoData = useCoinGeckoData();
  const [displayedCrypto, setDisplayedCrypto] = useState([]);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    setDisplayedCrypto(cryptoData);
  }, [cryptoData]);

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      const newCrypto = cryptoData.filter(
        (crypto) => !displayedCrypto.includes(crypto)
      );
      setDisplayedCrypto((prev) => [...prev, ...newCrypto]);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (event) => {
    setSortType(event.target.value);
  };
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const filteredCrypto = displayedCrypto.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let sortedCrypto = [...filteredCrypto];

  if (sortType === "market_cap") {
    sortedCrypto.sort((a, b) => b.market_cap - a.market_cap);
  } else if (sortType === "top_traded") {
    sortedCrypto.sort((a, b) => b.total_volume - a.total_volume);
  } else if (sortType === "top_gainer") {
    sortedCrypto.sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
  } else if (sortType === "top_loser") {
    sortedCrypto.sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    );
  }

  const convertedCrypto = sortedCrypto.map((crypto) => {
    const convertedPrice =
      currency === "EUR" ? crypto.current_price / 1.12 : crypto.current_price; // Convert prices to EUR if currency is EUR
    return {
      ...crypto,
      current_price: convertedPrice,
    };
  });

  return (
    <div>
      <FilterBar
        handleSearch={handleSearch}
        handleSort={handleSort}
        handleCurrencyChange={handleCurrencyChange} // Pass currency change handler to FilterBar
        searchTerm={searchTerm}
        sortType={sortType}
        currency={currency}
      />
      <div className="crypto-container-list" onScroll={handleScroll}>
        {convertedCrypto.map((crypto) => (
          <CryptoItem key={crypto.id} crypto={crypto} currency={currency} /> // Pass currency as prop to CryptoItem
        ))}
      </div>
    </div>
  );
}
