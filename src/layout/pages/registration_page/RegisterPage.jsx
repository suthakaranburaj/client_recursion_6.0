import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { save_user_service } from "../../../services/authServices/authServices";
import {
  email_send_otp_services,
  email_verify_otp_services
} from "../../../services/emailServices/emailServices";

const RegisterPage = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");

  const showToast = (message, severity = "error") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "confirmPassword" || name === "password") {
      setPasswordError("");
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      showToast("Please enter email first");
      return;
    }

    setLoading(true);
    try {
      const payload = { email: formData.email };
      const response = await email_send_otp_services(payload);
      if (response.status) {
        setOtpSent(true);
        setOtpDialogOpen(true);
        showToast("OTP sent to your email", "success");
      } else {
        showToast(response.message || "Failed to send OTP");
      }
    } catch (error) {
      showToast("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!verificationOtp) {
      showToast("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        otp: verificationOtp
      };
      const response = await email_verify_otp_services(payload);

      if (response.status) {
        setIsVerified(true);
        setOtpDialogOpen(false);
        showToast("Email verified successfully", "success");
      } else {
        showToast(response.message || "Invalid OTP");
      }
    } catch (error) {
      showToast("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      showToast("Please verify your email first");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords don't match!");
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmPassword") formPayload.append(key, value);
    });

    try {
      const response = await save_user_service(formPayload);
      
      if(response.status){
        showToast(response.message || "Registration successful!", "success");
        setTimeout(onClose, 2000);
      }
      else{
        showToast(response.message || "Registration failed!");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed");
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
        justifyContent: "center"
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Account
          </Typography>

          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                fullWidth
                required
              />

              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />

              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />

              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  disabled={isVerified}
                />
                {isVerified ? (
                  <CheckCircleIcon color="success" fontSize="large" />
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSendOtp}
                    disabled={!formData.email || loading}
                    sx={{ height: 56 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Verify"}
                  </Button>
                )}
              </Stack>

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!passwordError}
                helperText={passwordError}
              />

              <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5 }}>
                Upload Profile Image
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {formData.image && (
                <Typography variant="caption" color="text.secondary">
                  Selected: {formData.image.name}
                </Typography>
              )}

              {passwordError && <Alert severity="error">{passwordError}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!isVerified}
                sx={{ mt: 2 }}
              >
                Register
              </Button>

              <Typography align="center" sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link component="button" type="button" onClick={onSwitchToLogin} color="primary">
                  Sign In
                </Link>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Container>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
        <Box sx={{ p: 3 }}>
          <DialogTitle align="center">Verify Email</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography>We've sent a 6-digit code to your email</Typography>
              <TextField
                label="Enter OTP"
                value={verificationOtp}
                onChange={(e) => setVerificationOtp(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Verify Code"}
              </Button>
            </Stack>
          </DialogContent>
        </Box>
      </Dialog>

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

export default RegisterPage;
