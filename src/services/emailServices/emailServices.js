// emailServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { EMAIL } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const email_send_otp_services = asyncHandler(async (payload) => {
  return await apiClient.post(`${EMAIL}/send-otp`, payload);
});

export const email_verify_otp_services = asyncHandler(async (payload) => {
  return await apiClient.post(`${EMAIL}/verify-otp`, payload);
});
