import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Slider,
  TextField,
  IconButton,
  styled,
  Box
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

const AddGoal = () => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    goalName: '',
    method: '',
    period: 5,
    goalAmount: '',
    monthlyIncome: ''
  });

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setOpen(true);
    if(goal.name !== 'Custom Goal') {
      setFormData(prev => ({...prev, goalName: goal.name}));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setFormData({ goalName: '', method: '', period: 5, goalAmount: '', monthlyIncome: '' });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    handleClose();
    alert(`Goal Saved: ${formData.goalName}`);
  };

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
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: selectedGoal?.color ? `linear-gradient(135deg, ${selectedGoal.color} 30%, ${selectedGoal.color}dd 100%)` : '#2A363B',
          color: 'common.white',
          py: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedGoal?.name === 'Custom Goal' ? formData.goalName : selectedGoal?.name}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'common.white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
            <Step><StepLabel>Method</StepLabel></Step>
            <Step><StepLabel>Details</StepLabel></Step>
          </Stepper>

          {activeStep === 0 && (
            <Box sx={{ textAlign: 'center' }}>
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
                    sx: { borderRadius: '8px' }
                  }}
                />
              )}
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                How do you want to achieve this goal?
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <ColorButton
                    fullWidth
                    variant={formData.method === 'invest' ? 'contained' : 'outlined'}
                    onClick={() => setFormData({ ...formData, method: 'invest' })}
                    color="#4CAF50"
                    sx={{ 
                      py: 2,
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    Invest
                  </ColorButton>
                </Grid>
                <Grid item xs={6}>
                  <ColorButton
                    fullWidth
                    variant={formData.method === 'save' ? 'contained' : 'outlined'}
                    onClick={() => setFormData({ ...formData, method: 'save' })}
                    color="#2196F3"
                    sx={{ 
                      py: 2,
                      borderRadius: '8px',
                      fontWeight: 600
                    }}
                  >
                    Save
                  </ColorButton>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Goal Details
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
                  { value: 25, label: '25Y' }
                ]}
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  '& .MuiSlider-thumb': {
                    backgroundColor: selectedGoal?.color || '#2A363B'
                  }
                }}
              />
              <Typography gutterBottom sx={{ fontWeight: 500 }}>
                Investment Period: {formData.period} years
              </Typography>

              <TextField
                fullWidth
                label="Goal Amount (₹)"
                variant="outlined"
                name="goalAmount"
                value={formData.goalAmount}
                onChange={handleChange}
                sx={{ my: 2 }}
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              />

              <TextField
                fullWidth
                label="Monthly Income (₹)"
                variant="outlined"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { borderRadius: '8px' }
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {activeStep === 0 ? (
            <Button 
              onClick={handleClose}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button 
              onClick={handleBack}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              Back
            </Button>
          )}
          
          {activeStep === 0 ? (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={
                !formData.method || 
                (selectedGoal?.name === 'Custom Goal' && !formData.goalName)
              }
              sx={{
                borderRadius: '8px',
                py: 1,
                px: 3,
                fontWeight: 600,
                backgroundColor: selectedGoal?.color || '#2A363B',
                '&:hover': {
                  backgroundColor: selectedGoal?.color || '#2A363B',
                  opacity: 0.9
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={!formData.goalAmount || !formData.monthlyIncome}
              sx={{
                borderRadius: '8px',
                py: 1,
                px: 3,
                fontWeight: 600,
                backgroundColor: selectedGoal?.color || '#2A363B',
                '&:hover': {
                  backgroundColor: selectedGoal?.color || '#2A363B',
                  opacity: 0.9
                }
              }}
            >
              Save Goal
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddGoal;