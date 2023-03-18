import React, { useState, useEffect } from "react";
import "../styles/OneCryptoStyle.css";
import { useRecoilState } from 'recoil';
import { userStateLogin } from '../pages/Login';
import { FaStar } from "react-icons/fa";
import Navbar from '../components/Navbar'
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
    import useAxios from "../hooks/useAxios"
   import { useRecoilValue } from "recoil";
import { cryptoDataState } from "../components/CryptoList";

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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from "moment";
import Skeleton from "../components/Skeleton";

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


function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function saveCrypto(crypto) {
  localStorage.setItem(`crypto-${crypto.id}`, JSON.stringify(crypto));
}

function CryptoItem() {

  const cryptoData = useRecoilValue(cryptoDataState);
  console.log(cryptoData);

  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const secondId = id;

  const savedCrypto = JSON.parse(localStorage.getItem(`crypto-${id}`));
  const crypto = savedCrypto ? savedCrypto : cryptoData.find((item) => item.id === id);

  useEffect(() => {
    if (!savedCrypto) {
      const crypto = cryptoData.find((item) => item.id === id);
      saveCrypto(crypto);
    }
  }, [id, cryptoData, savedCrypto]);

  const [user, setUser] = useRecoilState(userStateLogin);
  const [isLiked, setIsLiked] = useLocalStorage('isLiked', false);


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
  }, [crypto.id, user, secondId]);
 


  const price = parseFloat(crypto.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });


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

  const [start, setStart] = useState(moment().subtract(7, "days").format("YYYY-MM-DD"));
  const [interval, setInterval] = useState("1d");
  const [intervalIdChart, setIntervalIdChart] = useState(null);
  const HistoryChart = () => {
    const [coinChartData, setCoinChartData] = useState([]);
   
   
   
  
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.coinpaprika.com/v1/tickers/${crypto.id}/historical?start=${start}&interval=${interval}`
        );
        const chartData = response.data.map((value) => ({
          x: new Date(value.timestamp).getTime(),
          y: value.price.toFixed(2),
        }));
        setCoinChartData(chartData);
  
        // Save data to localStorage
        localStorage.setItem(`coinChartData-${crypto.id} ${interval} ${start}`, JSON.stringify(chartData));
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
    }, [interval, start]);
  
    useEffect(() => {
      const intervalDays = {
        "1d": 1,
        "7d": 1,
        "14d": 1,
        "30d": 2,
        "90d": 3,
        "365d": 6,
      };
      const intervalValue = intervalDays[interval] || 1;
      const intervalInMilliseconds = intervalValue * 24 * 60 * 60 * 1000;
      clearInterval(intervalIdChart);
      const newIntervalId = setInterval(() => {
        fetchData();
      }, intervalInMilliseconds);
      setIntervalIdChart(newIntervalId);
  
      return () => clearInterval(newIntervalId);
    }, [interval, start]);
  
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

  const handleIntervalClick = (value) => {
    setInterval(value);
    const intervalStart = {
      "1d": moment().subtract(1, "days"),
      "7d": moment().subtract(7, "days"),
      "14d": moment().subtract(14, "days"),
      "30d": moment().subtract(30, "days"),
      "90d": moment().subtract(90, "days"),
      "365d": moment().subtract(365, "days"),
    };
    setStart(intervalStart[value].format("YYYY-MM-DD"));
  };
   
  return (
    <div>
      <div className="one-crypto-container">
        <div className="one-crypto-left">
       
            <img src={crypto.logo} alt="" className="one-crypto-image"/>
            <div className="one-crypto-left-container">
            <p className="one-crypto-name">{crypto.name}</p>
            <div className="one-crypto-star-container">
              <p className="one-crypto-symbol">{crypto.symbol}</p>
              <FaStar
              color={isLiked ? "yellow" : "white"}
              fontSize="35px"
              onClick={handleLikeClick}
              className="one-crypto-star"
            />
            </div>
            
          </div>
        
      </div>
      
      <div className="one-crypto-right">
          <p className="one-crypto-price">{price}</p>
          <p className={
              crypto.percent_change_24h >= 0
                ? "one-crypto-percent-positif"
                : "one-crypto-percent-negatif"
            }>
        {crypto.percent_change_24h > 0 ? "+" : ""}
        {crypto.percent_change_24h}%
      </p>
          
        </div>
      <Toaster />
   
    </div>
    <div className="one-crypto-days-change">
      <button onClick={() => handleIntervalClick("7d")} value="7d">
        7D
      </button>
      <button onClick={() => handleIntervalClick("14d")} value="14d">
        14D
      </button>
      <button onClick={() => handleIntervalClick("30d")} value="30d">
        30D
      </button>
      <button onClick={() => handleIntervalClick("90d")} value="90d">
        90D
      </button>
      <button onClick={() => handleIntervalClick("365d")} value="365d">
        1Y
      </button>
        </div>
    <HistoryChart/>
    </div>
  );
  
}

export default function CryptoList() {
    return (
      <div>
        <Navbar />
        <div>
          <CryptoItem />
        </div>
      </div>
    );
  }

