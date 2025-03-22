import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

function AddTransaction({ open, onClose, onSubmit, selectedStatement }) {
  const [formData, setFormData] = React.useState({
    date: "",
    narration: "",
    balance: "",
    category: "",
    amount: "",
    type: "Credit", // Default to Credit
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedStatement) {
      alert("Please select a statement first.");
      return;
    }

    const payload = {
      user_statement_id: selectedStatement,
      user_id: "7", // Assuming user_id is fixed or fetched from context
      date: formData.date,
      narration: formData.narration || null,
      balance: parseFloat(formData.balance),
      category: formData.category,
      amount: parseFloat(formData.amount),
      chqRefNo: null,
      type: formData.type,
    };

    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3 }}>
          Add Transaction
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Narration"
              name="narration"
              value={formData.narration}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Balance"
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Investment">Investment</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                label="Type"
              >
                <MenuItem value="Credit">Credit</MenuItem>
                <MenuItem value="Debit">Debit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddTransaction;