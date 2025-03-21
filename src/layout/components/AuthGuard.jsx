import React,{ useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import * as Pages from "../index.js"; // Adjust import path as needed

export const AuthGuard = ({ children }) => {
  const [authView, setAuthView] = useState(null);
  const user = localStorage.getItem("user");

  // Recheck user when authView changes (modal closes)
  React.useEffect(() => {
    // Optional: Add any additional session checking logic here
  }, [authView]);

  if (user) {
    return children;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 3
      }}
    >
      <Typography variant="h5" gutterBottom>
        Authentication Required
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please login or register to access this page.
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => setAuthView("login")} color="primary">
          Login
        </Button>
        <Button variant="outlined" onClick={() => setAuthView("register")} color="primary">
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
