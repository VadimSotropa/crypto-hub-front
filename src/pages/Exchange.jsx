// import React, { useState, useEffect } from "react";
// import Select from "react-select";
// import Navbar from '../components/Navbar'
// import "../styles/exchange.css";
// import ExchangeCryptoList from '../components/ExchangeCryptoList'



// export default function Exchange() {
//   const [currencyOptions, setCurrencyOptions] = useState([]);
//   const [fromCurrency, setFromCurrency] = useState({ value: "btc", label: "Bitcoin" });
//   const [toCurrency, setToCurrency] = useState(null);
//   const [exchangeRate, setExchangeRate] = useState("");
//   const [amount, setAmount] = useState(1);
//   const [convertedAmount, setConvertedAmount] = useState("");
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     async function fetchCurrencyOptions() {
      
//       const response = await fetch("https://api.coingecko.com/api/v3/exchange_rates");
//       const data = await response.json();
//       const options = Object.keys(data.rates)
//         .filter((currency) => currency !== "btc")
//         .map((currency) => ({
//           value: currency,
//           label: `${currency.toUpperCase()} - ${data.rates[currency].name}`,
//         }));
//       setCurrencyOptions(options);
//       setToCurrency(options[0]);
//       setExchangeRate(data.rates[options[0].value].value / data.rates[fromCurrency.value].value);
//       setData(data);
//     }
//     fetchCurrencyOptions();
//   }, [fromCurrency.value]);

//   function handleFromCurrencyChange(selectedOption) {
//     setFromCurrency(selectedOption);
//   }

//   function handleToCurrencyChange(selectedOption) {
//     setToCurrency(selectedOption);
//   }

//   function handleAmountChange(event) {
//     setAmount(event.target.value);
//   }

//   function handleConversion(event) {
//     event.preventDefault();
//     const selectedCurrency = currencyOptions.find(
//       (currency) => currency.value === toCurrency.value || currency.label.includes(toCurrency.value)
//     );
//     const exchangeRate = data.rates[selectedCurrency.value].value;
//     setConvertedAmount(amount * exchangeRate);
//   }

//   return (
//     <div>
// <Navbar/>
// <div className="exchange-title">Your favorite crypto</div>
//       <svg className='exchange-svg' width="418" height="154" viewBox="0 0 418 154" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M416 72.8813L380.108 72.8813C379.209 72.8813 378.421 72.2815 378.181 71.4152L373.44 54.3024C372.9 52.3534 370.139 52.3456 369.588 54.2916L342.298 150.693C341.721 152.733 338.784 152.591 338.406 150.505L311.838 4.02802C311.454 1.91449 308.463 1.80918 307.932 3.89052L283.819 98.4006C283.314 100.38 280.517 100.418 279.957 98.4539L267.189 53.6093C266.651 51.7207 263.998 51.6571 263.37 53.5179L257.299 71.5204C257.025 72.3337 256.262 72.8813 255.404 72.8813L236.762 72.8813C236.087 72.8813 235.457 73.2218 235.088 73.7867L227.926 84.7397C226.993 86.1663 224.817 85.8469 224.334 84.2124L219.188 66.8127C218.653 65.0057 216.145 64.8729 215.423 66.6134L196.437 112.364C195.716 114.103 193.211 113.973 192.673 112.169L171.328 40.4985C170.794 38.704 168.307 38.5621 167.572 40.2843L148.812 84.2376C148.133 85.8285 145.891 85.8655 145.16 84.2978L136.171 65.0253C135.475 63.5314 133.371 63.4744 132.595 64.9284L128.912 71.8236C128.564 72.4747 127.886 72.8813 127.148 72.8813L111.186 72.8813C110.595 72.8813 110.034 73.1429 109.654 73.5958L103.819 80.5504C102.846 81.7098 100.988 81.4106 100.428 80.0045L95.3249 67.1805C94.9275 66.1822 93.8123 65.6762 92.7994 66.0347L73.7771 72.7667C73.5628 72.8425 73.3372 72.8813 73.1099 72.8813L2 72.8813" stroke="white" stroke-width="3" stroke-linecap="round"/>
// </svg>

// <div className="exchange-main-container">
// <div className="exchange-left-list">
//  <ExchangeCryptoList/>
// </div>

//       <form onSubmit={handleConversion} className="exchange-form-container">
//         <label>
//           From Currency:
//           <Select value={fromCurrency} options={[fromCurrency]} onChange={handleFromCurrencyChange} className="exchange-select-field"/>
//         </label>
//         <br />
//         <label>
//           To Currency:
//           <Select value={toCurrency} options={currencyOptions} onChange={handleToCurrencyChange} isSearchable className="exchange-select-field"/>
//         </label>
//         <br />
//         <label>
//           Amount:
//           <input type="number" value={amount} onChange={handleAmountChange} className="exchange-amount-input"/>
//         </label>
//         <br />
//         <button type="submit">Convert</button>
//         {convertedAmount && (
//         <p>
//           {amount} {fromCurrency.label.toUpperCase()} is equal to {convertedAmount.toFixed(2)}{" "}
//           {toCurrency.label.split(" - ")[0].toUpperCase()}
//         </p>
//       )}
//       </form>
 
      
//       </div>
//     </div>
//   );
// }