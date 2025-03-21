import React from 'react';
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
} from '@mui/material';

// Dummy transaction data
const transactions = [
  { id: 1, date: '2023-10-01', narration: 'Salary', type: 'Cr', amount: 5000, balance: 5000 },
  { id: 2, date: '2023-10-02', narration: 'Groceries', type: 'Dr', amount: 200, balance: 4800 },
  { id: 3, date: '2023-10-03', narration: 'Rent', type: 'Dr', amount: 1000, balance: 3800 },
  { id: 4, date: '2023-10-04', narration: 'Freelance Payment', type: 'Cr', amount: 1500, balance: 5300 },
  { id: 5, date: '2023-10-05', narration: 'Utilities', type: 'Dr', amount: 150, balance: 5150 },
  { id: 6, date: '2023-10-06', narration: 'Bonus', type: 'Cr', amount: 1000, balance: 6150 },
];

function TransactionHistory() {
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
                    color: transaction.type === 'Dr' ? 'red' : 'transparent',
                    fontWeight: 600,
                  }}
                >
                  {transaction.type === 'Dr' ? `₹${transaction.amount}` : ''}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: transaction.type === 'Cr' ? 'green' : 'transparent',
                    fontWeight: 600,
                  }}
                >
                  {transaction.type === 'Cr' ? `₹${transaction.amount}` : ''}
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