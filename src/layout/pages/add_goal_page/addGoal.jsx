import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  Slider,
  TextField,
  IconButton,
  styled,
  Box,
  Snackbar
} from '@mui/material';
import {
  Close,
  Home,
  DirectionsCar,
  School,
  Flight,
  Favorite,
  MonetizationOn,
  Business,
  AddCircle
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { add_goal_service } from '../../../services/goalServices/goalservices'; // Import the service

const ColorButton = styled(Button)(({ theme, color }) => ({
  color: theme.palette.getContrastText(color),
  backgroundColor: color,
  '&:hover': {
    backgroundColor: color,
    opacity: 0.9
  }
}));

const goalTemplates = [
  { name: 'Home Goal', icon: <Home />, color: '#FF6F61' },
  { name: 'First Car', icon: <DirectionsCar />, color: '#6B5B95' },
  { name: 'Kids Education', icon: <School />, color: '#88B04B' },
  { name: 'Travel the World', icon: <Flight />, color: '#F7CAC9' },
  { name: 'Marriage Goal', icon: <Favorite />, color: '#92A8D1' },
  { name: 'My First Crore', icon: <MonetizationOn />, color: '#955251' },
  { name: 'Startup Fund', icon: <Business />, color: '#B565A7' },
  { name: 'Custom Goal', icon: <AddCircle />, color: '#2A363B' }
];

const calculateSIP = (monthly, years, rate) => {
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const futureValue = monthly * (
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate)
  );
  const investedAmount = monthly * months;
  const totalValue = futureValue || 0;
  const estimatedReturn = totalValue - investedAmount;
  
  return {
    invested: Math.round(investedAmount),
    returns: Math.round(estimatedReturn),
    total: Math.round(totalValue)
  };
};

const AddGoal = () => {
  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    goalName: '',
    period: 5,
    interestRate: 8,
    monthlyInvestment: 5000,
  });

  const [calculations, setCalculations] = useState({
    invested: 0,
    returns: 0,
    total: 0
  });

  const [chartData, setChartData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const { monthlyInvestment, period, interestRate } = formData;
    const results = calculateSIP(monthlyInvestment, period, interestRate);
    setCalculations(results);
    
    // Prepare data for pie chart
    setChartData([
      { name: 'Invested', value: results.invested },
      { name: 'Returns', value: results.returns }
    ]);
  }, [formData]);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setOpen(true);
    if(goal.name !== 'Custom Goal') {
      setFormData(prev => ({...prev, goalName: goal.name}));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ 
      goalName: '', 
      period: 5, 
      interestRate: 8, 
      monthlyInvestment: 5000 
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = {
      name: formData.goalName,
      years: formData.period,
      target: calculations.total,
      invested: calculations.invested
    };

    try {
      const response = await add_goal_service(payload);
      setSnackbarMessage('Goal saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      setSnackbarMessage('Failed to save goal. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
        Create New Goal
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Choose from template or create custom goal
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {goalTemplates.map((goal) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={goal.name}>
            <Paper
              sx={{
                cursor: 'pointer',
                background: `linear-gradient(135deg, ${goal.color} 30%, ${goal.color}dd 100%)`,
                color: 'common.white',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                },
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                minHeight: '140px'
              }}
              onClick={() => handleGoalSelect(goal)}
            >
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <IconButton 
                  sx={{ 
                    color: 'common.white', 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: '50%',
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  {React.cloneElement(goal.icon, { sx: { fontSize: '2rem' } })}
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {goal.name}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
  <DialogTitle
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: selectedGoal?.color
        ? `linear-gradient(135deg, ${selectedGoal.color} 30%, ${selectedGoal.color}dd 100%)`
        : (theme) => theme.palette.mode === 'dark' ? '#2A363B' : '#2A363B',
      color: 'common.white',
      py: 2,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {selectedGoal?.name === 'Custom Goal' ? formData.goalName : selectedGoal?.name}
    </Typography>
    <IconButton onClick={handleClose} sx={{ color: 'common.white' }}>
      <Close />
    </IconButton>
  </DialogTitle>

  <DialogContent>
    <Box sx={{ mt: 3 }}>
      {selectedGoal?.name === 'Custom Goal' && (
        <TextField
          fullWidth
          label="Goal Name"
          variant="outlined"
          name="goalName"
          value={formData.goalName}
          onChange={handleChange}
          sx={{ mb: 3 }}
          InputProps={{
            sx: { borderRadius: '8px' },
          }}
        />
      )}

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
        Investment Period (Years)
      </Typography>
      <Slider
        value={formData.period}
        onChange={(e, value) => setFormData({ ...formData, period: value })}
        min={1}
        max={25}
        step={1}
        valueLabelDisplay="auto"
        marks={[
          { value: 1, label: '1Y' },
          { value: 5, label: '5Y' },
          { value: 10, label: '10Y' },
          { value: 25, label: '25Y' },
        ]}
        sx={{
          mb: 3,
          '& .MuiSlider-thumb': {
            backgroundColor: selectedGoal?.color || '#2A363B',
          },
        }}
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Expected Annual Returns (%)
      </Typography>
      <Slider
        value={formData.interestRate}
        onChange={(e, value) => setFormData({ ...formData, interestRate: value })}
        min={1}
        max={30}
        step={0.5}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `${value}%`}
        marks={[
          { value: 1, label: '1%' },
          { value: 10, label: '10%' },
          { value: 20, label: '20%' },
          { value: 30, label: '30%' },
        ]}
        sx={{
          mb: 3,
          '& .MuiSlider-thumb': {
            backgroundColor: selectedGoal?.color || '#2A363B',
          },
        }}
      />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Monthly Investment (₹)
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        name="monthlyInvestment"
        type="number"
        value={formData.monthlyInvestment}
        onChange={handleChange}
        sx={{ mb: 3 }}
        InputProps={{
          sx: { borderRadius: '8px' },
          inputProps: { min: 500, step: 500 },
        }}
      />

      {/* Pie Chart Section */}
      <Box sx={{ height: '300px', mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Investment Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '8px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f5f5f5',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Invested Amount
            </Typography>
            <Typography variant="h6">₹{calculations.invested.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '8px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f5f5f5',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Estimated Returns
            </Typography>
            <Typography variant="h6" color="success.main">
              ₹{calculations.returns.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '8px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#f5f5f5',
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Total Value
            </Typography>
            <Typography variant="h6" color="primary.main">
              ₹{calculations.total.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={handleClose}
      sx={{
        color: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.text.primary : 'text.secondary',
        '&:hover': { backgroundColor: 'transparent' },
      }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={handleSave}
      disabled={!formData.monthlyInvestment || (selectedGoal?.name === 'Custom Goal' && !formData.goalName)}
      sx={{
        borderRadius: '8px',
        py: 1,
        px: 3,
        fontWeight: 600,
        backgroundColor: selectedGoal?.color || '#2A363B',
        '&:hover': {
          backgroundColor: selectedGoal?.color || '#2A363B',
          opacity: 0.9,
        },
      }}
    >
      Save Goal
    </Button>
  </DialogActions>
</Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default AddGoal;