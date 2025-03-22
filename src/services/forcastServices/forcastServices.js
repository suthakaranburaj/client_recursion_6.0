// emailServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { FORCAST } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const forecast_services = asyncHandler(async () => {
  return await apiClient.get(`${FORCAST}`);
});

// export const email_verify_otp_services = asyncHandler(async (payload) => {
//   return await apiClient.post(`${EMAIL}/verify-otp`, payload);
// });
