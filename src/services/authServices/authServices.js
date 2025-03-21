import axios from "axios";
import { AUTH } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const save_user_service = asyncHandler(async (payload) => {
  const response = await axios.post(`${AUTH}/save`, payload, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    withCredentials: true
  });
  return response;
});

export const logout_service = asyncHandler(async () => {
  const response = await axios.get(`${AUTH}/logout`, {
    withCredentials: true // Enable credentials
  });
  localStorage.removeItem("user");
  return response;
});

export const login_service = asyncHandler(async (payload) => {
  const response = await axios.post(`${AUTH}/login`, payload, {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true // Changed from true to false
  });
  return response;
});

export const get_current_user_service = asyncHandler(async () => {
  const response = await axios.get(`${AUTH}`, {
    withCredentials: true // Enable credentials
  });
  console.log("response", response.data.data);
  localStorage.setItem("user", JSON.stringify(response.data.data));

  return response;
});
