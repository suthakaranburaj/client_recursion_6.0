// authServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { AUTH } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const save_user_service = asyncHandler(async (payload) => {
  return await apiClient.post(`${AUTH}/save`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
});

export const logout_service = asyncHandler(async () => {
  const response = await apiClient.get(`${AUTH}/logout`);
  localStorage.removeItem("user");
  return response;
});

export const login_service = asyncHandler(async (payload) => {
  return await apiClient.post(`${AUTH}/login`, payload);
});

export const get_current_user_service = asyncHandler(async () => {
  const response = await apiClient.get(`${AUTH}`);
  localStorage.setItem("user", JSON.stringify(response.data.data));
  return response;
});