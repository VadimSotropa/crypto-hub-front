import React, { useState, useEffect } from "react";
import "../styles/OneCryptoStyle.css";
import { useRecoilState } from 'recoil';
import { userStateLogin } from '../pages/Login';
import { FaStar } from "react-icons/fa";
import Navbar from '../components/Navbar'
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

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

function CryptoItem() {
  const [cryptoData, setCryptoData] = useState(null);

  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const secondId = id;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cryptoDataResponse = await axios.get(`https://api.coinpaprika.com/v1/coins/${secondId}`);
        const cryptoData = cryptoDataResponse.data;
        console.log('data', cryptoData);
        const tickersResponse = await axios.get("https://api.coinpaprika.com/v1/tickers");
        const tickers = tickersResponse.data;
  
        const prices = {};
        const percentChanges = {};
  
        tickers.forEach((ticker) => {
          prices[ticker.id] = ticker.quotes.USD.price;
          percentChanges[ticker.id] = ticker.quotes.USD.percent_change_24h;
        });
  
        // Merging price and percent change data with crypto data
        const cryptoDataWithPriceAndPercentChange = {
          ...cryptoData,
          price: prices[cryptoData.id],
          percent_change_24h: percentChanges[cryptoData.id],
        };
  
        // Update state with fetched data
        setCryptoData(cryptoDataWithPriceAndPercentChange);
      } catch (error) {
        console.error(error);
      }
    };
  
    if (secondId) {
      fetchData();
    }
  }, [secondId]);
  
  let name, image, priceNew, symbol, nameLower, percent;
  
  if (cryptoData) {
    name = cryptoData.name;
    nameLower = cryptoData.id;
    console.log(nameLower);
    image = cryptoData.logo;
    priceNew = cryptoData.price;
    percent = cryptoData.percent_change_24h
    symbol = cryptoData.symbol;
  } else {
    // Handle the case where data hasn't been fetched yet
    name = '';
    nameLower = '';
    image = '';
    priceNew = '';
    symbol = '';
  }


  const [user, setUser] = useRecoilState(userStateLogin);
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

        if (response.data.likedArticles.includes(nameLower)) {
          setIsLiked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user.token && user.likedArticles) {
      checkLikedStatus();
    }
  }, [user, nameLower]);
 


  const price = parseFloat(priceNew).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const percentChange = (
    parseFloat(percent) * 1
  ).toFixed(2);
  const handleLikeClick = () => {
    if (!user) {
      return;
    }

    if (isLiked) {
      axios
        .delete("https://cryptohub-auth-app.herokuapp.com/Like", {
          data: { token: user.token, article: nameLower },
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
          article: nameLower,
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

  
  const [days, setDays] = useState("7d");
  const [start, setStart] = useState(moment().subtract(7, "days").format("YYYY-MM-DD"));

  useEffect(() => {
    setDays("1d");
    
  }, [days]);
  
  const handleButtonClick = (event) => {
    const { value } = event.target;
   
    if (value === "7d") {
      setStart(moment().subtract(7, "days").format("YYYY-MM-DD"))
      setDays('1d');
    } else if (value === "14d") {
      setStart(moment().subtract(14, "days").format("YYYY-MM-DD"))
      setDays('1d');
    } else if (value === "30d") {
      setStart(moment().subtract(30, "days").format("YYYY-MM-DD"))
      setDays('1d');
    } else if (value === "90d") {
      setStart(moment().subtract(90, "days").format("YYYY-MM-DD"))
      setDays('7d');
    } else if (value === "365d") {
      setStart(moment().subtract(360, "days").format("YYYY-MM-DD"))
      setDays('14d');
    } 
  };


  
  const HistoryChart = () => {
    const [coinChartData, setCoinChartData] = useState([]);
  

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.coinpaprika.com/v1/tickers/${secondId}/historical?start=${start}&interval=1d`);
        const chartData = response.data.map((value) => ({
          x: new Date(value.timestamp).getTime(),
          y: value.price.toFixed(2),
        }));
        setCoinChartData(chartData);
  
        localStorage.setItem(`coinChartData-${secondId} ${start}`, JSON.stringify(chartData));
      } catch (error) {
        console.log("Error fetching chart data: ", error);
      }
    };
  
    useEffect(() => {
      const storedData = localStorage.getItem(`coinChartData-${secondId} ${start}`);
      if (storedData) {
        setCoinChartData(JSON.parse(storedData));
      } else {
        fetchData();
      }
    }, []);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        fetchData();
      }, 60 * 60 * 1000);
  
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
          label: 'price',
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


  return (
    <div>
      <div className="one-crypto-container">
        <div className="one-crypto-left">
       
            <img src={image} alt="" className="one-crypto-image"/>
            <div className="one-crypto-left-container">
            <p className="one-crypto-name">{name}</p>
            <div className="one-crypto-star-container">
              <p className="one-crypto-symbol">{symbol}</p>
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
              percentChange >= 0
                ? "one-crypto-percent-positif"
                : "one-crypto-percent-negatif"
            }>
        {percentChange > 0 ? "+" : ""}
        {percentChange}%
      </p>
          
        </div>
      <Toaster />
   
    </div>
    <div className="one-crypto-days-change">
    <button onClick={handleButtonClick} value="7d">7D</button>
        <button onClick={handleButtonClick} value="14d">14D</button>
        <button onClick={handleButtonClick} value="30d">30D</button>
        <button onClick={handleButtonClick} value="90d">90D</button>
        <button onClick={handleButtonClick} value="365d">1Y</button>
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

