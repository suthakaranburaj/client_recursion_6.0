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
  Box
} from "@mui/material";
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {step === 1 && "Connect Wallet"}
        {step === 2 && "Sign Message"}
        {step === 3 && "Link to Existing Account"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" paragraph>
            {error}
          </Typography>
        )}

        {step === 1 && (
          <>
            <Typography paragraph>
              Connect your Ethereum wallet to sign in or create an account.
            </Typography>
            <Box display="flex" justifyContent="center" my={2}>
              <Button variant="contained" onClick={connectWallet} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Connect Wallet"}
              </Button>
            </Box>
            <Typography align="center">
              or <Button onClick={onSwitchToTraditional}>use traditional login</Button>
            </Typography>
          </>
        )}

        {step === 2 && (
          <>
            <Typography paragraph>
              Please sign the following message in your wallet to authenticate:
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {message}
            </Typography>
            <Box display="flex" justifyContent="center" my={2}>
              <Button variant="contained" onClick={signMessage} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Sign Message"}
              </Button>
            </Box>
          </>
        )}

        {step === 3 && (
          <>
            <Typography paragraph>Link your wallet to an existing account:</Typography>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box display="flex" justifyContent="center" my={2}>
              <Button
                variant="contained"
                onClick={linkAccounts}
                disabled={loading || !email || !password}
              >
                {loading ? <CircularProgress size={24} /> : "Link Accounts"}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Web3Login;
