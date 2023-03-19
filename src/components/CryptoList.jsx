import React, { useState, useEffect } from "react";
import "../styles/CryptoList.css";
import FilterBar from "./FilterBar";
import { useRecoilState, atom } from "recoil";
import { userStateLogin } from "../pages/Login";
import { FaStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

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
export const cryptoDataState = atom({
  key: "cryptoDataState",
  default: [],
});

function useCoinGeckoData() {
  const [cryptoData, setCryptoData] = useRecoilState(cryptoDataState);

  useEffect(() => {
    const fetchData = async () => {
      let storedData = localStorage.getItem("cryptoData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCryptoData(parsedData);
        console.log("from local store");
        // Check if data needs to be updated
        const lastUpdated = localStorage.getItem("lastUpdated");
        if (lastUpdated && Date.now() - lastUpdated > 10 * 60 * 1000) {
          console.log("updating data");
          localStorage.removeItem("cryptoData");
          localStorage.removeItem("lastUpdated");
        }
      } else {
        // Fetch data from API
        const response = await fetch("https://api.coinpaprika.com/v1/coins");
        const data = await response.json();
        const topTenCryptos = data.slice(0, 9);
        console.log("from api");
        const cryptoData = await Promise.all(
          topTenCryptos.map((crypto) =>
            fetch(`https://api.coinpaprika.com/v1/coins/${crypto.id}`).then(
              (response) => response.json()
            )
          )
        );

        const tickersResponse = await fetch(
          "https://api.coinpaprika.com/v1/tickers"
        );
        const tickers = await tickersResponse.json();

        const prices = {};
        const percentChanges = {};

        tickers.forEach((ticker) => {
          prices[ticker.id] = ticker.quotes.USD.price;
          percentChanges[ticker.id] = ticker.quotes.USD.percent_change_24h;
        });

        // Merging price and percent change data with crypto data
        const cryptoDataWithPriceAndPercentChange = cryptoData.map((crypto) => ({
          ...crypto,
          price: prices[crypto.id],
          percent_change_24h: percentChanges[crypto.id],
        }));

        // Save data to localStorage
        localStorage.setItem(
          "cryptoData",
          JSON.stringify(cryptoDataWithPriceAndPercentChange)
        );
        localStorage.setItem("lastUpdated", Date.now());
        
        // Set interval to delete data from local storage every 10 minutes
        setInterval(() => {
          console.log('deleting data from local storage');
          localStorage.removeItem("cryptoData");
          localStorage.removeItem("lastUpdated");
        }, 10 * 60 * 1000);

        // Update state with fetched data
        setCryptoData(cryptoDataWithPriceAndPercentChange);
      }
    };

    // Fetch data on mount
    fetchData();
  }, [setCryptoData]);

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

  const price = parseFloat(crypto.price).toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
  const percentChange = (
    parseFloat(crypto.percent_change_24h) * 1
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
      const [coinChartData, setCoinChartData] = useState([]);
    
      const fetchData = async () => {
        try {
          const start = moment().subtract(168, "hours").format("YYYY-MM-DD");
          const response = await axios.get(
            `https://api.coinpaprika.com/v1/tickers/${crypto.id}/historical?start=${start}&interval=1d`
          );
          const chartData = response.data.map((value) => ({
            x: new Date(value.timestamp).getTime(),
            y: value.price.toFixed(2),
          }));
          setCoinChartData(chartData);
    
          // Save data to localStorage
          localStorage.setItem(
            `coinChartData-${crypto.id}`,
            JSON.stringify(chartData)
          );
        } catch (error) {
          console.log("Error fetching chart data: ", error);
        }
      };
    
      useEffect(() => {
        // Check if chart data is in localStorage
        const storedData = localStorage.getItem(`coinChartData-${crypto.id}`);
        
        if (storedData) {
          setCoinChartData(JSON.parse(storedData));
          console.log("chart local");
          
        } else {
          fetchData();
          console.log("chart api");
          
        }

      }, []);
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          fetchData();
        }, 10 * 60 * 1000);
    
        return () => clearInterval(intervalId);
      }, []);
    
      const options = {
        type: "line",
        responsive: true,
      };
      const data = {
        labels: coinChartData.map((value) => moment(value.x).format("MMM DD")),
        datasets: [
          {
            pointStyle: false,
            label: crypto.name,
            data: coinChartData.map((val) => val.y),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      };
  
    return (
      <div>
        {coinChartData.length > 0 ? (
          <Line options={options} data={data} />
        ) : (
          <div className="wrapper-container mt-8">
            <Skeleton className="h-72 w-full mb-10" />
          </div>
        )}
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
          <img src={crypto.logo} alt="" className="crypto-item-img" />
          <p className="ctypto-item-name" onClick={() => handleCryptoClick(crypto.id)}>
  {crypto.name.length > 8 ? `${crypto.name.slice(0, 8)}...` : crypto.name}
</p>
          <div className="crypto-item-more">
            <p className="crypto-item-abr">{crypto.symbol.toUpperCase()}</p>
            <p className="crypto-item-abr">7D</p>
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

  if (sortType === "rank") {
    sortedCrypto.sort((a, b) => b.rank > a.rank);
  } else if (sortType === "top_gainer") {
    sortedCrypto.sort(
      (a, b) => b.percent_change_24h - a.percent_change_24h
    );
  } else if (sortType === "top_loser") {
    sortedCrypto.sort(
      (a, b) => a.percent_change_24h - b.percent_change_24h
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
