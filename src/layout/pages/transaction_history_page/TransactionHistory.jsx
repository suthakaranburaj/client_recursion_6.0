import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { getAllTransactions } from '../../../services/statementService'; // Import the API service
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext for user token

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Get the user's token from AuthContext

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace `userStatementId` with the actual statement ID you want to fetch
        const userStatementId = 1; // You can get this from the user's selected statement
        const data = await getAllTransactions(userStatementId, token);
        setTransactions(data);
      } catch (err) {
        setError('Failed to fetch transactions. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
        Transaction History
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Narration</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                Withdrawal (Dr)
              </TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                Deposit (Cr)
              </TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>
                Balance (₹)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.narration}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: transaction.type === 'Debit' ? 'red' : 'transparent',
                    fontWeight: 600,
                  }}
                >
                  {transaction.type === 'Debit' ? `₹${transaction.amount}` : ''}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: transaction.type === 'Credit' ? 'green' : 'transparent',
                    fontWeight: 600,
                  }}
                >
                  {transaction.type === 'Credit' ? `₹${transaction.amount}` : ''}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  ₹{transaction.balance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TransactionHistory;