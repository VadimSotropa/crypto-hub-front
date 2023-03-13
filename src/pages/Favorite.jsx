import React, { useState, useEffect } from "react";
import "../styles/CryptoList.css";
import FilterBar from "../components/FilterBar";
import { useRecoilState } from 'recoil';
import { userStateLogin } from '../pages/Login';
import { FaTimes } from 'react-icons/fa';
import Navbar from '../components/Navbar'
import axios from 'axios';
import "../styles/HeaderHome.css"
import { useNavigate } from "react-router-dom";

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
export function useCoinGeckoData() {
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
  }, [crypto.id, user, isLiked]);
 


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
  
    const confirmDelete = window.confirm("Are you sure you want to remove this crypto from your favorites?");
    
    if (confirmDelete) {
      axios.delete('https://cryptohub-auth-app.herokuapp.com/Like', { data: { token: user.token, article: crypto.id } })
        .then(response => {
          console.log(response.data); // handle response data
          setIsLiked(false);
          setUser(response.data);
          // Rerender the page after deleting
          window.location.reload();
        })
        .catch(error => { 
          console.error(error); // handle error
        });
    }
  };

  const HistoryChart = () => {
   
    const { response } = useAxios(`coins/${crypto.id}/market_chart?vs_currency=usd&days=1`);
    
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
      responsive: true
    }
    const data = {
      labels: coinChartData.map(value => moment(value.x).format('MMM DD')),
      datasets: [
        {
          pointStyle: false,
          label: crypto.id,
          data: coinChartData.map(val => val.y),
          borderColor: 'rgb(53, 162, 235)',
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
          <FaTimes
            color={'red'}
            fontSize="35px"
            onClick={handleLikeClick}
          />
        </div>
      </div>
      <div className="crypto-item-graph"></div>
    <HistoryChart/>
    </div>
  );
}

export default function CryptoList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [likedCryptoIds, setLikedCryptoIds] = useState([]);
  const [displayedCrypto, setDisplayedCrypto] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [user] = useRecoilState(userStateLogin);


  useEffect(() => {
    const getLikedCryptoIds = async () => {
      try {
        const response = await axios.get(
          `https://cryptohub-auth-app.herokuapp.com/user/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setLikedCryptoIds(response.data.likedArticles);
      } catch (error) {
        console.log(error);
      }
    };

    if (user.token && user.likedArticles) {
      getLikedCryptoIds();
    }
  }, [user]);

  function useCoinGeckoData(ids) {
    const [cryptoData, setCryptoData] = useState([]);

    useEffect(() => {
      if (ids.length > 0) {
        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        )
          .then((response) => response.json())
          .then((data) => setCryptoData(data))
          .catch((error) => console.log("error", error));
      }
    }, [ids]);

    return cryptoData;
  }

  const cryptoData = useCoinGeckoData(likedCryptoIds);

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
  
  const favoriteCryptoIds = user && user.likedArticles ? user.likedArticles.join(",") : "";
  
  const { data: favoriteCryptoData } = useAxios(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${favoriteCryptoIds}`
  );
  
  const favoriteCrypto = favoriteCryptoData ? favoriteCryptoData : [];
  
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="titleMain">Your favorite crypto</div>
      <svg className='svg' width="418" height="154" viewBox="0 0 418 154" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M416 72.8813L380.108 72.8813C379.209 72.8813 378.421 72.2815 378.181 71.4152L373.44 54.3024C372.9 52.3534 370.139 52.3456 369.588 54.2916L342.298 150.693C341.721 152.733 338.784 152.591 338.406 150.505L311.838 4.02802C311.454 1.91449 308.463 1.80918 307.932 3.89052L283.819 98.4006C283.314 100.38 280.517 100.418 279.957 98.4539L267.189 53.6093C266.651 51.7207 263.998 51.6571 263.37 53.5179L257.299 71.5204C257.025 72.3337 256.262 72.8813 255.404 72.8813L236.762 72.8813C236.087 72.8813 235.457 73.2218 235.088 73.7867L227.926 84.7397C226.993 86.1663 224.817 85.8469 224.334 84.2124L219.188 66.8127C218.653 65.0057 216.145 64.8729 215.423 66.6134L196.437 112.364C195.716 114.103 193.211 113.973 192.673 112.169L171.328 40.4985C170.794 38.704 168.307 38.5621 167.572 40.2843L148.812 84.2376C148.133 85.8285 145.891 85.8655 145.16 84.2978L136.171 65.0253C135.475 63.5314 133.371 63.4744 132.595 64.9284L128.912 71.8236C128.564 72.4747 127.886 72.8813 127.148 72.8813L111.186 72.8813C110.595 72.8813 110.034 73.1429 109.654 73.5958L103.819 80.5504C102.846 81.7098 100.988 81.4106 100.428 80.0045L95.3249 67.1805C94.9275 66.1822 93.8123 65.6762 92.7994 66.0347L73.7771 72.7667C73.5628 72.8425 73.3372 72.8813 73.1099 72.8813L2 72.8813" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>
</div>
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
            setDisplayedCrypto={setDisplayedCrypto}
          />
        ))}
      </div>
    </div>
  );
}