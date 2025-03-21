import React, { useState } from 'react';
import { Grid, Paper, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Dummy data
const incomeData = [
  { name: 'Salary', value: 5000 },
  { name: 'Freelance', value: 1500 },
];

const expenseData = [
  { name: 'Groceries', value: 500 },
  { name: 'Rent', value: 1000 },
  { name: 'Utilities', value: 200 },
  { name: 'Entertainment', value: 300 },
  { name: 'Transport', value: 150 },
];

const monthlyTrends = [
  { month: 'Jan', income: 5000, expenses: 2000 },
  { month: 'Feb', income: 5500, expenses: 2200 },
  { month: 'Mar', income: 6000, expenses: 2500 },
  { month: 'Apr', income: 5200, expenses: 2100 },
  { month: 'May', income: 5800, expenses: 2300 },
];

const cashFlowData = [
  { date: '2023-10-01', income: 5000, expenses: 2000 },
  { date: '2023-10-02', income: 0, expenses: 500 },
  { date: '2023-10-03', income: 1500, expenses: 300 },
  { date: '2023-10-04', income: 0, expenses: 1000 },
  { date: '2023-10-05', income: 0, expenses: 200 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

function DashBoard() {
  const [dateRange, setDateRange] = useState('1M'); // Default date range
  const [categoryFilter, setCategoryFilter] = useState('All'); // Default category filter

  // Handle date range change
  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  // Handle category filter change
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  // Filter data based on date range and category
  const filteredData = cashFlowData.filter((entry) => {
    // Add logic to filter based on date range (e.g., 1D, 1W, 1M, etc.)
    return true; // Placeholder, replace with actual filtering logic
  });

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Financial Dashboard
      </Typography>

      {/* Filters */}
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select value={dateRange} onChange={handleDateRangeChange}>
              <MenuItem value="1D">1D</MenuItem>
              <MenuItem value="1W">1W</MenuItem>
              <MenuItem value="1M">1M</MenuItem>
              <MenuItem value="1Y">1Y</MenuItem>
              <MenuItem value="5Y">5Y</MenuItem>
              <MenuItem value="All">All</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} onChange={handleCategoryFilterChange}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Groceries">Groceries</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
              <MenuItem value="Utilities">Utilities</MenuItem>
              <MenuItem value="Entertainment">Entertainment</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Income vs Expenses */}
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Income vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" name="Income" />
                <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Spending Categories */}
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Spending Categories
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Cashflow Line Graph */}
        <Grid item xs={12}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Cashflow Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Net Savings */}
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Net Savings
            </Typography>
            <Typography variant="h4" style={{ color: '#00C49F' }}>
              $2,300
            </Typography>
            <Typography variant="body1">Last Month</Typography>
          </Paper>
        </Grid>

        {/* Top Transactions */}
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Top Transactions
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>Rent - $1,000</li>
              <li>Groceries - $500</li>
              <li>Utilities - $200</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default DashBoard;