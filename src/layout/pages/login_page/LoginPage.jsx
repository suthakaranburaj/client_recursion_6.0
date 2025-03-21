import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Button,
  Container,
  Typography,
  Box,
  Link,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import {
  login_service,
  get_current_user_service,
} from "../../../services/authServices/authServices";
import { getCookie } from "../../../helper/commonHelper";

const LoginPage = ({ onSwitchToRegister, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, severity = "error") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      showToast("Please fill in all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const payload = {
        email: email,
        password: password,
      };
      const response = await login_service(payload);

      if (response.data.status) {
        showToast("Login successful!", "success");
        await handle_get_user();

        const endTime = Date.now();
        const timeDiff = endTime - startTime;

        // Ensure loader runs for at least 2 seconds
        if (timeDiff < 2000) {
          setTimeout(() => {
            window.location.reload();
            setTimeout(onClose, 2000);
            setIsLoading(false);
          }, 2000 - timeDiff);
        } else {
          window.location.reload();
          setTimeout(onClose, 2000);
          setIsLoading(false);
        }
      } else {
        showToast(response.data.message || "Login failed");
        setIsLoading(false);
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      await handle_get_user();
    };
    checkUser();
  }, [onClose]);

  const handle_get_user = async () => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    if (!accessToken || !refreshToken) {
      localStorage.removeItem("user");
      return;
    }

    try {
      const response = await get_current_user_service();
      if (response.data.data) {
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("user");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(4px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            width: "100%",
            backgroundColor: "background.paper",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!email && toastSeverity === "error"}
              helperText={!email && "Email is required"}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!password && toastSeverity === "error"}
              helperText={!password && "Password is required"}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            <Box sx={{ mt: 1.5, textAlign: "center" }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={onSwitchToRegister}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;