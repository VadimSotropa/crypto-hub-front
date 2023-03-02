import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

function Chart() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0).toISOString();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0).toISOString();

      const response = await fetch(
        `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history?period_id=1DAY&time_start=${start}&time_end=${end}&apikey=9269351C-C63D-4416-B441-FF362C32E27A`
      );
      const data = await response.json();
      const formattedData = data.map((item) => item.price_close);
      setChartData({
        labels: ["Bitcoin"],
        datasets: [
          {
            label: "Bitcoin",
            data: formattedData,
            backgroundColor: ["#F7931A"],
            borderWidth: 0,
          },
        ],
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      <Doughnut data={chartData} />
    </div>
  );
}

export default Chart;