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
  CircularProgress,
  Container,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  upload_statement_service,
  get_current_statement_service,
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
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
              gap: 2,
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

            {uploadStatus === "success" && (
              <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
                File uploaded successfully!
              </Alert>
            )}

            {uploadStatus === "error" && (
              <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                {file
                  ? "Failed to upload file. Please try again."
                  : "Please select a valid PDF file."}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!file || loading}
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
                        width: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <DescriptionIcon fontSize="large" color="primary" />
                        <Box>
                          <Typography variant="subtitle1">
                            Statement ID: {statement.id}
                          </Typography>
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
                        {/* <Tooltip title="Delete">
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip> */}
                      </Stack>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PdfUpload;