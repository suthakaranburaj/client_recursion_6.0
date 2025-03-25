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
  Box,
  styled
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}));

const ChartContainer = styled(Box)({
  height: 250
});

const SummaryBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
  textAlign: 'center'
}));

const PrimaryTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main
}));

const ChartTooltip = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: theme.spacing(1),
  boxShadow: theme.shadows[2]
}));

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

  const renderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <ChartTooltip>
          <Typography variant="body2" color="text.primary">{label}</Typography>
          <Typography variant="body2" color="primary">
            Amount: {formatCurrency(payload[0].value)}
          </Typography>
        </ChartTooltip>
      );
    }
    return null;
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} />
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
        {error}
      </Alert>
    </Box>
  );
  
  if (!forecastData) return null;

  return (
    <Box sx={{ 
      p: 3, 
      bgcolor: 'background.default', 
      minHeight: '100vh' 
    }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4 
      }}>
        <PrimaryTypography variant="h4" sx={{ mb: 2 }}>
          Budget Forecast
        </PrimaryTypography>
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          sx={{ 
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: theme.shadows[1]
          }}
        >
          <ToggleButton 
            value="line" 
            sx={{ 
              px: 3,
              '&.Mui-selected': {
                bgcolor: theme.palette.mode === 'dark' ? 
                  'rgba(66, 165, 245, 0.16)' : 
                  'rgba(25, 118, 210, 0.08)'
              }
            }}
          >
            <ShowChart sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="button">Line</Typography>
          </ToggleButton>
          <ToggleButton 
            value="bar" 
            sx={{ 
              px: 3,
              '&.Mui-selected': {
                bgcolor: theme.palette.mode === 'dark' ? 
                  'rgba(102, 187, 106, 0.16)' : 
                  'rgba(56, 142, 60, 0.08)'
              }
            }}
          >
            <BarChartIcon sx={{ mr: 1, color: 'secondary.main' }} />
            <Typography variant="button">Bar</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {forecastData.map((category) => {
          const chartData = transformData(category.next_week_predictions);

          return (
            <Grid item xs={12} md={6} lg={4} key={category.category}>
              <StyledPaper elevation={3}>
                <PrimaryTypography variant="h6" sx={{ 
                  mb: 2,
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}>
                  {category.category}
                </PrimaryTypography>

                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={chartData}>
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme.palette.divider} 
                        />
                        <XAxis 
                          dataKey="day" 
                          tick={{ 
                            fill: theme.palette.text.secondary,
                            fontSize: 12 
                          }}
                          tickMargin={8}
                        />
                        <YAxis
                          tickFormatter={(value) => `₹${value}`}
                          tick={{ 
                            fill: theme.palette.text.secondary,
                            fontSize: 12 
                          }}
                          tickMargin={8}
                        />
                        <Tooltip
                          content={renderTooltip}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke={theme.palette.primary.main}
                          strokeWidth={2}
                          dot={{ 
                            fill: theme.palette.primary.main,
                            strokeWidth: 2,
                            r: 4 
                          }}
                          activeDot={{ 
                            r: 6,
                            stroke: theme.palette.background.paper,
                            strokeWidth: 2
                          }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={theme.palette.divider} 
                        />
                        <XAxis 
                          dataKey="day" 
                          tick={{ 
                            fill: theme.palette.text.secondary,
                            fontSize: 12 
                          }}
                          tickMargin={8}
                        />
                        <YAxis
                          tickFormatter={(value) => `₹${value}`}
                          tick={{ 
                            fill: theme.palette.text.secondary,
                            fontSize: 12 
                          }}
                          tickMargin={8}
                        />
                        <Tooltip
                          content={renderTooltip}
                        />
                        <Bar
                          dataKey="amount"
                          fill="url(#barGradient)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </ChartContainer>

                <SummaryBox>
                  <PrimaryTypography variant="body1">
                    Weekly Total: {formatCurrency(category.total_predicted_next_week)}
                  </PrimaryTypography>
                </SummaryBox>
              </StyledPaper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default BudgetForecast;