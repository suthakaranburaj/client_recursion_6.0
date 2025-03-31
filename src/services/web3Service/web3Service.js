import { ethers } from "ethers";
import { apiClient } from "../../helper/commonHelper.js";
import Cookies from "js-cookie";
import { WEB3 } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";


export const initiateWeb3LoginService = asyncHandler(async (walletAddress) => {
  return await apiClient.post(`${WEB3}/initiate`, { walletAddress });
});

export const verifyWeb3AuthService = asyncHandler(async (payload) => {
  return await apiClient.post(`${WEB3}/verify`, payload);
});

export const linkWalletToAccountService = asyncHandler(async (payload) => {
  return await apiClient.post(`${WEB3}/link`, payload);
});

export const getTransactionTraceService = asyncHandler(async (txHash) => {
  return await apiClient.get(`${WEB3}/blockchain/tx-trace/${txHash}`);
});
