import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  useTheme
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { forecast_services } from "../../../services/forcastServices/forcastServices";

const formatCurrency = (value) => `₹${value.toFixed(2)}`;

function BudgetForecast() {
  const theme = useTheme();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("line"); // 'line' or 'bar'

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await forecast_services();
        setForecastData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  const transformData = (predictions) => {
    return predictions.map((amount, index) => ({
      day: `Day ${index + 1}`,
      amount: amount
    }));
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  if (!forecastData) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          color: "primary.main",
          fontWeight: "bold"
        }}
      >
        Budget Forecast
      </Typography>

      <Grid container spacing={3}>
        {forecastData.map((category) => {
          const chartData = transformData(category.next_week_predictions);

          return (
            <Grid item xs={12} md={6} lg={4} key={category.category}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.02)" }
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: "white",
                      backgroundColor: "primary.main",
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {category.category}
                  </Typography>

                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" ? (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{ fill: theme.palette.text.primary }} />
                          <YAxis
                            tickFormatter={(value) => `₹${value}`}
                            tick={{ fill: theme.palette.text.primary }}
                          />
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: theme.shape.borderRadius
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            stroke={theme.palette.primary.main}
                            strokeWidth={2}
                            dot={{ fill: theme.palette.primary.dark }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" tick={{ fill: theme.palette.text.primary }} />
                          <YAxis
                            tickFormatter={(value) => `₹${value}`}
                            tick={{ fill: theme.palette.text.primary }}
                          />
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{
                              backgroundColor: theme.palette.background.paper,
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: theme.shape.borderRadius
                            }}
                          />
                          <Bar
                            dataKey="amount"
                            fill={theme.palette.primary.main}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      fontWeight: "bold",
                      color: "success.main",
                      textAlign: "center",
                      p: 1,
                      backgroundColor: "action.hover",
                      borderRadius: 1
                    }}
                  >
                    Weekly Total: {formatCurrency(category.total_predicted_next_week)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default BudgetForecast;
