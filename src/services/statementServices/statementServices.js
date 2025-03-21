// authServices.js
import { apiClient } from "../../helper/commonHelper.js";
import { STATEMENT } from "../index.js";
import { asyncHandler } from "../../helper/commonHelper.js";

export const get_current_statement_service = asyncHandler(async () => {
  const response = await apiClient.get(`${STATEMENT}/getAll`);
  // console.log(response);
  
  localStorage.setItem("statement", JSON.stringify(response.data.data));
  return response;
});

export const upload_statement_service = asyncHandler(async (payload) => {
    return await apiClient.post(`${STATEMENT}/save`, payload);
  });


export const get_all_statement_service = asyncHandler(async () => {
  return await apiClient.get(`${STATEMENT}/get_all_transactions`);
});

