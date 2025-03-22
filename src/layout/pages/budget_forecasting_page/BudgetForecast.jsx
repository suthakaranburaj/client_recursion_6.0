import React, { useEffect, useState } from "react";
import { forcast_services } from "../../../services/forcastServices/forcastServices";

function BudgetForecast() {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await forcast_services();
        setForecastData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Budget Forecast</h2>
      <pre>{JSON.stringify(forecastData, null, 2)}</pre>
    </div>
  );
}

export default BudgetForecast;
