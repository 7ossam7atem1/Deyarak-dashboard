import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import "../css/Properties.css";

const Properties = () => {
  const [propertyStats, setPropertyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchPropertyStats = async () => {
      try {
        const response = await axios.get(
          "https://deyarak-app.onrender.com/api/v1/properties/property-stats"
        );
        setPropertyStats(response.data.data.stats);
        setLoading(false);
      } catch (error) {
        setError("Error fetching property stats");
        setLoading(false);
      }
    };

    fetchPropertyStats();
  }, []);

  useEffect(() => {
    if (!propertyStats || error) return;

    charts.forEach(chart => {
      Object.values(chart).forEach(chartInstance => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      });
    });


    const newCharts = propertyStats.map((stat, index) => {
      const canvasPrice = document.getElementById(`chart-price-${index}`);
      const canvasSize = document.getElementById(`chart-size-${index}`);
      const canvasRooms = document.getElementById(`chart-rooms-${index}`);
      const canvasBathrooms = document.getElementById(`chart-bathrooms-${index}`);
      const canvasPricePerSqMeter = document.getElementById(`chart-price-per-sq-meter-${index}`);
      const canvasAddress = document.getElementById(`chart-address-${index}`);

      if (
        canvasPrice &&
        canvasSize &&
        canvasRooms &&
        canvasBathrooms &&
        canvasPricePerSqMeter &&
        canvasAddress
      ) {
        return {
          price: new Chart(canvasPrice, {
            type: "bar",
            data: {
              labels: ["Min", "Average", "Max"],
              datasets: [{
                label: "Price (EGP)",
                data: [stat.minPrice, stat.averagePrice, stat.maxPrice],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
              }]
            }
          }),
          size: new Chart(canvasSize, {
            type: "bar",
            data: {
              labels: ["Min", "Average", "Max"],
              datasets: [{
                label: "Size (sqm)",
                data: [stat.minSize, stat.averageSize, stat.maxSize],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
              }]
            }
          }),
          rooms: new Chart(canvasRooms, {
            type: "bar",
            data: {
              labels: ["Average"],
              datasets: [{
                label: "Number of Rooms",
                data: [stat.averageRooms],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }]
            }
          }),
          bathrooms: new Chart(canvasBathrooms, {
            type: "bar",
            data: {
              labels: ["Average"],
              datasets: [{
                label: "Number of Bathrooms",
                data: [stat.averageBathrooms],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            }
          }),
          pricePerSqMeter: new Chart(canvasPricePerSqMeter, {
            type: "bar",
            data: {
              labels: ["Average"],
              datasets: [{
                label: "Price per Square Meter (EGP)",
                data: [stat.averagePricePerSquareMeter],
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
              }]
            }
          }),
          address: new Chart(canvasAddress, {
            type: "pie",
            data: {
              labels: stat.uniqueAddresses,
              datasets: [{
                label: "Addresses",
                data: new Array(stat.uniqueAddresses.length).fill(1),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
            }
          })
        };
      }
      return null;
    });

    setCharts(newCharts);

  }, [propertyStats, error]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Property Stats</h2>
      {propertyStats && propertyStats.map((stat, index) => (
        <div key={index}>
          <h3>{stat.category}</h3>
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Price (EGP)</h5>
                  <canvas id={`chart-price-${index}`} width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Size (sqm)</h5>
                  <canvas id={`chart-size-${index}`} width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Number of Rooms</h5>
                  <canvas id={`chart-rooms-${index}`} width="400" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Number of Bathrooms</h5>
                  <canvas id={`chart-bathrooms-${index}`} width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Price per Square Meter (EGP)</h5>
                  <canvas id={`chart-price-per-sq-meter-${index}`} width="400" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Addresses</h5>
                  <canvas id={`chart-address-${index}`} width="400" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Properties;
