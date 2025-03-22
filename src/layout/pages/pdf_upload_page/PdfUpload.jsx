import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Container,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  TextField
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  upload_statement_service,
  get_current_statement_service
} from "../../../services/statementServices/statementServices";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      setFetching(true);
      const response = await get_current_statement_service();
      if (response.data.status) {
        setStatements(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !password) {
      setSnackbarMessage("Please select a file and enter password");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("statements", file);
      formData.append("password", password);

      const response = await upload_statement_service(formData);
      if (response.data.status === true) {
        setFile(null);
        setPassword("");
        localStorage.setItem("statement", "uploaded");
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        await fetchStatements();
      } else {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setSnackbarMessage("An error occurred while uploading the file.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Upload PDF File
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please select a PDF file to upload
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2
            }}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ width: "fit-content" }}
            >
              Choose File
              <Input
                type="file"
                inputProps={{ accept: "application/pdf" }}
                onChange={handleFileChange}
                sx={{ display: "none" }}
              />
            </Button>

            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: "100%", mt: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!file || !password || loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Uploaded Statements
          </Typography>

          {fetching ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : statements.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
              No statements uploaded yet
            </Typography>
          ) : (
            <List sx={{ width: "100%" }}>
              {statements.map((statement) => (
                <Paper key={statement.id} sx={{ mb: 2, p: 2 }}>
                  <ListItem>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <DescriptionIcon fontSize="large" color="primary" />
                        <Box>
                          <Typography variant="subtitle1">Statement ID: {statement.id}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Uploaded: {formatDate(statement.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title="View PDF">
                          <IconButton
                            color="primary"
                            href={statement.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DescriptionIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default PdfUpload;
