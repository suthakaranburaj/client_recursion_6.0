// src/components/auth/Web3Login.js
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
  IconButton
} from "@mui/material";
import { AccountBalanceWallet, Fingerprint, Link, Close } from "@mui/icons-material";
// ... keep existing imports ...
import {
  initiateWeb3LoginService,
  verifyWeb3AuthService,
  linkWalletToAccountService
} from "../../../services/web3Service/web3Service";
import { login_service } from "../../../services/authServices/authServices";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

const Web3Login = ({ open, onClose, onSwitchToTraditional }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1: Initiate, 2: Verify, 3: Link
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storedNonce, setStoredNonce] = useState("");

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError("");

      // Improved provider detection
      const provider = await detectEthereumProvider({
        mustBeMetaMask: false, // Detect any EIP-1193 provider
        timeout: 3000 // 3 seconds timeout
      });

      if (!provider) {
        setError("Please install MetaMask or another Web3 wallet");
        return;
      }

      // Request accounts access
      const accounts = await provider.request({
        method: "eth_requestAccounts"
      });

      const address = accounts[0];
      setWalletAddress(address);

      // Initiate Web3 login
      const response = await initiateWeb3LoginService(address);
      setMessage(response.data.data.message);
      setStoredNonce(response.data.data.nonce); // Store the nonce
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const signMessage = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        throw new Error("Ethereum provider not found");
      }

      // Extract nonce from server response (assuming message contains it)
      const nonceMatch = message.match(/Nonce: (\w+)/);
      if (!nonceMatch) throw new Error("Invalid authentication message");
      const nonce = nonceMatch[1];

      // Reconstruct the EXACT message the server expects
      const signingMessage = `Authentication request for ${walletAddress.toLowerCase()} - Nonce: ${storedNonce}`;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(signingMessage);

      // Verify with the exact same message
      const verifyResponse = await verifyWeb3AuthService({
        walletAddress: walletAddress.toLowerCase(), // Consistent casing
        signature,
        message: signingMessage // Send the exact signed message
      });

      if (verifyResponse.data.success) {
        if (verifyResponse.data.data.userExists) {
          onClose();
          window.location.reload();
        } else {
          setStep(3);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const linkAccounts = async () => {
    try {
      setLoading(true);
      await linkWalletToAccountService({
        walletAddress,
        email,
        password,
        signature
      });
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box display="flex" alignItems="center">
          {step === 1 && <AccountBalanceWallet sx={{ mr: 1 }} />}
          {step === 2 && <Fingerprint sx={{ mr: 1 }} />}
          {step === 3 && <Link sx={{ mr: 1 }} />}
          {step === 1 && "Connect Wallet"}
          {step === 2 && "Verify Ownership"}
          {step === 3 && "Link Account"}
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "error.main", color: "white" }}>
            <Typography variant="body2">{error}</Typography>
          </Paper>
        )}

        {step === 1 && (
          <Box textAlign="center" py={3}>
            <AccountBalanceWallet sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Connect Your Wallet
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Secure login using your Ethereum wallet. We support MetaMask, Coinbase Wallet, and
              more.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={connectWallet}
              disabled={loading}
              sx={{ mt: 3, mb: 2, minWidth: 200 }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </Button>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Button variant="outlined" color="primary" onClick={onSwitchToTraditional}>
              Use Email & Password
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box py={2}>
            <Typography variant="h6" gutterBottom align="center">
              Signature Required
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" paragraph>
              Please sign the message below in your wallet to verify ownership
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, my: 3, bgcolor: "background.paper" }}>
              <Typography variant="caption" component="div" color="textSecondary">
                Verification Message:
              </Typography>
              <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: "break-word" }}>
                {message}
              </Typography>
            </Paper>

            <Box textAlign="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={signMessage}
                disabled={loading}
                size="large"
                sx={{ minWidth: 200 }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? "Verifying..." : "Sign Message"}
              </Button>
            </Box>
          </Box>
        )}

        {step === 3 && (
          <Box py={2}>
            <Typography variant="h6" gutterBottom align="center">
              Link to Existing Account
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" paragraph>
              Connect your wallet to an existing account by verifying your credentials
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 3 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Box textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={linkAccounts}
                disabled={loading || !email || !password}
                size="large"
                sx={{ minWidth: 200 }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? "Linking..." : "Link Accounts"}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Web3Login;
