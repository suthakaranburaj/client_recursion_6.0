import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Input,
  Alert,
  Paper,
  List,
  ListItem,
  CircularProgress
} from "@mui/material";
import {
  upload_statement_service,
  get_current_statement_service
} from "../../../services/statementServices/statementServices";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState([]);
  const [fetching, setFetching] = useState(true);

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
      setUploadStatus(null);
    } else {
      setUploadStatus("error");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadStatus("error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("statements", file);

      const response = await upload_statement_service(formData);
      if (response.data.status === true) {
        setUploadStatus("success");
        setFile(null);
        localStorage.setItem("statement", "uploaded");
        await fetchStatements(); // Refresh the list after upload
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        p: 3
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          mb: 4,
          textAlign: "center"
        }}
      >
        <Typography variant="h4" gutterBottom>
          Upload PDF File
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please select a PDF file to upload
        </Typography>

        <Input
          type="file"
          inputProps={{ accept: "application/pdf" }}
          onChange={handleFileChange}
          sx={{ mb: 2 }}
        />

        {file && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected file: {file.name}
          </Typography>
        )}

        {uploadStatus === "success" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            File uploaded successfully!
          </Alert>
        )}

        {uploadStatus === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {file ? "Failed to upload file. Please try again." : "Please select a valid PDF file."}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!file || loading}
          sx={{ mb: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>

        <Typography variant="h5" gutterBottom>
          Uploaded Statements
        </Typography>

        {fetching ? (
          <CircularProgress />
        ) : statements.length === 0 ? (
          <Typography variant="body1">No statements uploaded yet</Typography>
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
                    <Box>
                      <Typography variant="subtitle1">Statement ID: {statement.id}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Uploaded: {formatDate(statement.createdAt)}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      href={statement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </Button>
                  </Box>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default PdfUpload;
