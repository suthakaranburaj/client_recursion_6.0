import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, MenuItem, Select, FormControl, InputLabel, 
  IconButton, Box, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import {
  Home, DirectionsCar, School, Flight, Favorite,
  MonetizationOn, Business, AccountBalance, Receipt, 
  AttachMoney, ShowChart, PieChart as PieChartIcon
} from '@mui/icons-material';
import { get_dashboard_stats_service } from '../../../services/statementServices/statementServices';
import { asyncHandler } from '../../../helper/commonHelper';

// Dummy data for goals (keep as is)
const goalsData = [
  { goal: 'Home Goal', period: 10, goalAmount: 500000, investedAmount: 200000, icon: <Home />, color: '#FF6F61' },
  { goal: 'First Car', period: 5, goalAmount: 300000, investedAmount: 100000, icon: <DirectionsCar />, color: '#6B5B95' },
  { goal: 'Kids Education', period: 15, goalAmount: 1000000, investedAmount: 300000, icon: <School />, color: '#88B04B' },
  { goal: 'Travel the World', period: 20, goalAmount: 200000, investedAmount: 50000, icon: <Flight />, color: '#F7CAC9' },
  { goal: 'Marriage Goal', period: 7, goalAmount: 500000, investedAmount: 250000, icon: <Favorite />, color: '#92A8D1' },
  { goal: 'My First Crore', period: 25, goalAmount: 10000000, investedAmount: 1000000, icon: <MonetizationOn />, color: '#955251' },
  { goal: 'Startup Fund', period: 10, goalAmount: 2000000, investedAmount: 500000, icon: <Business />, color: '#B565A7' },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

function DashBoard() {
  const [dashboardData, setDashboardData] = useState({
    monthlyTrends: [],
    expenseData: [],
    cashFlowData: [],
    netSavings: 0,
    topTransactions: []
  });
  const [dateRange, setDateRange] = useState('1Y');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await asyncHandler(get_dashboard_stats_service)();
      if (response?.data?.data) {
        setDashboardData({
          monthlyTrends: response.data.data.monthlyTrends,
          expenseData: response.data.data.expenseData,
          cashFlowData: response.data.data.cashFlowData,
          netSavings: response.data.data.netSavings,
          topTransactions: response.data.data.topTransactions
        });
      }
    };
    fetchDashboardData();
  }, []);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const filterDataByDateRange = (data) => {
    const now = new Date();
    return data.filter((entry) => {
      const entryDate = new Date(entry.date);
      switch (dateRange) {
        case '1D': return entryDate.toDateString() === now.toDateString();
        case '1W': return entryDate >= new Date(now.setDate(now.getDate() - 7));
        case '1M': return entryDate >= new Date(now.setMonth(now.getMonth() - 1));
        case '1Y': return entryDate >= new Date(now.setFullYear(now.getFullYear() - 1));
        case '5Y': return entryDate >= new Date(now.setFullYear(now.getFullYear() - 5));
        default: return true;
      }
    });
  };

  const filterDataByCategory = (data) => {
    return categoryFilter === 'All' ? data : data.filter(entry => entry.category === categoryFilter);
  };

  const filteredCashFlowData = filterDataByCategory(filterDataByDateRange(dashboardData.cashFlowData));
  const filteredExpenseData = filterDataByCategory(dashboardData.expenseData);

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalance sx={{ fontSize: 40 }} />
        Financial Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select value={dateRange} onChange={handleDateRangeChange}
              sx={{ bgcolor: 'background.paper', borderRadius: '8px', '& .MuiSelect-select': { py: 1.5 } }}>
              <MenuItem value="1Y">1 Year</MenuItem>
              <MenuItem value="5Y">5 Years</MenuItem>
              <MenuItem value="All">All Time</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            {/* <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} onChange={handleCategoryFilterChange}
              sx={{ bgcolor: 'background.paper', borderRadius: '8px', '& .MuiSelect-select': { py: 1.5 } }}>
              <MenuItem value="All">All Categories</MenuItem>
              {dashboardData.expenseData.map((category, index) => (
                <MenuItem key={index} value={category.name}>{category.name}</MenuItem>
              ))}
            </Select> */}
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '12px', background: 'linear-gradient(135deg, #00C49F 0%, #0088FE 100%)', color: 'common.white', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AttachMoney sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h6">Current Balance</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  ${dashboardData.netSavings.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Receipt sx={{ fontSize: 28 }} />
              Top Transactions
            </Typography>
            <List>
              {dashboardData.topTransactions.map((transaction, index) => (
                <ListItem key={index} sx={{ py: 1, '&:hover': { bgcolor: 'action.hover' }, borderRadius: '8px' }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {index === 0 ? <Home /> : index === 1 ? <DirectionsCar /> : <School />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${transaction.name} - $${transaction.value.toLocaleString()}`} 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShowChart sx={{ fontSize: 28, color: 'primary.main' }} />
              <Typography variant="h6">Income vs Expenses</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.monthlyTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PieChartIcon sx={{ fontSize: 28, color: 'secondary.main' }} />
              <Typography variant="h6">Spending Categories</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={filteredExpenseData} cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={90} paddingAngle={5} 
                  dataKey="value" label>
                  {filteredExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShowChart sx={{ fontSize: 28, color: 'success.main' }} />
              <Typography variant="h6">Cashflow Over Time</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredCashFlowData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="income" stroke="#8884d8" fill="url(#incomeGradient)" />
                <Area type="monotone" dataKey="expenses" stroke="#82ca9d" fill="url(#expenseGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: 'background.paper', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MonetizationOn sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Financial Goals</Typography>
            </Box>
            <Grid container spacing={2}>
              {goalsData.map((goal, index) => {
                const progress = (goal.investedAmount / goal.goalAmount) * 100;
                return (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Paper sx={{ p: 2, borderRadius: '12px', background: `linear-gradient(135deg, ${goal.color} 30%, ${goal.color}dd 100%)`, 
                      color: 'common.white', textAlign: 'left', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', 
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }, position: 'relative', overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton sx={{ color: 'common.white', bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', p: 1.5 }}>
                          {goal.icon}
                        </IconButton>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{goal.goal}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>{goal.period} years goal</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2, mb: 1.5, bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', height: '8px' }}>
                        <Box sx={{ width: `${progress}%`, bgcolor: 'common.white', height: '100%', borderRadius: '8px' }} />
                      </Box>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>Target</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>${goal.goalAmount.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" sx={{ opacity: 0.9 }}>Invested</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>${goal.investedAmount.toLocaleString()}</Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', 
                        bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: '0 0 0 40px', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                          {Math.round(progress)}%
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashBoard;