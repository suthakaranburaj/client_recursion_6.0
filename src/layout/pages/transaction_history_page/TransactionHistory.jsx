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
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { get_all_statement_service, get_current_statement_service } from "../../../services/statementServices/statementServices";

function TransactionHistory() {
  const [transactions, setTransactions] = React.useState([]);
  const [statements, setStatements] = React.useState([]);
  const [selectedStatement, setSelectedStatement] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [statementLoading, setStatementLoading] = React.useState(true);

  // Fetch all statements for the dropdown
  React.useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await get_current_statement_service();
        if (response.data && response.data.status) {
          setStatements(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching statements:", error);
      } finally {
        setStatementLoading(false);
      }
    };

    fetchStatements();
  }, []);

  // Fetch transactions based on the selected statement
  React.useEffect(() => {
    if (selectedStatement) {
      const fetchTransactions = async () => {
        try {
          setLoading(true);
          const response = await get_all_statement_service(selectedStatement);
          if (response.data && response.data.status) {
            setTransactions(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTransactions();
    } else {
      setTransactions([]); // Clear transactions if no statement is selected
    }
  }, [selectedStatement]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "primary.main" }}>
        Transaction History
      </Typography>

      {/* Dropdown to select statement */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="statement-select-label">Select Statement</InputLabel>
        <Select
          labelId="statement-select-label"
          id="statement-select"
          value={selectedStatement}
          label="Select Statement"
          onChange={(e) => setSelectedStatement(e.target.value)}
          disabled={statementLoading}
        >
          <MenuItem value="" disabled>
            {statementLoading ? "Loading statements..." : "No file selected"}
          </MenuItem>
          {statements.map((statement) => (
            <MenuItem key={statement.id} value={statement.id}>
              {statement.name || `Statement ${statement.id}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Transaction Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
          No transactions found for the selected statement.
        </Typography>
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
                      fontWeight: 600,
                    }}
                  >
                    {transaction.type === "Debit" ? `₹${transaction.amount.toFixed(2)}` : ""}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: transaction.type === "Credit" ? "success.main" : "transparent",
                      fontWeight: 600,
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