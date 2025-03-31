// src/components/blockchain/TransactionViewer.js
import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box, CircularProgress } from "@mui/material";
import { getTransactionTraceService } from "../../../services/web3Service/web3Service";

const TransactionViewer = () => {
  const [txHash, setTxHash] = useState("");
  const [trace, setTrace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!txHash.match(/^0x([A-Fa-f0-9]{64})$/)) {
      setError("Invalid transaction hash");
      return;
    }

    try {
      setLoading(true);
      const response = await getTransactionTraceService(txHash);
      setTrace(response.data.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Transaction Trace Viewer
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Transaction Hash"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="0x..."
          />
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Get Trace"}
          </Button>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {trace && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Transaction Trace</Typography>
            <pre style={{ overflowX: "auto" }}>{JSON.stringify(trace, null, 2)}</pre>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TransactionViewer;
