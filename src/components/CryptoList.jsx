import React, { useState, useEffect } from "react";
import "../styles/CryptoList.css";
import FilterBar from "./FilterBar";
import { useRecoilState } from "recoil";
import { userStateLogin } from "../pages/Login";
import { FaStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import useAxios from "../hooks/useAxios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import Skeleton from "../components/Skeleton";
import { useNavigate } from 'react-router-dom';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function useCoinGeckoData() {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false"
    )
      .then((response) => response.json())
      .then((data) => setCryptoData(data))
      .catch((error) => console.log("error", error));
  }, []);

  return cryptoData;
}

function CryptoItem({ crypto, currency }) {
  const [user, setUser] = useRecoilState(userStateLogin);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    setUser({ token, email });
  }, [setUser]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkLikedStatus = async () => {
      try {
        const response = await axios.get(
          `https://cryptohub-auth-app.herokuapp.com/user/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.data.likedArticles.includes(crypto.id)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user.token && user.likedArticles) {
      checkLikedStatus();
    }
  }, [crypto.id, user]);

  const price = parseFloat(crypto.current_price).toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
  const percentChange = (
    parseFloat(crypto.price_change_percentage_24h) * 1
  ).toFixed(2);

  // function isCryptoLiked(crypto, user) {
  //   if (user && user.likedArticles) {
  //     return user.likedArticles.includes(crypto.id);
  //   } else {
  //     return false;
  //   }
  // }

  const handleLikeClick = () => {
    if (!user) {
      return;
    }

    if (isLiked) {
      axios
        .delete("https://cryptohub-auth-app.herokuapp.com/Like", {
          data: { token: user.token, article: crypto.id },
        })
        .then((response) => {
          console.log(response.data); // handle response data
          setIsLiked(false);
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error); // handle error
        });
    } else {
      axios
        .post("https://cryptohub-auth-app.herokuapp.com/Like", {
          token: user.token,
          article: crypto.id,
        })
        .then((response) => {
          console.log(response.data); // handle response data
          setIsLiked(true);
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error); // handle error
          toast.error("You need to login to add to favorit");
        });
    }
  };

  const HistoryChart = () => {
    const { response } = useAxios(
      `coins/${crypto.id}/market_chart?vs_currency=usd&days=1`
    );

    if (!response) {
      return (
        <div className="wrapper-container mt-8">
          <Skeleton className="h-72 w-full mb-10" />
        </div>
      );
    }
    const coinChartData = response.prices.map((value) => ({
      x: value[0],
      y: value[1].toFixed(2),
    }));

    const options = {
      type: "line",
      responsive: true,
    };
    const data = {
      labels: coinChartData.map((value) => moment(value.x).format("MMM DD")),
      datasets: [
        {
          pointStyle: false,
          label: crypto.id,
          data: coinChartData.map((val) => val.y),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };

    return (
      <div>
        <Line options={options} data={data} />
      </div>
    );
  };

  const navigate = useNavigate();

  const handleCryptoClick = (id) => {
    navigate(`/crypto/${id}`);
  };


  return (
    <div className={percentChange >= 0 ? "crypto-item" : "crypto-item-negatif"}>
      <div className="crypto-item-info">
        <div className="crypto-item-left">
          <img src={crypto.image} alt="" className="crypto-item-img" />
          <p className="ctypto-item-name" onClick={() => handleCryptoClick(crypto.id)}>{crypto.name}</p>
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
          <FaStar
            color={isLiked ? "yellow" : "white"}
            fontSize="35px"
            onClick={handleLikeClick}
          />
        </div>
      </div>
      <Toaster />
      
      <HistoryChart />
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
          <CryptoItem
            key={crypto.id}
            crypto={crypto}
            currency={currency}
            user
          /> // Pass currency as prop to CryptoItem
        ))}
      </div>
    </div>
  );
}
