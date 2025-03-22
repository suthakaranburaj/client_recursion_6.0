import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Box
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
import { asyncHandler } from "../../../helper/commonHelper";
import { ShowChart, BarChart as BarChartIcon } from "@mui/icons-material";

const formatCurrency = (value) => `₹${value.toFixed(2)}`;

// Chart color scheme
const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#22d3ee",
  background: "#f8fafc",
  grid: "#e2e8f0"
};

function BudgetForecast() {
  const theme = useTheme();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await asyncHandler(forecast_services)();
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

  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) setChartType(newChartType);
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "2rem auto" }} />;
  if (error) return <Alert severity="error" sx={{ margin: 2 }}>{error}</Alert>;
  if (!forecastData) return null;

  return (
    <Box sx={{ p: 3, bgcolor: CHART_COLORS.background, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: '600',
          color: CHART_COLORS.primary,
          mb: 1
        }}>
          Budget Forecast
        </Typography>
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          sx={{ 
            bgcolor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)'
          }}
        >
          <ToggleButton value="line" sx={{ px: 3 }}>
            <ShowChart sx={{ mr: 1, color: CHART_COLORS.primary }} />
            Line
          </ToggleButton>
          <ToggleButton value="bar" sx={{ px: 3 }}>
            <BarChartIcon sx={{ mr: 1, color: CHART_COLORS.primary }} />
            Bar
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {forecastData.map((category) => {
          const chartData = transformData(category.next_week_predictions);

          return (
            <Grid item xs={12} md={6} lg={4} key={category.category}>
              <Paper sx={{
                p: 2,
                height: '100%',
                borderRadius: '12px',
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}>
                <Typography variant="h6" sx={{
                  mb: 2,
                  color: CHART_COLORS.primary,
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {category.category}
                </Typography>

                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={chartData}>
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fill: CHART_COLORS.primary }}
                        />
                        <YAxis
                          tickFormatter={(value) => `₹${value}`}
                          tick={{ fill: CHART_COLORS.primary }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: `1px solid ${CHART_COLORS.grid}`,
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                            backgroundColor: 'white'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke={CHART_COLORS.primary}
                          strokeWidth={2}
                          dot={{ fill: CHART_COLORS.secondary }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fill: CHART_COLORS.primary }}
                        />
                        <YAxis
                          tickFormatter={(value) => `₹${value}`}
                          tick={{ fill: CHART_COLORS.primary }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: `1px solid ${CHART_COLORS.grid}`,
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                            backgroundColor: 'white'
                          }}
                        />
                        <Bar
                          dataKey="amount"
                          fill="url(#barGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </Box>

                <Box sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: '8px',
                  bgcolor: CHART_COLORS.grid,
                  textAlign: 'center'
                }}>
                  <Typography variant="body1" sx={{ 
                    fontWeight: '600',
                    color: CHART_COLORS.primary
                  }}>
                    Weekly Total: {formatCurrency(category.total_predicted_next_week)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default BudgetForecast;