import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  Grid,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  save_user_service,
  get_current_user_service
} from "../../../services/authServices/authServices";
import {
  buy_subscription,
  cancel_subscription
} from "../../../services/subscriptionServices/subscriptionServices";
buy_subscription;
import {
  email_send_otp_services,
  email_verify_otp_services
} from "../../../services/emailServices/emailServices";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          No user data found. Please log in.
        </Typography>
      </Container>
    );
  }

  const [profileData, setProfileData] = useState({
    name: user.name,
    username: user.username,
    phone: user.phone,
    email: user.email,
    image: user.image,
    subscription: user.subscription || false
  });

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editImageMode, setEditImageMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");
  const [selectedImage, setSelectedImage] = useState(null);
  const [bankStatementFile, setBankStatementFile] = useState(null);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const showToast = (message, severity = "error") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setProfileData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file)
      }));
    }
  };

  const handleBankStatementChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setBankStatementFile(file);
    } else {
      showToast("Please upload a valid PDF file.");
    }
  };

  const handleUploadBankStatement = () => {
    if (!bankStatementFile) {
      showToast("Please select a PDF file first.");
      return;
    }

    // Simulate file upload (replace with actual API call)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Bank statement uploaded successfully!", "success");
      setBankStatementFile(null);
    }, 2000);
  };

  const handleSendOtp = async () => {
    if (!profileData.email) {
      showToast("Please enter email first");
      return;
    }

    setLoading(true);
    try {
      const payload = { email: profileData.email };
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
        email: profileData.email,
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

  const handleSaveProfile = async () => {
    if (profileData.email !== user.email && !isVerified) {
      showToast("Please verify your email first");
      return;
    }

    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("user_id", user.user_id);
    formPayload.append("name", profileData.name);
    formPayload.append("username", profileData.username);
    formPayload.append("email", profileData.email);
    formPayload.append("phone", profileData.phone);

    try {
      const response = await save_user_service(formPayload);
      if (response.status) {
        showToast("Profile updated successfully!", "success");
        const updatedUserResponse = await get_current_user_service();
        const updatedUser = updatedUserResponse.data.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditProfileMode(false);
      } else {
        showToast(response.message || "Failed to update profile");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!selectedImage) {
      showToast("Please select an image first");
      return;
    }

    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("user_id", user.user_id);
    formPayload.append("image", selectedImage);

    try {
      const response = await save_user_service(formPayload);
      if (response.status) {
        showToast("Profile image updated successfully!", "success");
        const updatedUserResponse = await get_current_user_service();
        const updatedUser = updatedUserResponse.data.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditImageMode(false);
        setSelectedImage(null);
      } else {
        showToast(response.message || "Failed to update profile image");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update profile image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      // formPayload.append("user_id", user.user_id);
      // formPayload.append("subscription", false);

      const response = await cancel_subscription();
      if (response.status) {
        const updatedUserResponse = await get_current_user_service();
        const updatedUser = updatedUserResponse.data.data;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfileData((prev) => ({ ...prev, subscription: false }));
        showToast("Subscription cancelled successfully", "success");
      } else {
        showToast(response.message || "Failed to cancel subscription");
      }
    } catch (error) {
      showToast("Failed to cancel subscription");
    } finally {
      setIsLoading(false);
    }
  };

  // Add new state variables
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });
  const [paymentError, setPaymentError] = useState("");

  // Add these to your component
  const validateCardDetails = () => {
    if (!cardDetails.number.match(/^4242 4242 4242 4242$/)) {
      setPaymentError("Please use 4242 4242 4242 4242 for purposes");
      return false;
    }
    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      setPaymentError("Invalid expiration date (MM/YY)");
      return false;
    }
    if (!cardDetails.cvc.match(/^\d{3}$/)) {
      setPaymentError("Invalid CVC");
      return false;
    }
    if (cardDetails.name.trim() === "") {
      setPaymentError("Cardholder name is required");
      return false;
    }
    return true;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceedToPayment = async () => {
    if (!validateCardDetails()) return;

    setPaymentProcessing(true);
    setPaymentError("");

    try {
      // Simulate different payment processing steps
      setCurrentStep(1);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Card validation

      setCurrentStep(2);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Payment processing

      setCurrentStep(3);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Confirmation

      // 20% chance to fail for demonstration
      if (Math.random() < 0.2) {
        throw new Error("Payment failed due to insufficient funds");
      }

      const response = await buy_subscription({ is_paid: true });

      if (response.status) {
        const updatedUser = await get_current_user_service();
        localStorage.setItem("user", JSON.stringify(updatedUser.data.data));
        setProfileData((prev) => ({ ...prev, subscription: true }));
        setSubscriptionDialogOpen(false);
        showToast("Payment successful! Premium activated.", "success");
      }
    } catch (error) {
      setPaymentError(error.message || "Payment failed. Please try again.");
      showToast(error.message || "Payment failed", "error");
    } finally {
      setPaymentProcessing(false);
      setCurrentStep(1);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
            Profile
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            Manage your account details and preferences
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={12} lg={4} sx={{ textAlign: "center" }}>
            <Avatar
              src={profileData.image || "https://via.placeholder.com/150"}
              alt="Profile"
              sx={{
                width: 150,
                height: 150,
                mx: "auto",
                border: "2px solid",
                borderColor: "primary.main"
              }}
            />
            {editImageMode ? (
              <>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ mt: 2, width: "100%", maxWidth: 200 }}
                >
                  Upload New Image
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveImage}
                    disabled={!selectedImage || isLoading}
                    sx={{ mr: 2 }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditImageMode(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mt: 2 }}
                onClick={() => setEditImageMode(true)}
              >
                Edit Image
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={12} lg={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Personal Information
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                  Full Name
                </Typography>
                {editProfileMode ? (
                  <TextField
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    fullWidth
                  />
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {profileData.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                  Username
                </Typography>
                {editProfileMode ? (
                  <TextField
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    fullWidth
                  />
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {profileData.username}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                  Email
                </Typography>
                {editProfileMode ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={isVerified}
                    />
                    {isVerified ? (
                      <CheckCircleIcon color="success" fontSize="large" />
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleSendOtp}
                        disabled={!profileData.email || loading}
                      >
                        {loading ? <CircularProgress size={24} /> : "Verify"}
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {profileData.email}
                  </Typography>
                )}
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                  Phone Number
                </Typography>
                {editProfileMode ? (
                  <TextField
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    fullWidth
                  />
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {profileData.phone}
                  </Typography>
                )}
              </Box>
              // Add this to your profile component
              {user.wallet_address && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6">Wallet Information</Typography>
                  <Typography variant="body2">Connected wallet: {user.wallet_address}</Typography>
                  {!user.email && (
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => setShowLinkAccount(true)}
                    >
                      Link Email Account
                    </Button>
                  )}
                </Box>
              )}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                  Subscription
                </Typography>
                {editProfileMode ? (
                  <TextField
                    value={profileData.subscription ? "Finance Tracker Premium" : "Free version"}
                    disabled
                    fullWidth
                  />
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {profileData.subscription ? "Finance Tracker Premium" : "Free version"}
                  </Typography>
                )}
              </Box>
              {editProfileMode ? (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditProfileMode(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => alert("Delete Account")}
                  >
                    Delete Account
                  </Button>
                  {profileData.subscription ? (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                    >
                      Cancel Subscription
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => setSubscriptionDialogOpen(true)}
                      disabled={isLoading}
                    >
                      Buy Subscription
                    </Button>
                  )}
                </Stack>
              ) : (
                <Stack direction={{ xs: "column", md: "column", lg: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setEditProfileMode(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => alert("Delete Account")}
                  >
                    Delete Account
                  </Button>
                  {profileData.subscription ? (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleCancelSubscription}
                      disabled={isLoading}
                    >
                      Cancel Subscription
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => setSubscriptionDialogOpen(true)}
                      disabled={isLoading}
                    >
                      Buy Subscription
                    </Button>
                  )}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
        {/* 
        <Divider sx={{ mt: 4, mb: 4 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Additional Actions
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="outlined" component="label" sx={{ px: 4, py: 2 }}>
                Add Bank Statement
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleBankStatementChange}
                />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleUploadBankStatement}
                disabled={!bankStatementFile || isLoading}
                sx={{ px: 4, py: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Upload"}
              </Button>
            </Grid>
          </Grid>
        </Box> */}
      </Paper>

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

      <Dialog open={subscriptionDialogOpen} onClose={() => setSubscriptionDialogOpen(false)}>
        <DialogTitle>
          Choose Your Plan
          <IconButton
            onClick={() => setSubscriptionDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Paper
                onClick={() => setSelectedPlan("free")}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  border:
                    selectedPlan === "free" ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.12)"
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Free Plan
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="✓ Limited PDF statements allowed" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✗ No advanced chatbot" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper
                onClick={() => setSelectedPlan("premium")}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  border:
                    selectedPlan === "premium" ? "2px solid #1976d2" : "1px solid rgba(0,0,0,0.12)"
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Finance Tracker Premium
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="✓ Advanced chatbot" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✓ Unlimited PDF statements" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✓ Alert budget system" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="✓ Budget forecast" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
          {selectedPlan === "premium" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Box component="form" sx={{ maxWidth: 500, mx: "auto" }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleCardInputChange}
                  placeholder="4242 4242 4242 4242"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiration (MM/YY)"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardInputChange}
                      placeholder="12/24"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVC"
                      name="cvc"
                      value={cardDetails.cvc}
                      onChange={handleCardInputChange}
                      placeholder="123"
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardInputChange}
                  placeholder="John Doe"
                  sx={{ mt: 2 }}
                />

                {paymentError && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {paymentError}
                  </Typography>
                )}

                {paymentProcessing && (
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {
                        ["Validating card...", "Processing payment...", "Confirming..."][
                          currentStep - 1
                        ]
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={() => setSubscriptionDialogOpen(false)} disabled={paymentProcessing}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={selectedPlan !== "premium" || paymentProcessing}
              onClick={handleProceedToPayment}
            >
              {paymentProcessing ? "Processing..." : "Pay ₹399/month"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

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
    </Container>
  );
}

export default ProfilePage;
