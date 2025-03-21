import React, { useState } from "react";
import { Box, Typography, Button, Input, Alert } from "@mui/material";
import { upload_statement_service } from "../../../services/statementServices/statementServices";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // Can be "success", "error", or null
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadStatus(null); // Reset status on new file selection
    } else {
      setUploadStatus("error");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setUploadStatus("error");
      return;
    }

    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("statements", file); // Append the file to the FormData object

      // Call the upload service
      const response = await upload_statement_service(formData);
      console.log(response)
      if (response.data.status == true) {
        setUploadStatus("success");
        setFile(null); // Clear the file input after successful upload

        // Set statement in localStorage after successful upload
        localStorage.setItem("statement", "uploaded");
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Upload PDF File
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please select a PDF file to upload.
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
        disabled={!file || loading} // Disable button if no file is selected or during loading
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </Box>
  );
};

export default PdfUpload;