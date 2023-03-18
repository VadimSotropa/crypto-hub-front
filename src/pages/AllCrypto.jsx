import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/HeaderHome.css";
import "../styles/Allcrypto.css";
import { useNavigate } from "react-router-dom";

export default function AllCrypto({
  handleSort,
  handleCurrencyChange,
  sortType,
  currency,
}) {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCryptoList, setFilteredCryptoList] = useState([]);

  useEffect(() => {
    const storedCryptoNames = localStorage.getItem("cryptoNames");
    if (storedCryptoNames) {
      setCryptoList(JSON.parse(storedCryptoNames));
      setFilteredCryptoList(JSON.parse(storedCryptoNames));
      console.log('from store names');
    } else {
      const fetchData = async () => {
        const response = await fetch("https://api.coinpaprika.com/v1/tickers");
        const data = await response.json();
        const cryptoNames = data.map((crypto) => ({ name: crypto.name, id: crypto.id }));
        setCryptoList(cryptoNames);
        setFilteredCryptoList(cryptoNames);
        localStorage.setItem("cryptoNames", JSON.stringify(cryptoNames));
        console.log('from api names');
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    const filteredList = cryptoList.filter((crypto) => {
      const name = crypto.name.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      const startsWithSelectedLetter =
        selectedLetter === "" || name.startsWith(selectedLetter.toLowerCase());
      const includesSearchTerm =
        searchTerm === "" || name.includes(searchTermLower);
      return startsWithSelectedLetter && includesSearchTerm;
    });
    setFilteredCryptoList(filteredList);
  }, [cryptoList, searchTerm, selectedLetter]);
console.log('filtred list', filteredCryptoList);
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm("");
  };

  const handleSearch = (event) => {
    setSelectedLetter("");
    setSearchTerm(event.target.value);
  };

  const navigate = useNavigate();

  const handleCryptoClick = (crypto) => {
    const selectedCrypto = filteredCryptoList.find((c) => c.name === crypto);
    if (selectedCrypto) {
      const id = selectedCrypto.id;
      navigate(`/crypto/${id}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="containerAll">
        <div className="titleMainAllContainer">
          <h1 className="titleMainAll">
            {" "}
            Find cryptocurrency and save to your favorite
          </h1>
          <svg className='svg' width="418" height="154" viewBox="0 0 418 154" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M416 72.8813L380.108 72.8813C379.209 72.8813 378.421 72.2815 378.181 71.4152L373.44 54.3024C372.9 52.3534 370.139 52.3456 369.588 54.2916L342.298 150.693C341.721 152.733 338.784 152.591 338.406 150.505L311.838 4.02802C311.454 1.91449 308.463 1.80918 307.932 3.89052L283.819 98.4006C283.314 100.38 280.517 100.418 279.957 98.4539L267.189 53.6093C266.651 51.7207 263.998 51.6571 263.37 53.5179L257.299 71.5204C257.025 72.3337 256.262 72.8813 255.404 72.8813L236.762 72.8813C236.087 72.8813 235.457 73.2218 235.088 73.7867L227.926 84.7397C226.993 86.1663 224.817 85.8469 224.334 84.2124L219.188 66.8127C218.653 65.0057 216.145 64.8729 215.423 66.6134L196.437 112.364C195.716 114.103 193.211 113.973 192.673 112.169L171.328 40.4985C170.794 38.704 168.307 38.5621 167.572 40.2843L148.812 84.2376C148.133 85.8285 145.891 85.8655 145.16 84.2978L136.171 65.0253C135.475 63.5314 133.371 63.4744 132.595 64.9284L128.912 71.8236C128.564 72.4747 127.886 72.8813 127.148 72.8813L111.186 72.8813C110.595 72.8813 110.034 73.1429 109.654 73.5958L103.819 80.5504C102.846 81.7098 100.988 81.4106 100.428 80.0045L95.3249 67.1805C94.9275 66.1822 93.8123 65.6762 92.7994 66.0347L73.7771 72.7667C73.5628 72.8425 73.3372 72.8813 73.1099 72.8813L2 72.8813" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>
        </div>
        <div className="containerFilterAll">
          <div className="alphabetContainer">
            {Array.from(Array(26)).map((_, index) => (
              <span
                key={index}
                onClick={() =>
                  handleLetterClick(String.fromCharCode(65 + index))
                }
              >
                {String.fromCharCode(65 + index)}
              </span>
            ))}
          </div>
          <div className="symbolsContainer">
            {["1", "2", "3", "4", "5", "6", "7", "8", "#", "$"].map(
              (symbol) => (
                <span key={symbol} onClick={() => handleLetterClick(symbol)}>
                  {symbol}
                </span>
              )
            )}
          </div>
        </div>
        <div className="imputContainerAll">
          <input
            type="text"
            placeholder="Search Cryptocurrency"
            className="serchImputAll"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="cryptoListContainer">
        {filteredCryptoList.map((crypto, index) => (
          <div
            key={index}
            className="cryptoListItem"
            onClick={() => handleCryptoClick(crypto.name)}
          >
            {crypto.name}
  </div>
))}
      </div>
    </div>
  );
}
