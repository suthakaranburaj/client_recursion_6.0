import axios from "axios";
import { EMAIL } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const email_send_otp_services = asyncHandler(async (payload) => {
  const response = await axios.post(`${EMAIL}/send-otp`, payload, {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  });
  return response;
});

export const email_verify_otp_services = asyncHandler(async (payload) => {
  const response = await axios.post(`${EMAIL}/verify-otp`, payload, {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  });
  return response;
});
