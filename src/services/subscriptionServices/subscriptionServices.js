// authServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { SUBS } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const buy_subscription = asyncHandler(async (payload) => {
  return await apiClient.post(`${SUBS}/add`, payload, {
   
  });
});

export const cancel_subscription = asyncHandler(async () => {
  const response = await apiClient.post(`${SUBS}/cancel`);
  
  return response;
});

// export const login_service = asyncHandler(async (payload) => {
//   return await apiClient.post(`${AUTH}/login`, payload);
// });

// export const get_current_user_service = asyncHandler(async () => {
//   const response = await apiClient.get(`${AUTH}`);
//   localStorage.setItem("user", JSON.stringify(response.data.data));
//   return response;
// });