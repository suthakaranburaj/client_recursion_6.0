import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import * as Pages from "../index"; // Adjust import path as needed

export const AuthGuard = ({ children }) => {
  const [authView, setAuthView] = useState(null);
  const [user, setUser] = useState(null);
  const [statement, setStatement] = useState(null);

  // Recheck user and statement when authView changes (modal closes)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedStatement = localStorage.getItem("statement");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Parse the user object
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setStatement(storedStatement);
  }, [authView]);

  // If user is logged in but hasn't uploaded a PDF, show the PdfUpload component
  if (user && !statement) {
    return <Pages.PdfUpload />;
  }

  // If user is logged in and has uploaded a PDF, show the children
  if (user && statement) {
    return children;
  }

  // If user is not logged in, show the login/register UI
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
      <Typography variant="h5" gutterBottom>
        Authentication Required
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please login or register to access this page.
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => setAuthView("login")}
          color="primary"
        >
          Login
        </Button>
        <Button
          variant="outlined"
          onClick={() => setAuthView("register")}
          color="primary"
        >
          Register
        </Button>
      </Box>

      {/* Login Modal */}
      {authView === "login" && (
        <Pages.Login
          onSwitchToRegister={() => setAuthView("register")}
          onClose={() => setAuthView(null)}
        />
      )}

      {/* Register Modal */}
      {authView === "register" && (
        <Pages.Register
          onSwitchToLogin={() => setAuthView("login")}
          onClose={() => setAuthView(null)}
        />
      )}
    </Box>
  );
};