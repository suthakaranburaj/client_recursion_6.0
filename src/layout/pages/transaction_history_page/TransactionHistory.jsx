import React from "react";
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
  CircularProgress
} from "@mui/material";
import { get_all_statement_service } from "../../../services/statementServices/statementServices";

function TransactionHistory() {
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await get_all_statement_service();
        if (response.status && response.data) {
          console.log(response)
          setTransactions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "primary.main" }}>
        Transaction History
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Narration</TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: 600 }}>
                  Withdrawal (Dr)
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: 600 }}>
                  Deposit (Cr)
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: 600 }}>
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
                      color: transaction.type === "Debit" ? "error.main" : "transparent",
                      fontWeight: 600
                    }}
                  >
                    {transaction.type === "Debit" ? `₹${transaction.amount.toFixed(2)}` : ""}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: transaction.type === "Credit" ? "success.main" : "transparent",
                      fontWeight: 600
                    }}
                  >
                    {transaction.type === "Credit" ? `₹${transaction.amount.toFixed(2)}` : ""}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ₹{transaction.balance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default TransactionHistory;
