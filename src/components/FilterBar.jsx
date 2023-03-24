import React from "react";
import "../styles/FilterBar.css";

export default function FilterBar({
  handleSearch,
  handleSort,
  handleCurrencyChange,
  searchTerm,
  sortType,
  currency,
}) {
  return (
    <div>
      <div className="containerFilter">
        <div className="imputContainer">
          <button className="inputSearch">
            <svg
              className="svgSearch"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.36999 12.6802C2.85873 12.6802 0 9.83486 0 6.34008C0 2.84531 2.85873 0 6.36999 0C9.88125 0 12.74 2.84531 12.74 6.34008C12.74 9.83486 9.88125 12.6802 6.36999 12.6802ZM6.36999 0.927817C3.36833 0.927817 0.932194 3.3587 0.932194 6.34008C0.932194 9.32147 3.36833 11.7524 6.36999 11.7524C9.37165 11.7524 11.8078 9.32147 11.8078 6.34008C11.8078 3.3587 9.37165 0.927817 6.36999 0.927817Z"
                fill="white"
              />
              <path
                d="M12.8957 13.2987C12.7776 13.2987 12.6595 13.2554 12.5663 13.1626L11.3234 11.9255C11.1432 11.7461 11.1432 11.4492 11.3234 11.2698C11.5036 11.0905 11.8019 11.0905 11.9822 11.2698L13.2251 12.5069C13.4053 12.6863 13.4053 12.9832 13.2251 13.1626C13.1319 13.2554 13.0138 13.2987 12.8957 13.2987Z"
                fill="white"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search Cryptocurrency"
            className="serchImput"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="btnContianerFilter">
          
          <button
            className={`itemBTN ${sortType === "top_gainer" ? "active" : ""}`}
            onClick={handleSort}
            value="top_gainer"
          >
            Top Gainer
          </button>
          <button
            className={`itemBTN ${sortType === "rank" ? "active" : ""}`}
            onClick={handleSort}
            value="rank"
          >
           Rank
          </button>
          <button
            className={`itemBTN ${sortType === "top_loser" ? "active" : ""}`}
            onClick={handleSort}
            value="top_loser"
          >
            Top Loser
          </button>
        </div>
        <div>
          <select
            id="currency"
            name="currency"
            className="curencyList"
            value={currency}
            onChange={handleCurrencyChange}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
    </div>
  );
}
