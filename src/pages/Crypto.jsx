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
      axios.get(`https://api.coingecko.com/api/v3/coins/${secondId}?vs_currency=usd&order=market_cap_desc&per_page=2&page=1&sparkline=false`)
        .then((response) => {
          setCryptoData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [secondId]);
    
    let name, image, priceNew, symbol, nameLower, priceChange24h, priceChange7d, priceChange14d, priceChange30d, priceChange60d, priceChange200d, priceChange1y;

    if (cryptoData) {
      name = cryptoData.name;
      nameLower = cryptoData.id;
      console.log(nameLower);
      image = cryptoData.image.large;
      priceNew = cryptoData.market_data.current_price.usd;
      
      symbol = cryptoData.symbol;
      priceChange24h = cryptoData.market_data.price_change_percentage_24h;
      priceChange7d = cryptoData.market_data.price_change_percentage_7d;
      priceChange14d = cryptoData.market_data.price_change_percentage_14d;
      priceChange30d = cryptoData.market_data.price_change_percentage_30d;
      priceChange60d = cryptoData.market_data.price_change_percentage_60d;
      priceChange200d = cryptoData.market_data.price_change_percentage_200d;
      priceChange1y = cryptoData.market_data.price_change_percentage_1y;
    } else {
      // Handle the case where data hasn't been fetched yet
      name = '';
      nameLower = '';
      image = '';
      priceNew = '';
  
      symbol = '';
      priceChange24h = '';
      priceChange7d = '';
      priceChange14d = '';
      priceChange30d = '';
      priceChange60d = '';
      priceChange200d = '';
      priceChange1y = '';
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
  }, [nameLower, user, secondId]);
 


  const price = parseFloat(priceNew).toLocaleString("en-US", {
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

  useEffect(() => {
    setDays("1D");
    setPercentChange(parseFloat(priceChange24h).toFixed(2));
  }, [priceChange24h]);
  
  const handleButtonClick = (event) => {
    const { value } = event.target;
    setDays(value);
    if (value === "1D") {
      setPercentChange(parseFloat(priceChange24h).toFixed(2));
    } else if (value === "7D") {
      setPercentChange(parseFloat(priceChange7d).toFixed(2));
    } else if (value === "14D") {
      setPercentChange(parseFloat(priceChange14d).toFixed(2));
    } else if (value === "30D") {
      setPercentChange(parseFloat(priceChange30d).toFixed(2));
    } else if (value === "60D") {
      setPercentChange(parseFloat(priceChange60d).toFixed(2));
    } else if (value === "200D") {
      setPercentChange(parseFloat(priceChange200d).toFixed(2));
    } else if (value === "365D") {
      setPercentChange(parseFloat(priceChange1y).toFixed(2));
    }else if (value === "max") {
      const currentPrice = cryptoData.market_data.current_price.usd;
const allTimeLowPrice = cryptoData.market_data.atl.usd;
console.log(cryptoData.market_data.atl.usd);
const percentChange = ((currentPrice - allTimeLowPrice) / allTimeLowPrice) * 100;
setPercentChange(percentChange.toFixed(2));
    }
  };
  
  const [days, setDays] = useState("24H");
  const [percentChange, setPercentChange] = useState(parseFloat(priceChange24h).toFixed(2));
  

const HistoryChart = () => {
  const { response } = useAxios(`coins/${secondId}/market_chart?vs_currency=usd&days=${days}`);
  
  if(!response) {
    return (
      <div className="wrapper-container mt-8">
        <Skeleton className="h-72 w-full mb-10" />
      </div>
    )
  }

  const coinChartData = response.prices.map(value => ({ x: value[0], y: value[1].toFixed(2) }));
  
  const options = {
    type: 'line',
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white'
        }
      },
      y: {
        ticks: {
          color: 'white'
        }
      }
    }
  };
  const data = {
    labels: coinChartData.map(value => moment(value.x).format('DD / MM / YYYY')),
    datasets: [
      {
        label: name,
        pointStyle: false,
        data: coinChartData.map(val => val.y),
        borderColor: '#FCC81C',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ]
  }

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  )
  
}

   
  return (
    <div>
      <div className="one-crypto-container">
        <div className="one-crypto-left">
       
            <img src={image} alt="" className="one-crypto-image"/>
            <div className="one-crypto-left-container">
            <p className="one-crypto-name">{name}</p>
            <div className="one-crypto-star-container">
              <p className="one-crypto-symbol">{symbol ? symbol.toUpperCase() : ""}</p>
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
        <button onClick={handleButtonClick} value="1D">24H</button>
        <button onClick={handleButtonClick} value="7D">7D</button>
        <button onClick={handleButtonClick} value="14D">14D</button>
        <button onClick={handleButtonClick} value="30D">30D</button>
        <button onClick={handleButtonClick} value="60D">60D</button>
        <button onClick={handleButtonClick} value="200D">200D</button>
        <button onClick={handleButtonClick} value="365D">1Y</button>
        <button onClick={handleButtonClick} value="max">All</button>
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

